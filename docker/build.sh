#!/bin/bash
set -e

cd /workspace

BOARD="nice_nano_v2"
CONFIG_DIR="/workspace/config"
OUTPUT_DIR="/workspace/docker/output"

# Define build targets
SHIELDS=("StackOverChonk_left" "StackOverChonk_right" "settings_reset")

echo "=== ZMK Firmware Build ==="

# Initialize west workspace if needed
if [ ! -f ".west/config" ]; then
    echo "Initializing west workspace..."
    west init -l config/
fi

# Always set project filter (skip HALs we don't need - only keep Nordic for nRF52840)
echo "Configuring project filter..."
west config manifest.project-filter -- "-hal_altera -hal_ambiq -hal_atmel -hal_espressif -hal_ethos_u -hal_gigadevice -hal_infineon -hal_intel -hal_microchip -hal_nuvoton -hal_nxp -hal_openisa -hal_quicklogic -hal_renesas -hal_rpi_pico -hal_silabs -hal_st -hal_stm32 -hal_telink -hal_ti -hal_wurthelektronik -hal_xtensa -liblc3 -lvgl -mcuboot -openthread -picolibc -sof -trusted-firmware-m -trusted-firmware-a -tflite-micro -edtt"

# Update dependencies
echo "Updating dependencies..."
west update

# Export Zephyr
echo "Exporting Zephyr..."
west zephyr-export

# Build each target
for SHIELD in "${SHIELDS[@]}"; do
    BUILD_DIR="build/${SHIELD}"
    echo ""
    echo "=== Building ${SHIELD} ==="

    west build -s zmk/app -d "$BUILD_DIR" -b "$BOARD" -p -- \
        -DZMK_CONFIG="$CONFIG_DIR" \
        -DBOARD_ROOT="/workspace" \
        -DSHIELD="$SHIELD"

    # Copy output file
    if [ -f "${BUILD_DIR}/zephyr/zmk.uf2" ]; then
        cp "${BUILD_DIR}/zephyr/zmk.uf2" "${OUTPUT_DIR}/${SHIELD}-${BOARD}.uf2"
        echo "Output: ${OUTPUT_DIR}/${SHIELD}-${BOARD}.uf2"
    fi
done

echo ""
echo "=== Build Complete ==="
echo "Firmware files in: docker/output/"
ls -la "$OUTPUT_DIR"/*.uf2 2>/dev/null || echo "No .uf2 files found"
