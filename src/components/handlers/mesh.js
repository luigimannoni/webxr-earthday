import {
  Vector3,
  Mesh,
  SphereBufferGeometry,
  RingBufferGeometry,
  MeshBasicMaterial,
  LineBasicMaterial,
  BufferGeometry,
  Group,
  Line,
  TextureLoader,
  SpriteMaterial,
  Sprite,
  DoubleSide,
} from 'three';
import { PlainAnimator } from 'three-plain-animator/lib/plain-animator';

import Palette from '../../libs/Palette';

const CORE_RADIUS = 0.55;
// const INNER_CORE_RADIUS = 1;
// const MANTLE_RADIUS = 1.7;
const UPPER_MANTLE_RADIUS = 1.92;
const CRUST_RADIUS = 1.995;

const textureLoader = new TextureLoader();

const textures = {
  core: textureLoader.load('/assets/textures/core/core-section.png'),
};

const sprites = {
  info: textureLoader.load('/assets/sprites/info-sprite-45f-7x7-2048.png'),
  globe: textureLoader.load('/assets/sprites/globe-sprite-45f-7x7-2048.png'),
};

const MeshHandler = {
  createCore() {
    // Add section meshes
    const core = new Mesh(
      new SphereBufferGeometry(CORE_RADIUS, 16, 16),
      new MeshBasicMaterial({
        color: Palette.core,
      }),
    );
    core.name = 'core';
    return core;
  },
  createSectionMesh() {
    const section = new Group();

    const inner = new Mesh(
      new RingBufferGeometry(0, UPPER_MANTLE_RADIUS, 64, 1),
      new MeshBasicMaterial({
        color: 0xffffff,
        side: DoubleSide,
        map: textures.core,
      }),
    );
    section.add(inner);

    const crust = new Mesh(
      new RingBufferGeometry(UPPER_MANTLE_RADIUS, CRUST_RADIUS, 64, 1),
      new MeshBasicMaterial({
        color: Palette.deepBlue,
      }),
    );
    section.add(crust);

    return section;
  },
  hotspotGeometry(coords, radMin, radMax, spriteTexture = 'info') {
    const { lat, lon, component } = coords;

    const hotspot = new Group();

    const setPosition = (object, radius) => {
      const latRad = lat * (Math.PI / 180);
      const lonRad = -lon * (Math.PI / 180);

      object.position.set(
        Math.cos(latRad) * Math.cos(lonRad) * radius,
        Math.sin(latRad) * radius,
        Math.cos(latRad) * Math.sin(lonRad) * radius,
      );
      object.rotation.set(0.0, -lonRad, latRad - Math.PI * 0.5);
    };

    const pointCoord = (radius) => {
      const latRad = lat * (Math.PI / 180);
      const lonRad = -lon * (Math.PI / 180);

      return new Vector3(
        Math.cos(latRad) * Math.cos(lonRad) * radius,
        Math.sin(latRad) * radius,
        Math.cos(latRad) * Math.sin(lonRad) * radius,
      );
    };

    const surfaceOrb = new Mesh(
      new SphereBufferGeometry(0.01, 16, 16),
      new MeshBasicMaterial({
        color: Palette.green,
        transparent: true,
        opacity: 1,
      }),
    );

    setPosition(surfaceOrb, radMin);
    hotspot.add(surfaceOrb);

    const points = [];
    points.push(pointCoord(radMin));
    points.push(pointCoord(radMax - 0.01));

    const line = new Line(
      new BufferGeometry().setFromPoints(points),
      new LineBasicMaterial({
        color: Palette.green,
        transparent: true,
        opacity: 1,
      }),
    );
    hotspot.add(line);

    const animator = new PlainAnimator(sprites[spriteTexture], 7, 7, 45, 30);

    const texture = animator.init();

    const sprite = new Sprite(
      new SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 1,
      }),
    );
    sprite.name = 'hotspot-touch';
    sprite.scale.set(0.18, 0.18, 1);
    setPosition(sprite, radMax);
    hotspot.add(sprite);

    hotspot.name = 'hotspot';
    hotspot.userData = {
      type: 'hotspot',
      lat,
      lon,
      component,
      sprite,
      animator,
    };

    return hotspot;
  },
};

export default MeshHandler;
