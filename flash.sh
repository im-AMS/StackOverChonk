#!/bin/bash
set -e

SIDE=${1:-left}
FIRMWARE="docker/output/StackOverChonk_${SIDE}-nice_nano_v2.uf2"

# Handle special case for settings_reset
if [ "$SIDE" = "reset" ] || [ "$SIDE" = "settings_reset" ]; then
    FIRMWARE="docker/output/settings_reset-nice_nano_v2.uf2"
fi

if [ ! -f "$FIRMWARE" ]; then
    echo "Error: Firmware not found: $FIRMWARE"
    echo ""
    echo "Available firmware:"
    ls -1 docker/output/*.uf2 2>/dev/null || echo "  None - run 'make build' first"
    exit 1
fi

echo "Firmware: $FIRMWARE"
echo "Size: $(du -h "$FIRMWARE" | cut -f1)"
echo ""
echo "Waiting for keyboard in bootloader mode..."
echo ">>> Double-tap the reset button now! <<<"
echo ""

# Function to find the device
find_device() {
    # Method 1: Check if already mounted
    for path in /run/media/$USER/NICENANO /run/media/$USER/NRF52BOOT /media/$USER/NICENANO /media/$USER/NRF52BOOT /mnt/NICENANO; do
        if [ -d "$path" ]; then
            echo "mounted:$path"
            return 0
        fi
    done

    # Method 2: Check /dev/disk/by-id for Nice!Nano or nRF UF2
    for dev in /dev/disk/by-id/usb-*Nice*-0:0 /dev/disk/by-id/usb-*nRF*-0:0 /dev/disk/by-id/usb-*Adafruit*-0:0; do
        if [ -e "$dev" ]; then
            echo "device:$(readlink -f "$dev")"
            return 0
        fi
    done

    # Method 3: Look for small removable devices that appeared recently
    # UF2 bootloader shows up as ~4MB device
    for dev in /sys/block/sd*; do
        if [ -e "$dev" ]; then
            devname=$(basename "$dev")
            size=$(cat "$dev/size" 2>/dev/null || echo 0)
            removable=$(cat "$dev/removable" 2>/dev/null || echo 0)
            # ~4MB = ~8000 sectors (512 bytes each), allow some variance
            if [ "$removable" = "1" ] && [ "$size" -gt 4000 ] && [ "$size" -lt 20000 ]; then
                echo "device:/dev/$devname"
                return 0
            fi
        fi
    done

    return 1
}

# Wait for device
TIMEOUT=60
ELAPSED=0
FOUND=""

while [ -z "$FOUND" ] && [ $ELAPSED -lt $TIMEOUT ]; do
    FOUND=$(find_device 2>/dev/null || true)

    if [ -z "$FOUND" ]; then
        sleep 0.5
        ELAPSED=$((ELAPSED + 1))
        printf "\rWaiting... %ds " $ELAPSED
    fi
done

echo ""

if [ -z "$FOUND" ]; then
    echo "Timeout! Keyboard not detected."
    echo ""
    echo "Troubleshooting:"
    echo "  1. Make sure you double-tap reset (not single tap)"
    echo "  2. Check USB cable (some are charge-only)"
    echo "  3. Check dmesg: dmesg | tail -20"
    echo "  4. List devices: lsblk"
    echo "  5. Manual flash: sudo mount /dev/sdX /mnt && sudo cp $FIRMWARE /mnt/ && sudo umount /mnt"
    exit 1
fi

TYPE=$(echo "$FOUND" | cut -d: -f1)
TARGET=$(echo "$FOUND" | cut -d: -f2)

if [ "$TYPE" = "mounted" ]; then
    echo "Found mounted at: $TARGET"
    echo "Flashing..."
    cp "$FIRMWARE" "$TARGET/"
else
    echo "Found device: $TARGET"
    echo "Mounting and flashing (requires sudo)..."

    # Create temp mount point
    MOUNT_POINT=$(mktemp -d)
    trap "sudo umount '$MOUNT_POINT' 2>/dev/null; rmdir '$MOUNT_POINT' 2>/dev/null" EXIT

    sudo mount "$TARGET" "$MOUNT_POINT"
    sudo cp "$FIRMWARE" "$MOUNT_POINT/"
    sync
    sudo umount "$MOUNT_POINT"
fi

echo ""
echo "Done! Keyboard will reboot automatically."
echo ""

# For split keyboards, remind about other half
if [ "$SIDE" = "left" ]; then
    echo "Don't forget to flash the right half too:"
    echo "  ./flash.sh right"
elif [ "$SIDE" = "right" ]; then
    echo "Don't forget to flash the left half too:"
    echo "  ./flash.sh left"
fi
