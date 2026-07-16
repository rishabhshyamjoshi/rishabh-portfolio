const fs = require('fs');
const buffer = fs.readFileSync('c:/Users/risha/Downloads/rishabh-joshi-portfolio3/portfolio/public/jupiter.glb');
const jsonChunkLength = buffer.readUInt32LE(12);
const jsonBuffer = buffer.subarray(20, 20 + jsonChunkLength);
const gltf = JSON.parse(jsonBuffer.toString('utf8'));
console.log(JSON.stringify(gltf.materials, null, 2));
