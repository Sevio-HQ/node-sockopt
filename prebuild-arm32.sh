#!/bin/sh
set -e
set -x

CC_ARM="${HOME}/deployment/openwrt/staging_dir/toolchain-arm_cortex-a8+vfpv3_gcc-11.2.0_musl_eabi/bin/arm-openwrt-linux-gcc"
CXX_ARM="${HOME}/deployment/openwrt/staging_dir/toolchain-arm_cortex-a8+vfpv3_gcc-11.2.0_musl_eabi/bin/arm-openwrt-linux-g++"
STRIP_ARM="${HOME}/deployment/openwrt/staging_dir/toolchain-arm_cortex-a8+vfpv3_gcc-11.2.0_musl_eabi/bin/arm-openwrt-linux-strip"
STAGING_DIR="${PWD}/prebuilds"

# Build without --strip (host strip can't handle ARM binaries)
STAGING_DIR=$STAGING_DIR CC=$CC_ARM CXX=$CXX_ARM npx prebuildify --napi --platform linux --arch arm

# Strip with ARM toolchain strip
$STRIP_ARM package/prebuilds/linux-arm/sockopt.node
cp ./package/prebuilds/linux-arm/sockopt.node ./build/Release
