# References

[custom ergogen-footprints](https://github.com/ceoloide/ergogen-footprints)
[3d models to view in kicad](https://github.com/joe-scotto/scottokeebs/tree/main/Extras/ScottoKicad)
[josukey](https://github.com/Narkoleptika/josukey)
[avocado](https://github.com/auryn31/avocado)
[supermini pinout specs](https://docs.nordicsemi.com/bundle/ps_nrf52840/page/pin.html)
[Arduino Pro Micro Pinout](https://cdn.sparkfun.com/assets/9/c/3/c/4/523a1765757b7f5c6e8b4567.png)
[ergogen configs from Corney-island](https://github.com/ceoloide/corney-island/blob/main/ergogen/config.yaml)
[svg to points](https://shinao.github.io/PathToPoints/)

# Notes
checkout to version v0.0.7 during the cloing of ceolodie repo, since this was the latest tag.

For RGB Underglow, ZMK docs recomments using high speed gpio pins. refer to the attached pinout specs above.

Try to reserve pins like so (pins in arduino format)
- D2 & D3 for I2C - for Displays
- D6 for high speed comms like RGB underglow, because docs is also using it
- D14, D15, D16 - SPI - idk what i might use this for, just leave em blank


on one layer connect rows, and another columns
move the power switch near USB C
idk what to do about Reset yet
connector for power move it else where - make it efficient even if it mean soldering directly
Add Oled display
Add version number on silkscreen
Find a cool name for this board
increase more padding for PCB, pads are almost at the edge
add screw holes for this
may be create a rectangular hole in pcb to better fit battery
adjust the thumb cluster spacing
move the pinky column more down



check the power switch wiring - something seems off
check the oled pinout very carefully and route it on both sides

DRC issues:
move oled slighly below so that gnd forms properly
move diode slightly to left so gnd forms properly
oled pads hole clearance DRC error
move the power switch little bit inside
led edge clearance 0.19999, required 0.2
MCU back layer gnd not fully connecting
