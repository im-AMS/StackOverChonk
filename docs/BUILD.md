# ZMK Local Build System Documentation

This document explains the local Docker-based build system for the StackOverChonk keyboard firmware.

## Table of Contents

- [Quick Start](#quick-start)
- [Flashing Firmware](#flashing-firmware)
- [Build System Architecture](#build-system-architecture)
- [Deep Dive: How It All Works](#deep-dive-how-it-all-works)

---

## Quick Start

```bash
# Build all firmware (left, right, settings_reset)
make build

# Output files
ls docker/output/
# StackOverChonk_left-nice_nano_v2.uf2
# StackOverChonk_right-nice_nano_v2.uf2
# settings_reset-nice_nano_v2.uf2

# Other commands
make update      # Update ZMK/Zephyr dependencies only
make clean       # Remove build artifacts
make clean-all   # Also clear Docker cached dependencies
```

First build takes ~5-10 minutes (downloads dependencies). Subsequent builds are fast (~1-2 min).

---

## Flashing Firmware

### Method 1: Auto-mount (Easiest)

```bash
# 1. Put keyboard in bootloader mode:
#    - Double-tap the reset button, OR
#    - Hold boot button while plugging in USB

# 2. Wait for it to mount (check dmesg)
dmesg -w
# [xxxxx] usb 1-2: Product: Nice!Nano
# [xxxxx] usb 1-2: Manufacturer: Nice Keyboards
# [xxxxx] usb-storage 1-2:1.0: USB Mass Storage device detected

# 3. Find the mount point
lsblk
# or
findmnt -t vfat

# Usually mounts to /run/media/$USER/NICENANO or /media/$USER/NICENANO

# 4. Copy firmware
cp docker/output/StackOverChonk_left-nice_nano_v2.uf2 /run/media/$USER/NICENANO/

# Keyboard auto-reboots after flashing
```

### Method 2: Manual Mount

```bash
# 1. Put keyboard in bootloader mode (double-tap reset)

# 2. Find the device
lsblk
# Look for something like sda or sdb with ~4MB size

# 3. Mount it
sudo mkdir -p /mnt/keyboard
sudo mount /dev/sda /mnt/keyboard

# 4. Copy and unmount
sudo cp docker/output/StackOverChonk_left-nice_nano_v2.uf2 /mnt/keyboard/
sudo umount /mnt/keyboard

# Keyboard auto-reboots
```

### Method 3: Direct Write (No Mount)

```bash
# 1. Put keyboard in bootloader mode

# 2. Find the device
lsblk
# e.g., /dev/sda

# 3. Write directly using dd (careful with device name!)
sudo dd if=docker/output/StackOverChonk_left-nice_nano_v2.uf2 of=/dev/sda bs=512

# Or use cat
sudo cat docker/output/StackOverChonk_left-nice_nano_v2.uf2 > /dev/sda
```

### Method 4: Using uf2conv (Python)

```bash
# Install uf2conv
pip install uf2conv

# Flash
uf2conv docker/output/StackOverChonk_left-nice_nano_v2.uf2 --deploy
```

### Flashing Script

Create `flash.sh` for convenience:

```bash
#!/bin/bash
set -e

SIDE=${1:-left}
FIRMWARE="docker/output/StackOverChonk_${SIDE}-nice_nano_v2.uf2"

if [ ! -f "$FIRMWARE" ]; then
    echo "Firmware not found: $FIRMWARE"
    echo "Run 'make build' first"
    exit 1
fi

echo "Waiting for keyboard in bootloader mode..."
echo "Double-tap reset button now!"

# Wait for device
while [ ! -d /run/media/$USER/NICENANO ] && [ ! -d /media/$USER/NICENANO ]; do
    sleep 0.5
done

MOUNT=$(find /run/media/$USER /media/$USER -maxdepth 1 -name "NICENANO" 2>/dev/null | head -1)

echo "Found: $MOUNT"
echo "Flashing $SIDE half..."

cp "$FIRMWARE" "$MOUNT/"

echo "Done! Keyboard will reboot."
```

Usage:
```bash
chmod +x flash.sh
./flash.sh left   # Flash left half
./flash.sh right  # Flash right half
```

### Settings Reset

If your keyboard is acting weird (pairing issues, stuck keys, etc.):

```bash
# Flash the settings_reset firmware to clear stored settings
cp docker/output/settings_reset-nice_nano_v2.uf2 /run/media/$USER/NICENANO/

# Then flash the normal firmware again
# (put in bootloader mode again)
cp docker/output/StackOverChonk_left-nice_nano_v2.uf2 /run/media/$USER/NICENANO/
```

---

## Build System Architecture

### Overview

```
Your Config Repo          ZMK Firmware           Zephyr RTOS
     │                        │                      │
     │   ┌────────────────────┴──────────────────────┘
     │   │
     ▼   ▼
   Docker Container (zmkfirmware/zmk-build-arm)
         │
         ▼
   ARM GCC Toolchain compiles → .uf2 firmware
```

### File Structure

```
StackOverChonk/
├── config/
│   ├── west.yml              # West manifest (dependency definitions)
│   ├── StackOverChonk.conf   # Kconfig options (features)
│   └── StackOverChonk.json   # Keyboard layout metadata
├── boards/
│   ├── nice_nano_v2.overlay  # Board customization
│   └── shields/
│       └── StackOverChonk/
│           ├── Kconfig.shield           # Shield declaration
│           ├── Kconfig.defconfig        # Default configs
│           ├── StackOverChonk.dtsi      # Hardware definition
│           ├── StackOverChonk.keymap    # Your keymap
│           ├── StackOverChonk_left.overlay
│           └── StackOverChonk_right.overlay
├── docker/
│   ├── docker-compose.yml    # Docker configuration
│   ├── build.sh              # Build script
│   ├── update.sh             # Dependency update script
│   └── output/               # Compiled .uf2 files
├── zephyr/
│   └── module.yml            # Declares this as a Zephyr module
└── Makefile                  # Build commands
```

### Docker Configuration

`docker/docker-compose.yml`:
```yaml
version: "3.8"

services:
  firmware:
    image: zmkfirmware/zmk-build-arm:stable
    working_dir: /workspace
    volumes:
      - ..:/workspace                    # Your repo (bind mount)
      - zmk-modules:/workspace/modules   # Cached dependencies
      - zmk-zephyr:/workspace/zephyr
      - zmk-tools:/workspace/tools
      - zmk-zmk:/workspace/zmk
    command: /workspace/docker/build.sh

volumes:
  zmk-modules:
  zmk-zephyr:
  zmk-tools:
  zmk-zmk:
```

Named volumes shadow bind mount paths - dependencies persist between runs while your code changes are reflected immediately.

### Build Script Flow

```
make build
    │
    ▼
docker compose run firmware /workspace/docker/build.sh
    │
    ▼
Container starts with zmkfirmware/zmk-build-arm image
    │
    ▼
build.sh runs inside container:
    ├── west init -l config/ (if needed)
    ├── west config manifest.project-filter (skip unused HALs)
    ├── west update (fetch dependencies)
    ├── west zephyr-export
    ├── west build ... StackOverChonk_left
    ├── west build ... StackOverChonk_right
    ├── west build ... settings_reset
    └── copy .uf2 files to docker/output/
```

---

## Deep Dive: How It All Works

### West - Zephyr's Meta Tool

West manages multiple git repos as one workspace. Your `config/west.yml`:

```yaml
manifest:
  remotes:
    - name: zmkfirmware
      url-base: https://github.com/zmkfirmware
  projects:
    - name: zmk
      remote: zmkfirmware
      revision: v0.3.0
      import: true   # ← Key: imports ZMK's dependencies
```

The `import: true` triggers a chain:
```
Your west.yml
    └── imports ZMK's west.yml
            └── imports Zephyr's west.yml
                    └── imports ALL HALs (hal_stm32, hal_nordic, etc.)
```

The project filter skips HALs we don't need:
```bash
west config manifest.project-filter -- "-hal_stm32 -hal_espressif ..."
```

### Zephyr's Build System - The Unholy Trinity

Three configuration systems merge at build time:

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Kconfig   │    │ Devicetree  │    │   CMake     │
│  (features) │    │ (hardware)  │    │  (build)    │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │
       └────────┬─────────┴─────────┬────────┘
                │                   │
                ▼                   ▼
         autoconf.h            devicetree.h
                │                   │
                └─────────┬─────────┘
                          │
                          ▼
                    C compilation
```

#### Kconfig - Feature Flags

Your `config/StackOverChonk.conf`:
```kconfig
CONFIG_ZMK_RGB_UNDERGLOW=y
CONFIG_WS2812_STRIP=y
CONFIG_BT_CTLR_TX_PWR_PLUS_8=y
```

Becomes `build/zephyr/include/generated/autoconf.h`:
```c
#define CONFIG_ZMK_RGB_UNDERGLOW 1
#define CONFIG_WS2812_STRIP 1
#define CONFIG_BT_CTLR_TX_PWR_PLUS_8 1
```

Kconfig has dependencies:
```kconfig
config ZMK_RGB_UNDERGLOW
    bool "RGB underglow support"
    select LED_STRIP          # Auto-enables LED_STRIP
    select ZMK_LOW_PRIORITY_WORK_QUEUE
```

#### Devicetree - Hardware Abstraction

Your `StackOverChonk.dtsi`:
```dts
/ {
    kscan0: kscan {
        compatible = "zmk,kscan-gpio-matrix";
        diode-direction = "col2row";

        row-gpios
            = <&pro_micro 4 (GPIO_ACTIVE_HIGH | GPIO_PULL_DOWN)>
            // ...
        ;
        col-gpios
            = <&pro_micro 21 GPIO_ACTIVE_HIGH>
            // ...
        ;
    };
};
```

The DTS compiler generates `devicetree.h`:
```c
#define DT_N_S_kscan_P_row_gpios_IDX_0_VAL_pin 4
#define DT_N_S_kscan_P_diode_direction "col2row"
```

#### The Overlay System

Shield overlays **merge** on top of board definitions:

```dts
// StackOverChonk_left.overlay
#include "StackOverChonk.dtsi"

&default_transform {
    col-offset = <6>;  // Left half uses cols 0-5
};
```

The `&kscan0` syntax means "modify the existing node".

### The Build Command Explained

```bash
west build -s zmk/app -d build/left -b nice_nano_v2 -p -- \
    -DZMK_CONFIG="/workspace/config" \
    -DBOARD_ROOT="/workspace" \
    -DSHIELD="StackOverChonk_left"
```

| Flag | Meaning |
|------|---------|
| `-s zmk/app` | Source directory (ZMK's CMakeLists.txt) |
| `-d build/left` | Build output directory |
| `-b nice_nano_v2` | Target board (nRF52840) |
| `-p` | Pristine build (clean rebuild) |
| `-DZMK_CONFIG=...` | Where your `.conf` file is |
| `-DBOARD_ROOT=...` | Where to find custom shields |
| `-DSHIELD=...` | Which shield overlay to use |

### Memory Map (nRF52840)

```
0x00000000 ┌─────────────────────┐
           │    MBR (4KB)        │  Master Boot Record
0x00001000 ├─────────────────────┤
           │  SoftDevice (152KB) │  Nordic's BLE stack (closed source)
0x00026000 ├─────────────────────┤
           │                     │
           │  Your App (ZMK)     │  ← zmk.uf2 goes here
           │    (~640KB avail)   │
           │                     │
0x000F4000 ├─────────────────────┤
           │  Settings (16KB)    │  NVS for persistent storage
0x000F8000 ├─────────────────────┤
           │  MBR Params (4KB)   │
0x000FC000 ├─────────────────────┤
           │  Bootloader (24KB)  │  UF2 bootloader
0x00100000 └─────────────────────┘

RAM: 0x20000000 - 0x20040000 (256KB)
     SoftDevice takes ~64KB, you get the rest
```

### ZMK Architecture

```
zmk/app/src/
├── main.c              # Entry point
├── kscan.c             # Keyboard matrix scanning
├── keymap.c            # Layer/keymap handling
├── hid.c               # USB/BLE HID reports
├── split/
│   └── bluetooth/
│       ├── central.c   # Left half (connects to right)
│       └── peripheral.c # Right half (advertises)
├── behaviors/          # What keys do
│   ├── behavior_key_press.c
│   ├── behavior_hold_tap.c
│   └── ...
└── rgb_underglow.c
```

#### Event System

ZMK uses event-driven architecture:

```c
// When a key is pressed, kscan.c raises:
ZMK_EVENT_RAISE(position_state_changed,
    (struct position_state_changed){
        .position = position,
        .state = pressed
    });

// Listeners subscribe:
ZMK_LISTENER(keymap, keymap_listener);
ZMK_SUBSCRIPTION(keymap, position_state_changed);
```

#### Split Communication

```
Left Half (Central)              Right Half (Peripheral)
┌──────────────────┐            ┌──────────────────┐
│ Matrix Scan      │            │ Matrix Scan      │
│      │           │            │      │           │
│      ▼           │            │      ▼           │
│ Local Events     │            │ Position Event   │
│      │           │   BLE      │      │           │
│      ▼           │◄───────────│      ▼           │
│ Merge Events     │  GATT      │ Send to Central  │
│      │           │            │                  │
│      ▼           │            └──────────────────┘
│ Keymap Process   │
│      │           │
│      ▼           │
│ HID Report → USB/BLE to Host
└──────────────────┘
```

Right half scans its matrix, sends position events over BLE to left half. Left half merges them, processes keymap, sends HID reports to computer.

### The UF2 Format

```
┌────────────────────────────────────────┐
│ Block 0                                │
├────────────────────────────────────────┤
│ Magic Start 0: 0x0A324655 ("UF2\n")    │
│ Magic Start 1: 0x9E5D5157              │
│ Flags: 0x00002000 (family ID present)  │
│ Target Addr: 0x00026000                │
│ Payload Size: 256                      │
│ Block Number: 0                        │
│ Total Blocks: N                        │
│ Family ID: 0xADA52840 (nRF52840)       │
│ Data[476]: <256 bytes of firmware>     │
│ Magic End: 0x0AB16F30                  │
├────────────────────────────────────────┤
│ Block 1 ...                            │
└────────────────────────────────────────┘
```

Each 512-byte block contains 256 bytes of firmware. The bootloader reads these from the "fake" USB drive and writes to flash.

### Docker Volume Mounting

```yaml
volumes:
  - ..:/workspace                    # Your repo (bind mount)
  - zmk-modules:/workspace/modules   # Named volume (persistent)
```

Named volumes shadow bind mount paths:

```
Host filesystem          Container filesystem
─────────────────        ─────────────────────
~/StackOverChonk/   ──►  /workspace/
    ├── config/     ──►      ├── config/        (bind mount - your files)
    ├── boards/     ──►      ├── boards/        (bind mount - your files)
    │                        ├── zmk/           (named volume - cached)
    │                        ├── zephyr/        (named volume - cached)
    │                        └── modules/       (named volume - cached)
```

Your code changes reflect immediately. Dependencies persist between runs.

---

## Troubleshooting

### Build fails with "shield not found"
- Check `BOARD_ROOT` is set to `/workspace`
- Verify `boards/shields/StackOverChonk/` exists with `Kconfig.shield`

### Bootloader not appearing
- Try holding reset for 5+ seconds
- Check USB cable (some are charge-only)
- Try different USB port

### Pairing issues after flashing
- Flash `settings_reset` firmware first
- Then flash normal firmware
- Re-pair keyboard

### Build takes forever
- First build downloads ~1GB of dependencies
- Run `make clean-all` and rebuild if volumes are corrupted
- Check internet connection

### Permission denied on flash
- Add yourself to `dialout` group: `sudo usermod -aG dialout $USER`
- Or use `sudo` for mount/copy commands
