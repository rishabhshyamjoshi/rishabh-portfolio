const fs = require('fs');

const buffer = fs.readFileSync('c:/Users/risha/Downloads/rishabh-joshi-portfolio3/portfolio/public/debris.glb');
const jsonChunkLength = buffer.readUInt32LE(12);
const jsonBuffer = buffer.subarray(20, 20 + jsonChunkLength);
const gltf = JSON.parse(jsonBuffer.toString('utf8'));

if (gltf.accessors && gltf.meshes && gltf.meshes[0].primitives) {
  const primitive = gltf.meshes[0].primitives[0];
  const positionAccessor = gltf.accessors[primitive.attributes.POSITION];
  console.log('Vertex Count:', positionAccessor.count);
}
