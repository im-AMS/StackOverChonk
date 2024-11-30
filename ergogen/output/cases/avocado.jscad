function _board_outline_extrude_3_outline_fn(){
    return new CSG.Path2D([[110.221001,-6.9837733],[111.5938562,-16.3823713]]).appendArc([111.5058943,-17.3225805],{"radius":2,"clockwise":true,"large":false}).appendPoint([104.8922676,-36.5299473]).appendArc([102.350094,-37.769848],{"radius":2,"clockwise":true,"large":false}).appendPoint([86.3589978,-32.2636721]).appendArc([86.1913864,-32.2140383],{"radius":2,"clockwise":false,"large":false}).appendPoint([82.9804167,-31.4140141]).appendArc([82.8269869,-31.3821137],{"radius":2,"clockwise":false,"large":false}).appendPoint([68.0180339,-28.9039449]).appendArc([67.8062611,-28.8800192],{"radius":2,"clockwise":false,"large":false}).appendPoint([64.6591089,-28.6935031]).appendArc([64.5407865,-28.69],{"radius":2,"clockwise":false,"large":false}).appendPoint([46.5047291,-28.69]).appendArc([45.0026473,-28.0105114],{"radius":2,"clockwise":true,"large":false}).appendPoint([30.9973527,-12.0794886]).appendArc([29.4952709,-11.4],{"radius":2,"clockwise":false,"large":false}).appendPoint([-9.4,-11.4]).appendArc([-11.4,-9.4],{"radius":2,"clockwise":true,"large":false}).appendPoint([-11.4,47.4]).appendArc([-9.4,49.4],{"radius":2,"clockwise":true,"large":false}).appendPoint([5.6,49.4]).appendArc([7.6,51.4],{"radius":2,"clockwise":false,"large":false}).appendPoint([7.6,55]).appendArc([9.6,57],{"radius":2,"clockwise":true,"large":false}).appendPoint([24.6,57]).appendArc([26.6,59],{"radius":2,"clockwise":false,"large":false}).appendPoint([26.6,60.32]).appendArc([28.6,62.32],{"radius":2,"clockwise":true,"large":false}).appendPoint([47.4,62.32]).appendArc([49.4,60.32],{"radius":2,"clockwise":true,"large":false}).appendPoint([49.4,58.05]).appendArc([51.4,56.05],{"radius":2,"clockwise":false,"large":false}).appendPoint([65.6152603,56.05]).appendArc([67.0951405,55.3953456],{"radius":2,"clockwise":true,"large":false}).appendPoint([68.4,53.96]).appendPoint([84.263932,53.96]).appendArc([86.0527864,52.8544272],{"radius":2,"clockwise":true,"large":false}).appendPoint([86.8472136,51.2655728]).appendArc([88.636068,50.16],{"radius":2,"clockwise":false,"large":false}).appendPoint([108.2,50.16]).appendArc([110.2,48.16],{"radius":2,"clockwise":true,"large":false}).appendPoint([110.2,-6.6947005]).appendArc([110.221001,-6.9837733],{"radius":2,"clockwise":false,"large":false}).close().innerToCAG()
.extrude({ offset: [0, 0, 3] });
}


function _keycap_outlines_extrude_6_outline_fn(){
    return new CSG.Path2D([[86.9894097,-30.471261],[101.1721882,-35.3547833]]).appendArc([103.7143617,-34.1148825],{"radius":2,"clockwise":false,"large":false}).appendPoint([108.5978841,-19.932104]).appendArc([107.3579833,-17.3899305],{"radius":2,"clockwise":false,"large":false}).appendPoint([93.1752048,-12.5064081]).appendArc([90.6330313,-13.7463089],{"radius":2,"clockwise":false,"large":false}).appendPoint([85.7495089,-27.9290874]).appendArc([86.9894097,-30.4712609],{"radius":2,"clockwise":false,"large":false}).close().innerToCAG()
.union(
    new CSG.Path2D([[49.5,-26.79],[66.5,-26.79]]).appendPoint([66.5,-26.7234935]).appendPoint([83.1192887,-29.5046086]).appendArc([85.4219551,-27.8621326],{"radius":2,"clockwise":false,"large":false}).appendPoint([87.8976692,-13.0678485]).appendArc([86.2551932,-10.7651821],{"radius":2,"clockwise":false,"large":false}).appendPoint([71.4609091,-8.289468]).appendArc([69.1582427,-9.931944],{"radius":2,"clockwise":false,"large":false}).appendPoint([66.5,-25.8169761]).appendPoint([66.5,-9.79]).appendArc([64.5,-7.79],{"radius":2,"clockwise":false,"large":false}).appendPoint([49.5,-7.79]).appendArc([47.5,-9.79],{"radius":2,"clockwise":false,"large":false}).appendPoint([47.5,-24.79]).appendArc([49.5,-26.79],{"radius":2,"clockwise":false,"large":false}).close().innerToCAG()
).union(
    new CSG.Path2D([[-7.5,-9.5],[7.5,-9.5]]).appendArc([9.5,-7.5],{"radius":2,"clockwise":false,"large":false}).appendPoint([9.5,-3.9]).appendArc([11.5,-1.9],{"radius":2,"clockwise":true,"large":false}).appendPoint([26.5,-1.9]).appendArc([28.5,0.1],{"radius":2,"clockwise":false,"large":false}).appendPoint([28.5,1.42]).appendArc([30.5,3.42],{"radius":2,"clockwise":true,"large":false}).appendPoint([45.5,3.42]).appendArc([47.5,1.42],{"radius":2,"clockwise":true,"large":false}).appendPoint([47.5,-0.85]).appendArc([49.5,-2.85],{"radius":2,"clockwise":false,"large":false}).appendPoint([64.5,-2.85]).appendArc([66.5,-4.85],{"radius":2,"clockwise":true,"large":false}).appendPoint([66.5,-4.94]).appendPoint([83.5,-4.94]).appendArc([85.5,-2.94],{"radius":2,"clockwise":false,"large":false}).appendPoint([85.5,50.06]).appendArc([83.5,52.06],{"radius":2,"clockwise":false,"large":false}).appendPoint([68.5,52.06]).appendArc([66.5,54.06],{"radius":2,"clockwise":true,"large":false}).appendPoint([66.5,54.15]).appendPoint([49.5,54.15]).appendArc([47.5,56.15],{"radius":2,"clockwise":true,"large":false}).appendPoint([47.5,58.42]).appendArc([45.5,60.42],{"radius":2,"clockwise":false,"large":false}).appendPoint([30.5,60.42]).appendArc([28.5,58.42],{"radius":2,"clockwise":false,"large":false}).appendPoint([28.5,57.1]).appendArc([26.5,55.1],{"radius":2,"clockwise":true,"large":false}).appendPoint([11.5,55.1]).appendArc([9.5,53.1],{"radius":2,"clockwise":false,"large":false}).appendPoint([9.5,49.5]).appendArc([7.5,47.5],{"radius":2,"clockwise":true,"large":false}).appendPoint([-7.5,47.5]).appendArc([-9.5,45.5],{"radius":2,"clockwise":false,"large":false}).appendPoint([-9.5,-7.5]).appendArc([-7.5,-9.5],{"radius":2,"clockwise":false,"large":false}).close().innerToCAG()
).extrude({ offset: [0, 0, 6] });
}




                function avocado_case_fn() {
                    

                // creating part 0 of case avocado
                let avocado__part_0 = _board_outline_extrude_3_outline_fn();

                // make sure that rotations are relative
                let avocado__part_0_bounds = avocado__part_0.getBounds();
                let avocado__part_0_x = avocado__part_0_bounds[0].x + (avocado__part_0_bounds[1].x - avocado__part_0_bounds[0].x) / 2
                let avocado__part_0_y = avocado__part_0_bounds[0].y + (avocado__part_0_bounds[1].y - avocado__part_0_bounds[0].y) / 2
                avocado__part_0 = translate([-avocado__part_0_x, -avocado__part_0_y, 0], avocado__part_0);
                avocado__part_0 = rotate([0,0,0], avocado__part_0);
                avocado__part_0 = translate([avocado__part_0_x, avocado__part_0_y, 0], avocado__part_0);

                avocado__part_0 = translate([0,0,0], avocado__part_0);
                let result = avocado__part_0;
                
            

                // creating part 1 of case avocado
                let avocado__part_1 = _keycap_outlines_extrude_6_outline_fn();

                // make sure that rotations are relative
                let avocado__part_1_bounds = avocado__part_1.getBounds();
                let avocado__part_1_x = avocado__part_1_bounds[0].x + (avocado__part_1_bounds[1].x - avocado__part_1_bounds[0].x) / 2
                let avocado__part_1_y = avocado__part_1_bounds[0].y + (avocado__part_1_bounds[1].y - avocado__part_1_bounds[0].y) / 2
                avocado__part_1 = translate([-avocado__part_1_x, -avocado__part_1_y, 0], avocado__part_1);
                avocado__part_1 = rotate([0,0,0], avocado__part_1);
                avocado__part_1 = translate([avocado__part_1_x, avocado__part_1_y, 0], avocado__part_1);

                avocado__part_1 = translate([0,0,0], avocado__part_1);
                result = result.union(avocado__part_1);
                
            
                    return result;
                }
            
            
        
            function main() {
                return avocado_case_fn();
            }

        