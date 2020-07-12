function GridBoxGeometry(geometry, independent) {
  if (!(geometry instanceof THREE.BoxBufferGeometry)) {
    console.log("GridBoxGeometry: the parameter 'geometry' has to be of the type THREE.BoxBufferGeometry");
    return geometry;
  }


  function indexSide(x, y, shift) {
    const indices = [];
    for (let i = 0; i < y + 1; i++) {
      let index11 = 0;
      let index12 = 0;
      for (let j = 0; j < x; j++) {
        index11 = (x + 1) * i + j;
        index12 = index11 + 1;
        const index21 = index11;
        const index22 = index11 + (x + 1);
        indices.push(shift + index11, shift + index12);
        if (index22 < ((x + 1) * (y + 1) - 1)) {
          indices.push(shift + index21, shift + index22);
        }
      }
      if ((index12 + x + 1) <= ((x + 1) * (y + 1) - 1)) {
        indices.push(shift + index12, shift + index12 + x + 1);
      }
    }
    return indices;
  }

  independent = independent !== undefined ? independent : false;

  const newGeometry = new THREE.BoxBufferGeometry();
  const { position } = geometry.attributes;
  newGeometry.attributes.position = independent === false ? position : position.clone();

  const segmentsX = geometry.parameters.widthSegments || 1;
  const segmentsY = geometry.parameters.heightSegments || 1;
  const segmentsZ = geometry.parameters.depthSegments || 1;

  let startIndex = 0;
  const indexSide1 = indexSide(segmentsZ, segmentsY, startIndex);
  startIndex += (segmentsZ + 1) * (segmentsY + 1);
  const indexSide2 = indexSide(segmentsZ, segmentsY, startIndex);
  startIndex += (segmentsZ + 1) * (segmentsY + 1);
  const indexSide3 = indexSide(segmentsX, segmentsZ, startIndex);
  startIndex += (segmentsX + 1) * (segmentsZ + 1);
  const indexSide4 = indexSide(segmentsX, segmentsZ, startIndex);
  startIndex += (segmentsX + 1) * (segmentsZ + 1);
  const indexSide5 = indexSide(segmentsX, segmentsY, startIndex);
  startIndex += (segmentsX + 1) * (segmentsY + 1);
  const indexSide6 = indexSide(segmentsX, segmentsY, startIndex);

  let fullIndices = [];
  fullIndices = fullIndices.concat(indexSide1);
  fullIndices = fullIndices.concat(indexSide2);
  fullIndices = fullIndices.concat(indexSide3);
  fullIndices = fullIndices.concat(indexSide4);
  fullIndices = fullIndices.concat(indexSide5);
  fullIndices = fullIndices.concat(indexSide6);

  newGeometry.setIndex(fullIndices);

  return newGeometry;
}

export default GridBoxGeometry;
