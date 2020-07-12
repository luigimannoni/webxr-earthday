import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  WebGLRenderer,
  Scene,
  Camera,
  Group,
  Clock,
  Raycaster,
  Vector2,
  Vector3,
  Matrix4,
  Plane,
  Quaternion,
  Euler,
  MathUtils,
  AudioListener,
  Audio,
  Mesh,
  PlaneGeometry,
  MeshBasicMaterial,
  DoubleSide,
  AmbientLight,
  PointLight,
  RingBufferGeometry,
  FrontSide,
} from 'three';

import Hammer from 'hammerjs';
import ReactGA from 'react-ga';

import {
  Easing,
  Tween,
  update as TweenUpdate,
} from 'es6-tween';
import styled from 'styled-components';

import { getState } from '../redux/selectors';
import {
  toggleSection,
  selectBiome,
  resetGlobe,
  placeGlobe,
  setMessage,
  closeMessage,
  setHelpDisplayed,
} from '../redux/actions';
import Palette from '../libs/Palette';
import MeshHandler from './handlers/mesh';
import Utils from './handlers/utils';

const COORDS = [
  {
    lat: -28.24,
    lon: -55,
    component: 'TropicalRainforest',
  },
  {
    lat: 15.62,
    lon: -95.09,
    component: 'TemperateRainforest',
  },
  {
    lat: 23.52,
    lon: 32.84,
    component: 'Freshwater',
  },
  {
    lat: 0.780288,
    lon: -105.882064,
    component: 'Chaparral',
  },
];

const INNER_COORDS = [
  {
    distance: 0.55,
    component: 'InnerCore',
  },
  {
    distance: 1.05,
    component: 'OuterCore',
  },
  {
    distance: 1.5,
    component: 'Mantle',
  },
  {
    distance: 1.98,
    component: 'Crust',
  },
];

const GLOBE_Y_CENTER = 1;
const GLOBE_SCALE = 0.25;

const Canvas = styled.canvas`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
`;

class GlobeAR extends Component {
  constructor() {
    super();
    this.renderer = null;
    this.scene = new Scene();
    this.camera = new Camera();
    this.controller = null;
    this.listener = null;
    this.audioInteraction = null;
    this.audioBg = null;
    this.fakeEarth = null;
    this.earth = null;
    this.biomes = null;
    this.sunlight = null;
    this.globe = new Group();
    this.group = new Group();
    this.hotspots = new Group();
    this.innerHotspots = new Group();
    this.clock = new Clock();
    this.animations = {};
    this.surface = null;
    this.controls = null;
    this.el = React.createRef();
    this.image = false;
    this.statePlace = true;
    this.rotating = true;
    this.screenshot = null;
    this.mixer = null;
    this.raycaster = new Raycaster();
    this.tapPosition = new Vector2();
    this.vec3 = new Vector3();
    this.tempMatrix = new Matrix4();
    this.helpTimeout = null;
    this.theta = 0;
    this.hitTestSource = null;
    this.hitTestSourceRequested = false;

    this.clipPlanes = [
      new Plane(),
      new Plane(),
    ];

    this.planeNormal = [
      new Vector3(),
      new Vector3(),
    ];

    this.planePoint = [
      new Vector3(),
      new Vector3(),
    ];

    this.axis = new Vector3(1, 0, 0);

    this.sectionRotation = 0;

    this.saved = {
      rotation: null,
      scale: 1,
      touches: [],
      vector: new Vector3(),
    };

    this.attachHandlers = () => {
      const hammer = new Hammer(this.canvas);

      hammer.on('tap', (e) => {
        const { props } = this;
        const { globe, store } = props;
        const { app, ui } = store;

        ReactGA.event({
          category: 'ui',
          action: 'interaction',
          label: 'tap',
        });

        this.rotating = false;

        if (app.globePlaced === false && this.group.visible === true) {
          this.spawnEarth();

          if (app.helpDisplayed === false) {
            this.displayHelp();
          } else {
            props.closeMessage();
          }
          props.placeGlobe();
        } else {
          // If placed, raycast to entire globe group.
          // Calculate tap position in normalized device coordinates (-1 to +1) for both components.
          this.tapPosition.x = (e.center.x / window.innerWidth) * 2 - 1;
          this.tapPosition.y = -(e.center.y / window.innerHeight) * 2 + 1;

          // Update the picking ray with the camera and tap position.
          this.raycaster.setFromCamera(this.tapPosition, this.xrCamera);

          if (ui.biome === false && ui.section === false) {
            const intersects = this.raycaster.intersectObjects([this.earth.children[0], this.hotspots], true);
            if (intersects.length > 0
              && (intersects[0].object.parent.name === 'hotspot')) {
              const { userData } = intersects[0].object.parent;
              const { component } = userData;

              if (component === 'Section') {
                props.toggleSection();
              } else {
                props.selectBiome(component);
              }
            }
          } else if (ui.biome === false && ui.section === true) {
            const intersects = this.raycaster.intersectObjects(this.innerHotspots.children, true);
            if (intersects.length > 0
              && intersects[0].object.parent.name === 'hotspot') {
              const { userData } = intersects[0].object.parent;
              const { component } = userData;

              props.selectBiome(component, true);
            }
          } else {
            if (ui.section === true) {
              return;
            }

            // Stop audio if already playing
            if (this.audioInteraction.isPlaying) {
              this.audioInteraction.stop();
            }
            const name = app.biome.toLowerCase();

            ReactGA.event({
              category: 'app',
              action: 'interaction',
              label: name,
            });

            const { biomes, rotations, audioBuffers } = globe.userData;

            // Play Shrub animations for forests
            if (name === 'tropicalrainforest' || name === 'temperaterainforest') {
              const { children = [] } = biomes[name];

              children.forEach((obj) => {
                if (/(tree|spruce|pine)/.test(obj.name)) {
                  Utils.shrub(obj, rotations[obj.name]);
                }
              });
            }

            // Start audio if we have it
            if (audioBuffers[`${name}-interaction`]) {
              this.audioInteraction.setBuffer(audioBuffers[`${name}-interaction`]);
              this.audioInteraction.play();
            }

            // Start animation
            if (this.animations[name]) {
              this.animations[name].reset().play();
            }
          }
        }
      });
      hammer.get('pinch').set({ enable: true });
      hammer.get('rotate').set({ enable: false });
      hammer.get('pan').set({ enable: true, threshold: 5 });

      hammer.on('pan', (e) => {
        const { props } = this;
        const { store } = props;
        const { ui } = store;
        if (ui.section === true) {
          return;
        }

        const {
          velocityX, velocityY, deltaX, deltaY,
        } = e;
        const { movementX, movementY } = e.srcEvent;
        const delta = {
          x: deltaX,
          y: deltaY,
        };

        if (movementX && movementY) {
          delta.x = (movementX / 15);
          delta.y = (movementY / 15);
        } else {
          delta.x = (velocityX / 0.425);
          delta.y = (velocityY / 0.425);
        }

        const deltaRotationQuaternion = new Quaternion()
          .setFromEuler(new Euler(
            MathUtils.degToRad(delta.y * 1),
            MathUtils.degToRad(delta.x * 1),
            0,
            'XYZ',
          ));

        this.globe.quaternion.multiplyQuaternions(deltaRotationQuaternion, this.globe.quaternion);
      });

      hammer.on('pinchstart', (e) => {
        const { scale } = e;
        this.saved.scale = scale;
      });

      hammer.on('pinch', (e) => {
        const { scale } = e;
        const effective = scale - this.saved.scale;
        const { x } = this.globe.scale;
        const final = x + effective;
        if (final > 3 || final < 0.1) {
          return;
        }

        this.globe.scale.set(final, final, final);
        this.earthSectionLeft.scale.set(final, final, final);
        this.earthSectionRight.scale.set(final, final, final);
        this.innerHotspots.scale.set(final, final, final);
        this.saved.scale = scale;
      });

      hammer.on('panend', () => {
        ReactGA.event({
          category: 'ui',
          action: 'interaction',
          label: 'rotate',
        });
      });

      hammer.on('pinchend', () => {
        ReactGA.event({
          category: 'ui',
          action: 'interaction',
          label: 'scale',
        });
      });
    };

    this.displayHelp = (index = 0) => {
      const { props } = this;
      const messages = [
        'INSTRUCTIONS_SWIPE',
        'INSTRUCTIONS_PINCH',
        'INSTRUCTIONS_TAP',
        'INSTRUCTIONS_ICON',
      ];
      const current = messages[index];
      props.closeMessage(true);

      this.helpTimeout = setTimeout(() => {
        props.setMessage(current);

        setTimeout(() => {
          if (typeof messages[index + 1] !== 'undefined') {
            this.displayHelp(index + 1);
          } else {
            props.closeMessage();
            props.setHelpDisplayed();
          }
        }, 3000);
      }, 350);
    };

    this.spawnEarth = () => {
      const { x: gX, z: gZ } = this.group.position;
      this.earthSectionLeft.position.set(gX, GLOBE_Y_CENTER, gZ);
      this.earthSectionRight.position.set(gX, GLOBE_Y_CENTER, gZ);
      this.innerHotspots.position.set(gX, GLOBE_Y_CENTER, gZ);

      const scale = { x: 0.0001, y: 0.0001, z: 0.0001 };
      this.globe.scale.set(0.0001, 0.0001, 0.0001);
      this.globe.visible = true;

      // Start autoupdating matrixes
      this.group.position.setFromMatrixPosition(this.group.matrix);
      this.group.matrixAutoUpdate = true;

      // Force childs to be visible
      this.earth.visible = true;
      this.hotspots.visible = true;
      this.ring.visible = false;
      this.fakeEarth.visible = false;

      this.group.rotation.y = this.camera.rotation.y;

      new Tween(scale)
        .to({ x: 1, y: 1, z: 1 }, 750)
        .easing(Easing.Quadratic.Out)
        .on('update', ({ x, y, z }) => { this.globe.scale.set(x, y, z); })
        .on('complete', () => {
          this.earthSectionLeft.scale.set(1, 1, 1);
          this.earthSectionRight.scale.set(1, 1, 1);
          this.innerHotspots.scale.set(1, 1, 1);
        })
        .start()
        .delay(2000);

      ReactGA.event({
        category: 'app',
        action: 'globe',
        label: 'place',
      });
    };

    this.updateSections = (degrees = 120, reset = false) => {
      // Clamp it so we avoid overlapping the meshes;
      const d = Math.min(180, Math.max(0, degrees));

      const [planeLeft, planeRight] = this.clipPlanes;
      const [normalLeft, normalRight] = this.planeNormal;
      const [pointLeft, pointRight] = this.planePoint;

      if (reset === true) {
        this.earthSectionLeft.rotation.y = 0;
        normalLeft.set(0, 0, -1).applyQuaternion(this.earthSectionLeft.quaternion);
        pointLeft.copy(this.group.position);
        planeLeft.setFromNormalAndCoplanarPoint(normalLeft, pointLeft);
        this.innerHotspots.rotation.y = this.earthSectionLeft.rotation.y + MathUtils.degToRad(90);
      }

      this.earthSectionRight.rotation.y = MathUtils.degToRad(-180 + d);

      normalRight.set(0, 0, -1).applyQuaternion(this.earthSectionRight.quaternion);
      pointRight.copy(this.group.position);
      planeRight.setFromNormalAndCoplanarPoint(normalRight, pointRight);
    };

    this.globePipelineModule = () => {
      const placeObjectOnPlanet = (coords) => {
        const sprite = coords.component === 'Section' ? 'globe' : 'info';
        const hotspot = MeshHandler.hotspotGeometry(coords, 0.5, 1, sprite);
        this.hotspots.add(hotspot);
      };

      const placeObjectInsidePlanet = (coords, index) => {
        const { component, distance } = coords;
        const hotspot = MeshHandler.hotspotGeometry(
          {
            lat: 85 - (index * 25),
            lon: 2,
            component,
          }, distance, 1.5, 'info',
        );
        this.innerHotspots.add(hotspot);
      };

      const initXrScene = () => {
        this.listener = new AudioListener();
        this.camera.add(this.listener);

        // create a global audio sources
        this.audioInteraction = new Audio(this.listener);
        this.audioBg = new Audio(this.listener);
        this.scene.add(this.group);

        // Surface invisible area
        this.surface = new Mesh(
          new PlaneGeometry(80, 80, 1, 1),
          new MeshBasicMaterial({
            color: 0xff00ff,
            transparent: true,
            opacity: 0,
            side: DoubleSide,
          }),
        );

        this.surface.rotateX(MathUtils.degToRad(-90));
        this.surface.position.set(0, 0, 0);
        this.surface.receiveShadow = true;

        this.scene.add(this.surface);

        // Ligths
        this.scene.add(new AmbientLight(0xaaaaaa, 0.85));
        this.sunlight = new PointLight(0xffffff, 1.5);
        this.sunlight.position.set(0, GLOBE_Y_CENTER, 0);
        this.scene.add(this.sunlight);

        this.ring = new Mesh(
          new RingBufferGeometry(0.15, 0.2, 32, 1).rotateX(-Math.PI / 2),
          new MeshBasicMaterial({
            color: Palette.lightGreen,
            side: DoubleSide,
          }),
        );
        this.group.matrixAutoUpdate = false;
        this.group.add(this.ring);

        COORDS.map((coord) => placeObjectOnPlanet(coord));
        INNER_COORDS.map((coord, index) => placeObjectInsidePlanet(coord, index));
        this.globe.add(this.hotspots);

        // Section caps + hotspots
        this.scene.add(this.earthSectionLeft);
        this.scene.add(this.earthSectionRight);
        this.scene.add(this.innerHotspots);

        this.attachHandlers();
      };

      const updateGlobe = () => {
        const { x, y, z } = this.xrCamera.position;

        this.sunlight.position.set(x, y, z);

        const delta = this.clock.getDelta();

        if (this.mixer) {
          this.mixer.update(delta);
        }

        if (this.globe && this.rotating === true) {
          this.globe.rotateY(MathUtils.degToRad(0.118));
        }
      };

      const animateHotspots = () => {
        if (this.hotspots.children.length > 0) {
          this.hotspots.children.map((hot) => {
            const { animator } = hot.userData;
            animator.animate();
            return true;
          });
        }
      };

      // Mouse and resize events
      const onWindowResize = () => {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      };

      this.renderer = new WebGLRenderer({
        antialias: true,
        alpha: true,
        canvas: this.canvas,
      });

      // Enable XR AR
      this.renderer.xr.enabled = true;
      this.renderer.localClippingEnabled = false;


      const { session } = this.props;

      this.renderer.xr.setReferenceSpaceType('local');
      this.renderer.xr.setSession(session);

      this.xrCamera = this.renderer.xr.getCamera(this.camera);

      initXrScene();
      window.addEventListener('resize', onWindowResize, false);

      const animate = () => {
        this.renderer.setAnimationLoop((time, frame) => {
          updateGlobe(time);
          animateHotspots(time);
          TweenUpdate(time);

          const { props } = this;
          const { store } = props;
          const { app, ui } = store;
          const { message } = ui;

          if (frame && app.globePlaced === false) {
            const referenceSpace = this.renderer.xr.getReferenceSpace();
            const currentSession = this.renderer.xr.getSession();

            if (this.hitTestSourceRequested === false) {
              currentSession.requestReferenceSpace('viewer').then((ref) => {
                currentSession.requestHitTestSource({ space: ref }).then((source) => {
                  this.hitTestSource = source;
                });
              });

              currentSession.addEventListener('end', () => {
                this.hitTestSourceRequested = false;
                this.hitTestSource = null;
              });

              this.hitTestSourceRequested = true;
            }

            if (this.hitTestSource) {
              const hitTestResults = frame.getHitTestResults(this.hitTestSource);

              if (hitTestResults.length) {
                const hit = hitTestResults[0];

                const { matrix } = hit.getPose(referenceSpace).transform;
                this.group.matrix.fromArray(matrix);
                this.group.visible = true;
                if (message !== 'PLACE_GLOBE') {
                  props.setMessage('PLACE_GLOBE');
                }
              } else {
                this.group.visible = false;
                if (message !== 'SCAN_FLOOR') {
                  props.setMessage('SCAN_FLOOR');
                }
              }
            }
          }

          this.renderer.render(this.scene, this.camera);
        });
      };

      animate();
    };
  }

  componentDidMount() {
    ReactGA.pageview('/globe');
    this.canvas = this.el.current;

    const { globe } = this.props;

    this.earth = globe;

    this.fakeEarth = globe.clone();

    this.fakeEarth.traverse((node) => {
      const n = node;
      if (n.isMesh) {
        n.material = n.material.clone();
        if (n.name === 'ocean') {
          n.visible = false;
        }
      }
    });

    Utils.setOpacity(this.fakeEarth, 0.3);
    this.fakeEarth.position.set(0, GLOBE_Y_CENTER, 0);
    this.group.add(this.fakeEarth);

    this.globe.add(this.earth);
    this.globe.visible = false;

    this.globe.position.set(0, GLOBE_Y_CENTER, 0);

    this.earth.scale.set(GLOBE_SCALE, GLOBE_SCALE, GLOBE_SCALE);
    this.fakeEarth.scale.set(GLOBE_SCALE, GLOBE_SCALE, GLOBE_SCALE);

    // Add section meshes
    this.earthCore = MeshHandler.createCore();
    this.globe.add(this.earthCore);

    // Need to be detached from the group otherwise reports odd rotation quatertions.
    // Will add on init Scene and move it when spawnEarth is invoked
    this.earthSectionLeft = MeshHandler.createSectionMesh();
    this.earthSectionRight = MeshHandler.createSectionMesh();

    this.earthSectionLeft.visible = false;
    this.earthSectionRight.visible = false;
    this.innerHotspots.visible = false;
    this.earthCore.visible = false;

    this.globe.rotateY(MathUtils.degToRad(-180));

    this.group.add(this.globe);
    this.globePipelineModule();
  }

  componentDidUpdate(prevProps) {
    const { props } = this;
    const { globe, store } = props;
    const { ui, app } = store;
    const { ui: prevUi, app: prevApp } = prevProps.store;

    // Hide Hotspot states
    if (prevUi.hideHotspots === false && ui.hideHotspots === true) {
      this.rotating = false;
      Utils.animateOpacity(this.hotspots, 1, 0);
    }

    if (prevUi.hideHotspots === true && ui.hideHotspots === false) {
      this.hotspots.visible = true;
      Utils.animateOpacity(this.hotspots, 0, 1);
    }

    // Biomes states
    if (prevUi.biome === false && ui.biome === true) {
      ReactGA.event({
        category: 'app',
        action: 'biome',
        label: app.biome,
      });
      ReactGA.pageview(`/globe/${app.biome.toLowerCase()}`);

      if (this.helpTimeout) {
        clearTimeout(this.helpTimeout);
        props.closeMessage(true);
        props.setHelpDisplayed();
      }

      const { biomes, scales } = globe.userData;
      const { children = [] } = biomes[app.biome.toLowerCase()];

      const bgAudio = globe.userData.audioBuffers[`${app.biome.toLowerCase()}-bg`];

      if (bgAudio) {
        this.audioBg.setBuffer(bgAudio);
        this.audioBg.setLoop(true);
        this.audioBg.play();
      }

      if (children.length === 0) {
        return;
      }

      let delay = 0;

      children.forEach((obj) => {
        const { x, y, z } = scales[obj.name];
        Utils.animateScale(obj, { x: 0, y: 0, z: 0 }, { x, y, z }, delay);

        delay += 150;
      });
    }

    if (prevUi.biome === true && ui.biome === false) {
      const { biomes, scales } = globe.userData;
      const { children = [] } = biomes[app.biome.toLowerCase()];

      ReactGA.pageview('/globe');

      if (this.audioInteraction.isPlaying) {
        this.audioInteraction.stop();
      }
      if (this.audioBg.isPlaying) {
        this.audioBg.stop();
      }

      if (children.length === 0) {
        return;
      }

      let delay = 0;

      children.forEach((obj) => {
        const { x, y, z } = scales[obj.name];
        Utils.animateScale(obj, { x, y, z }, { x: 0, y: 0, z: 0 }, delay);

        delay += 120;
      });
    }

    if (prevApp.section !== app.section) {
      ReactGA.event({
        category: 'app',
        action: 'interaction',
        label: 'section',
      });

      this.updateSections(app.section);
    }

    if (prevUi.picture === false && ui.picture === true) {
      ReactGA.event({
        category: 'app',
        action: 'photo',
        label: 'taken',
      });

      this.takeScreenshot();
    }

    if (prevApp.globePlaced === true && app.globePlaced === false) {
      this.ring.visible = true;
      this.fakeEarth.visible = true;
      this.globe.visible = false;

      this.group.matrixAutoUpdate = false;

      // Reset positions
      this.group.rotation.y = 0;
      this.globe.rotation.z = 0;
      this.globe.rotation.x = 0;

      ReactGA.event({
        category: 'app',
        action: 'globe',
        label: 'reset',
      });
    }

    // Section triggers
    // In
    if (prevUi.section === false && ui.section === true) {
      ReactGA.event({
        category: 'app',
        action: 'section',
        label: 'open',
      });
      ReactGA.pageview('/globe/section');

      if (this.helpTimeout) {
        clearTimeout(this.helpTimeout);
        props.closeMessage(true);
        props.setHelpDisplayed();
      }

      this.updateSections(app.section, true);
      this.renderer.localClippingEnabled = true;

      this.earth.traverse((node) => {
        const n = node;
        if (n.isMesh) {
          n.material.clippingPlanes = this.clipPlanes;
          n.material.clipIntersection = true;
          if (n.name === 'earth') {
            n.material.side = DoubleSide;
          }
        }
      });

      this.earthSectionLeft.visible = true;
      this.earthSectionRight.visible = true;
      this.earthCore.visible = true;
      this.innerHotspots.visible = true;
    }

    // Out
    if (prevUi.section === true && ui.section === false) {
      ReactGA.event({
        category: 'app',
        action: 'section',
        label: 'close',
      });
      ReactGA.pageview('/globe');

      this.renderer.localClippingEnabled = false;

      this.earth.traverse((node) => {
        const n = node;
        if (n.isMesh) {
          n.material.clippingPlanes = [];
          n.material.clipIntersection = false;
          if (n.name === 'earth') {
            n.material.side = FrontSide;
          }
        }
      });

      this.earthSectionLeft.visible = false;
      this.earthSectionRight.visible = false;
      this.earthCore.visible = false;
      this.innerHotspots.visible = false;
    }
  }

  render() {
    return (
      <>
        <Canvas id="ar" ref={this.el} />
      </>
    );
  }
}

export default connect(
  (state) => ({ store: getState(state) }),
  {
    toggleSection,
    selectBiome,
    resetGlobe,
    placeGlobe,
    setMessage,
    closeMessage,
    setHelpDisplayed,
  },
)(GlobeAR);
