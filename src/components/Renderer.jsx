import React, { Component } from 'react';
import {
  AudioLoader,
} from 'three';
import ReactGA from 'react-ga';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

import GlobeHome from './GlobeHome';
import GlobeAR from './GlobeAR';
import Loading from './Loading';
import Interface from './Interface';

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      compatible: true,
      model: null,
      playing: false,
      session: null,
    };

    this.startExperience = () => {
      const { compatible } = this.state;

      const options = {
        requiredFeatures: [
          'hit-test',
          'dom-overlay',
        ],
        domOverlay: {
          root: document.querySelector('#root'),
        },
      };

      if (compatible) {
        navigator.xr.requestSession('immersive-ar', options).then((session) => {
          ReactGA.event({
            category: 'app',
            action: 'experience',
            label: 'session start',
          });

          this.setState({
            playing: true,
            session,
          });
        });
      } else {
        this.setState({
          playing: true,
          session: false,
        });
      }
    };
  }

  componentDidMount() {
    ReactGA.pageview(window.location.pathname + window.location.search);

    const load = () => {
      const loader = new GLTFLoader();
      const loaderError = (err) => {
        // eslint-disable-next-line no-console
        window.console.warn(err);

        this.setState({
          loading: false,
        });
      };

      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath(`${process.env.PUBLIC_URL}/draco/gltf/`);
      dracoLoader.preload();

      loader.setDRACOLoader(dracoLoader);

      const files = {
        globe: `${process.env.PUBLIC_URL}/assets/models/globe.glb`,
        audios: [
          'temperaterainforest-bg',
          'temperaterainforest-interaction',
          'freshwater-bg',
          'freshwater-interaction',
          'tropicalrainforest-bg',
          'tropicalrainforest-interaction',
          'chaparral-bg',
          'chaparral-interaction',
        ],
      };
      const audioBuffers = {};

      loader.load(files.globe, (globeglb) => {
        // Extrapolate object group
        ReactGA.event({
          category: 'loaders',
          action: 'model_loaded',
          label: 'earth',
          nonInteractive: true,
        });

        const { scene } = globeglb;
        const [
          temperaterainforest,
          freshwater,
          tropicalrainforest,
          chaparral,
        ] = scene.children;

        const biomes = {
          temperaterainforest,
          tropicalrainforest,
          chaparral,
          freshwater,
        };

        ReactGA.event({
          category: 'loaders',
          action: 'model_loaded',
          label: 'biomes',
          nonInteractive: true,
        });

        const scales = {};
        const rotations = {};

        Object.keys(biomes).forEach((key) => {
          const biome = biomes[key];
          biome.children.forEach((obj) => {
            // Fast copies
            const { x: xS, y: yS, z: zS } = obj.scale;
            scales[obj.name] = JSON.parse(JSON.stringify({ x: xS, y: yS, z: zS }));

            const { x: xR, y: yR, z: zR } = obj.rotation;
            rotations[obj.name] = JSON.parse(JSON.stringify({ x: xR, y: yR, z: zR }));

            obj.scale.set(0.0000001, 0.0000001, 0.0000001);
            // eslint-disable-next-line no-param-reassign
            obj.visible = false;
          });
        });

        this.setState({
          model: scene,
        });

        const { compatible } = this.state;
        if (compatible) {
          const audioLoader = new AudioLoader();

          files.audios.forEach((file) => {
            audioLoader.load(`${process.env.PUBLIC_URL}/assets/sounds/${file}.mp3`, (buffer) => {
              audioBuffers[file] = buffer;

              ReactGA.event({
                category: 'loaders',
                action: 'audio_loaded',
                label: file,
                nonInteractive: true,
              });
            });
          });
        }

        scene.userData = {
          biomes,
          scales,
          rotations,
          audioBuffers,
        };

        this.setState({
          loading: false,
        });
      }, null, loaderError);
    };

    const setCompatibilityAndLoad = (compatible) => {
      this.setState({
        compatible,
      });

      load();
    };

    const notCompatible = (err) => {
      window.console.warn(err);

      setCompatibilityAndLoad(false);
    };

    window.onload = () => {
      // eslint-disable-next-line no-console
      if (typeof navigator.xr !== 'undefined' && navigator.xr.isSessionSupported) {
        navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
          if (supported) {
            setCompatibilityAndLoad(true);
          } else {
            notCompatible('XR exists but immersive AR is not supported');
          }
        }).catch(notCompatible);
      } else {
        notCompatible('XR does not exist');
      }
    };
  }

  render() {
    const {
      model,
      loading,
      playing,
      compatible,
      session,
    } = this.state;

    if (playing) {
      return (
        <>
          <GlobeAR globe={model} session={session} />
          <Interface />
        </>
      );
    }

    return (
      <>
        <GlobeHome globe={model} />
        <Loading load={loading} compatible={compatible} onClickPlay={this.startExperience} />
      </>
    );
  }
}
