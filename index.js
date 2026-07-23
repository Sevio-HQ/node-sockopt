'use strict'

const {
	getsockopt: _getsockopt,
	setsockopt: _setsockopt,
	setsockoptString: _setsockoptString,
} = require('node-gyp-build')(__dirname)

const fd = (socket) => {
	if (!socket._handle) {
		throw new Error(`\
Socket has no file descriptor yet. Did you call listen() or bind()?`)
	}
	return socket._handle.fd
}

const getsockopt = (socket, level, flagName) => {
	return _getsockopt(fd(socket), level, flagName)
}

const setsockoptString = (socket, level, flagName, flagValue) => {
	_setsockoptString(fd(socket), level, flagName, flagValue)
}

const setsockopt = (socket, level, flagName, flagValue) => {
	// Currently _setsockopt (& _getsockopt) only handles integers.
	// todo: fails with e.g. SO_RCVTIMEO/SO_SNDTIMEO, see #1
	if (!Number.isInteger(flagValue)) {
		throw new Error('flagValue must be an integer')
	}

	_setsockopt(fd(socket), level, flagName, flagValue)
}

module.exports = {getsockopt, setsockopt, setsockoptString}
