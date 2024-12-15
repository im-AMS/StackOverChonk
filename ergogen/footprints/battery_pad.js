module.exports = {
  params: {
    designator: 'BT',
    side: 'F',
    pos: undefined,
    neg: undefined,
    flip_pads: false,  // false = +ve left, -ve right | true = -ve left, +ve right
    include_silkscreen: true,
  },
  body: p => {
    // Calculate positions based on flip_pads
    const posX = p.flip_pads ? 1.1 : -1.1;  // Positive terminal X position
    const negX = p.flip_pads ? -1.1 : 1.1;  // Negative terminal X position

    return `
    (module "Battery_pads" (layer ${p.side}.Cu) ${p.at}
      ${'' /* Reference */}
      (fp_text reference "${p.ref}" (at 0 0.5 180) (layer "${p.side}.SilkS") hide
        (effects (font (size 1 1) (thickness 0.15)))
      )

      ${p.include_silkscreen ? `
      ${'' /* Silkscreen Labels */}
      (fp_text user "Battery" (at 0 3 180) (layer "${p.side}.SilkS")
        (effects (font (size 0.8 0.8) (thickness 0.1))${p.side == 'B' ? ' (justify mirror)' : ''})
      )
      (fp_text user "+ve" (at ${posX} 1.757 180) (layer "${p.side}.SilkS")
        (effects (font (size 0.6 0.6) (thickness 0.08))${p.side == 'B' ? ' (justify mirror)' : ''})
      )
      (fp_text user "-ve" (at ${negX} 1.757 180) (layer "${p.side}.SilkS")
        (effects (font (size 0.6 0.6) (thickness 0.08))${p.side == 'B' ? ' (justify mirror)' : ''})
      )
      ` : ''}

      ${'' /* Mask Cutouts for Pads */}
      (fp_poly (pts
        (xy ${posX - 0.7} -1) (xy ${posX - 0.7} 1) (xy ${posX + 0.7} 1) (xy ${posX + 0.7} -1)
      ) (layer "${p.side}.Mask") (width 0.1) (fill solid))
      (fp_poly (pts
        (xy ${negX - 0.7} -1) (xy ${negX - 0.7} 1) (xy ${negX + 0.7} 1) (xy ${negX + 0.7} -1)
      ) (layer "${p.side}.Mask") (width 0.1) (fill solid))

      ${'' /* SMD Pads - Simplified to just rectangular pads */}
      (pad "1" smd rect (at ${posX} 0) (size 1.4 2) (layers "${p.side}.Cu") ${p.pos.str})
      (pad "2" smd rect (at ${negX} 0) (size 1.4 2) (layers "${p.side}.Cu") ${p.neg.str})
    )
    `
  }
}
