const fs = require('fs');

const files = ['jupiter.glb', 'saturn.glb', 'mercury.glb'];
files.forEach(file => {
  try {
    const buffer = fs.readFileSync(`c:/Users/risha/Downloads/rishabh-joshi-portfolio3/portfolio/public/${file}`);
    const jsonChunkLength = buffer.readUInt32LE(12);
    const jsonBuffer = buffer.subarray(20, 20 + jsonChunkLength);
    const gltf = JSON.parse(jsonBuffer.toString('utf8'));
    console.log(file, 'Images:', gltf.images ? gltf.images.length : 0);
  } catch (e) {
    console.log(file, 'Error');
  }
});
