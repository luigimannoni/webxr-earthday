import React, { Component } from 'react';
import {
  Vector3,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  LineSegments,
  AmbientLight,
  DirectionalLight,
  PlaneBufferGeometry,
  MeshBasicMaterial,
  MathUtils,
  Fog,
  Group,
} from 'three';

import { VRButton } from 'three/examples/jsm/webxr/VRButton';
import { isMobile } from 'react-device-detect';

import {
  autoPlay as TweenAutoplay,
  Easing,
  Tween,
} from 'es6-tween';

import Palette from '../libs/Palette';

const BLOOM = {
  ANIMATE: false,
  EXP: 1,
  STR: 0.3,
  THRES: 0,
  RAD: 0.05,
};

PlaneBufferGeometry.prototype.toGrid = function toGrid() {
  const segmentsX = this.parameters.widthSegments || 1;
  const segmentsY = this.parameters.heightSegments || 1;
  const indices = [];
  for (let i = 0; i < segmentsY + 1; i += 1) {
    let index11 = 0;
    let index12 = 0;
    for (let j = 0; j < segmentsX; j += 1) {
      index11 = (segmentsX + 1) * i + j;
      index12 = index11 + 1;
      const index21 = index11;
      const index22 = index11 + (segmentsX + 1);
      indices.push(index11, index12);
      if (index22 < ((segmentsX + 1) * (segmentsY + 1) - 1)) {
        indices.push(index21, index22);
      }
    }
    if ((index12 + segmentsX + 1) <= ((segmentsX + 1) * (segmentsY + 1) - 1)) {
      indices.push(index12, index12 + segmentsX + 1);
    }
  }
  this.setIndex(indices);
  return this;
};

export default class GlobeHome extends Component {
  constructor() {
    super();
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.earth = null;
    this.globe = new Group();
    this.el = React.createRef();
  }

  componentDidMount() {
    const {
      cameraTarget,
      xrEnabled,
    } = this.props;

    this.scene = new Scene();
    this.scene.fog = new Fog(Palette.bgHaze, 250 / 4, 250 / 2);

    const pixelRatio = window.devicePixelRatio;

    this.renderer = new WebGLRenderer({
      antialias: true,
    });

    this.renderer.setClearColor(Palette.bgHaze, 1);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(pixelRatio);
    this.el.current.appendChild(this.renderer.domElement);

    if (xrEnabled) {
      document.body.appendChild(VRButton.createButton(this.renderer));
      this.renderer.xr.enabled = true;
    }

    this.renderer.shadowMap.enabled = true;

    this.camera = new PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.001,
      250,
    );

    switch (cameraTarget) {
      case 'side':
        this.camera.position.x = -1.5;
        this.camera.position.z = -5;
        this.camera.lookAt(new Vector3(-1.5, 0, 0));
        break;
      default:
        this.camera.position.x = 0;
        this.camera.position.z = -10;
        this.camera.lookAt(new Vector3(0, 0, 0));
        break;
    }

    // Lights
    const ambientLight = new AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const sunlight = new DirectionalLight(0xffffff, 1);
    sunlight.position.set(-10, 10, -10);
    sunlight.castShadow = true;
    this.scene.add(sunlight);

    this.plane = new LineSegments(
      new PlaneBufferGeometry(250, 250, 128, 128).toGrid(),
      new MeshBasicMaterial({
        color: 0xffffff,
        // wireframe: true,
        // wireframeLinewidth: 3,
        opacity: 0.4,
        transparent: true,
      }),
    );

    this.scene.add(this.plane);
    this.plane.position.y = -10;
    this.plane.rotateX(MathUtils.degToRad(-90));

    const speed = isMobile ? 0.024 : 0.012;

    const render = (t) => {
      const time = t / 2000;

      this.plane.material.opacity = (Math.cos(time) / 10) + 0.25;

      if (this.earth) {
        this.globe.rotateY(MathUtils.degToRad(speed));
      }

      // controls.update();
      // composer.render();
      this.renderer.render(this.scene, this.camera);
    };

    this.renderer.setAnimationLoop(render);

    // Mouse and resize events
    const onWindowResize = () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize, false);
  }

  componentDidUpdate(prevProps) {
    const { globe: globePrev } = prevProps;
    const { globe } = this.props;

    // If first instantiating the globe
    if (globePrev === null && globe) {
      this.earth = globe;

      const params = {
        x: 0.0001,
        y: 0.0001,
        z: 0.0001,
      };

      this.globe.scale.set(params.x, params.y, params.z);
      this.globe.rotateY(MathUtils.degToRad(-125));
      this.globe.add(this.earth);
      this.scene.add(this.globe);

      TweenAutoplay(true);

      new Tween(params)
        .to({
          x: 1, y: 1, z: 1,
        }, 750)
        .easing(Easing.Quadratic.Out)
        .on('update', ({
          x, y, z,
        }) => {
          this.globe.scale.set(x, y, z);
        })
        .delay(500)
        .start();
    }
  }

  componentWillUnmount() {
    this.renderer.setAnimationLoop(null);
    this.renderer.domElement.remove();
  }

  render() {
    return (
      <>
        <div id="three" ref={this.el} />
      </>
    );
  }
}
