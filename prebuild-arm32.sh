#!/bin/sh
set -e
set -x

CC_ARM="${HOME}/deployment/openwrt/staging_dir/toolchain-arm_cortex-a8+vfpv3_gcc-11.2.0_musl_eabi/bin/arm-openwrt-linux-gcc"
CXX_ARM="${HOME}/deployment/openwrt/staging_dir/toolchain-arm_cortex-a8+vfpv3_gcc-11.2.0_musl_eabi/bin/arm-openwrt-linux-g++"
STRIP_ARM="${HOME}/deployment/openwrt/staging_dir/toolchain-arm_cortex-a8+vfpv3_gcc-11.2.0_musl_eabi/bin/arm-openwrt-linux-strip"
STAGING_DIR="${PWD}/prebuilds"

# Build without --strip (host strip can't handle ARM binaries)
STAGING_DIR=$STAGING_DIR CC=$CC_ARM CXX=$CXX_ARM npx prebuildify --napi --platform linux --arch arm

# prebuildify's output layout depends on its version: older trees emit
# package/prebuilds/linux-arm/sockopt.node, 5.x emits prebuilds/linux-arm/*.node.
PREBUILT=$(ls package/prebuilds/linux-arm/sockopt.node prebuilds/linux-arm/*.node 2>/dev/null | head -n1)
[ -n "$PREBUILT" ] || { echo "prebuildify produced no artifact" >&2; exit 1; }

# Strip with ARM toolchain strip
$STRIP_ARM "$PREBUILT"
mkdir -p ./build/Release
cp "$PREBUILT" ./build/Release/sockopt.node
