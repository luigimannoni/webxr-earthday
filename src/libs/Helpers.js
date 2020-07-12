/* eslint-disable no-console */
import { Vector3 } from 'three';

export default {
  // util function to convert lat/lng to 3D point on globe
  coordinateToPosition: (lat, lng, radius) => {
    const DEGREE_TO_RADIAN = Math.PI / 180;

    const phi = (90 - lat) * DEGREE_TO_RADIAN;
    const theta = (lng + 180) * DEGREE_TO_RADIAN;

    return new Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta),
    );
  },
};
