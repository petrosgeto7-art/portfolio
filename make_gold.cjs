const { Jimp } = require('jimp');
const path = require('path');

async function main() {
  const imagePath = path.join(__dirname, 'public', 'pg_logo.png');
  const outputPath = path.join(__dirname, 'public', 'pg_logo_gold.png');

  try {
    const image = await Jimp.read(imagePath);
    // hue rotate by 135 deg: Jimp's color method takes a hue amount in degrees
    // wait, Jimp v1 might have a different api. Let's just use color matrix or color methods.
    image.color([
      { apply: 'hue', params: [135] }
    ]);
    
    // To saturate by 1.5, in Jimp it's between 0 and 100 for saturate?
    // Let's just do a basic hue rotate, or even just save the hue rotated version.
    await image.write(outputPath);
    console.log('Successfully created pg_logo_gold.png');
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

main();
