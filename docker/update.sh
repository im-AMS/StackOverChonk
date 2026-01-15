#!/bin/bash
set -e

cd /workspace

echo "=== ZMK Dependencies Update ==="

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

echo "=== Update Complete ==="
