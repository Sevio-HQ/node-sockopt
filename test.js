'use strict'

const {createSocket} = require('dgram')
const {strictEqual: eql, notStrictEqual: notEql, ok, throws} = require('assert')
const {getsockopt, setsockopt, setsockoptString} = require('.')

const abortWithError = (err) => {
	console.error(err)
	process.exit(1)
}

const SOL_SOCKET = 0xffff
const SO_REUSEADDR = 0x0004
const SO_SNDBUF = 0x1001

const testSocket = (family, socket) => {
	const reusePort = !!getsockopt(socket, SOL_SOCKET, SO_REUSEADDR)
	eql(reusePort, false, 'precondition failed: SO_REUSEADDR is not false')

	setsockopt(socket, SOL_SOCKET, SO_REUSEADDR, +true)
	eql(!!getsockopt(socket, SOL_SOCKET, SO_REUSEADDR), true, 'setting SO_REUSEADDR failed')

	const sendBufSize = getsockopt(socket, SOL_SOCKET, SO_SNDBUF)
	notEql(sendBufSize, 1234, 'precondition failed: SO_SNDBUF is 1234')
	ok(Number.isInteger(sendBufSize), 'SO_SNDBUF is not an integer')

	setsockopt(socket, SOL_SOCKET, SO_SNDBUF, 1234)
	const actual = getsockopt(socket, SOL_SOCKET, SO_SNDBUF)
	ok(actual >= 2048, 'setting SO_SNDBUF failed, got ' + actual)

	console.info(family + ' looks good ✔︎')
}

const testSocketString = (family, socket) => {
	const SO_BINDTODEVICE = 25

	setsockoptString(socket, SOL_SOCKET, SO_BINDTODEVICE, 'lo')

	throws(() => {
		setsockoptString(socket, SOL_SOCKET, SO_BINDTODEVICE, 'nonexistent0')
	})

	console.info(family + ' string looks good ✔︎')
}

{
	const socket = createSocket({type: 'udp4'})
	socket.on('error', abortWithError)

	socket.bind(12345, '0.0.0.0', () => {
		testSocket('IPv4', socket)
		socket.close()
		})
	}

{
	const socket = createSocket({type: 'udp4'})
	socket.on('error', abortWithError)
	socket.bind(12346, '0.0.0.0', () => {
		testSocketString('IPv4', socket)
		socket.close()
	})
}

{
	const socket = createSocket({type: 'udp6'})
	socket.on('error', abortWithError)

	socket.bind(12345, '::', () => {
		testSocket('IPv6', socket)
		socket.close()
	})
}
