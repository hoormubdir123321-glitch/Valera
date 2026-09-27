const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const srcImage = path.resolve('src/assets/images/valeria_sanitarium_morgue_1790511448173.jpg');
const outDir = path.resolve('src/assets/layers');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log('Generating separated scene layers from:', srcImage);

// 1. Doctor Body Mask (Doctor's head, glasses, neck, torso, lab coat, excluding the moving right arm)
// Coordinates based on 1376x768
const doctorBodyPolygon = "polygon 420,40 680,30 760,120 780,220 730,280 620,310 590,380 540,430 450,420 380,350 360,220 380,100";

// 2. Doctor Arm & Hand Mask (Right arm, sleeve, wrist, fingers extending toward the table)
const doctorArmPolygon = "polygon 710,180 840,220 890,320 860,420 760,480 670,470 630,420 660,350 710,290 730,220";

// 3. Scalpel & Surgical Instrument (extends from fingers towards Valeria's neck)
const scalpelPolygon = "polygon 610,400 700,410 740,460 670,490 590,460 580,420";

// 4. Valeria Body (Supine body on morgue zinc table, draped in shroud, ribcage/chest)
const valeriaBodyPolygon = "polygon 180,460 520,430 850,440 1020,530 1080,680 750,760 200,760 120,620";

// 5. Valeria Head & Neck (lying on table, face exposed from shroud, neck)
const valeriaHeadPolygon = "polygon 310,420 460,410 490,480 430,530 330,520 290,470";

// 6. Foreground (morgue table rim, chemical bottles, lower vials)
const foregroundPolygon = "polygon 0,690 1376,690 1376,768 0,768";

function createLayer(name, polygon, featherRadius = 3) {
  const maskFile = path.join('/tmp', `${name}_mask.png`);
  const layerFile = path.join(outDir, `${name}.png`);

  // Create black canvas, draw white polygon, blur for smooth antialiased feathering
  execSync(`convert -size 1376x768 xc:black -fill white -draw "${polygon}" -blur 0x${featherRadius} ${maskFile}`);

  // Cut layer out from source image using the mask as alpha
  execSync(`convert "${srcImage}" ${maskFile} -alpha off -compose CopyOpacity -composite "${layerFile}"`);

  console.log(`Created layer: ${layerFile}`);
}

// Create the isolated character layers
createLayer('doctor_body', doctorBodyPolygon, 4);
createLayer('doctor_arm', doctorArmPolygon, 3);
createLayer('scalpel', scalpelPolygon, 2);
createLayer('valeria_body', valeriaBodyPolygon, 4);
createLayer('valeria_head', valeriaHeadPolygon, 3);
createLayer('foreground', foregroundPolygon, 3);

// 7. Background Layer: Inpaint / heal behind the moving doctor arm & torso
// We blur and texture-inpaint the background behind moving characters so when the arm articulates,
// there is natural dark gothic wall and ambient depth behind it, NOT a duplicate or hole.
const bgMaskFile = '/tmp/bg_inpaint_mask.png';
const combinedCharsPolygon = "polygon 400,30 890,180 920,420 780,500 500,480 340,300";
execSync(`convert -size 1376x768 xc:black -fill white -draw "${combinedCharsPolygon}" -blur 0x12 ${bgMaskFile}`);

// Infilled background layer: smooth blur & ambient tone under the character region
const bgInfilled = path.join(outDir, 'background.png');
execSync(`convert "${srcImage}" ( "${srcImage}" -blur 0x25 ) ${bgMaskFile} -composite "${bgInfilled}"`);
console.log(`Created background layer: ${bgInfilled}`);

console.log('All scene layers successfully generated!');
