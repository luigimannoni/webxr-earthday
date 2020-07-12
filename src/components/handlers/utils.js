import { Tween, Easing } from 'es6-tween';

const Utils = {
  setOpacity(obj, opacity) {
    obj.traverse((child) => {
      if (child.material) {
        const { material } = child;

        material.transparent = true; // opacity < 1 || false;
        material.opacity = opacity;
      }
    });
  },

  cloneMaterials(obj) {
    obj.traverse((child) => {
      if (child.material) {
        const { material } = child;
        // eslint-disable-next-line no-param-reassign
        child.material = material.clone();
      }
    });
  },

  animateOpacity(obj, from, to) {
    const o = obj;
    const prop = {
      opacity: from,
    };

    new Tween(prop)
      .to({ opacity: to }, 750)
      .easing(Easing.Quadratic.Out)
      .on('update', ({ opacity }) => {
        Utils.setOpacity(o, opacity);
      })
      .on('complete', () => {
        if (to === 0) {
          o.visible = false;
        }
      })
      .start();
  },

  animateScale(obj, from, to, delay = 0) {
    const o = obj;
    const ease = to.y === 0 ? Easing.Quadratic.Out : Easing.Elastic.Out;

    new Tween(from)
      .to(to, 1750)
      .easing(ease)
      .on('start', () => {
        if (from.y === 0) {
          o.visible = true;
        }
      })
      .on('update', ({ x, y, z }) => {
        o.scale.set(x, y, z);
      })
      .on('complete', () => {
        if (to.y === 0) {
          o.visible = false;
        }
      })
      .delay(delay)
      .start();
  },

  shrub(obj, from, delay = 0) {
    const o = obj;
    const multiplier = Math.cos(Math.random() * Math.PI);
    const variance = 0.3 * multiplier;

    const prop = {
      x: from.x + variance,
      y: from.y + variance,
      z: from.z + variance,
    };

    const forward = new Tween(from)
      .to(prop, 2000)
      .easing(Easing.Elastic.Out)
      .on('update', ({ x, y, z }) => {
        o.rotation.set(x, y, z);
      })
      .delay(delay);

    new Tween(prop)
      .to(from, 2000)
      .easing(Easing.Elastic.Out)
      .on('update', ({ x, y, z }) => {
        o.rotation.set(x, y, z);
      })
      .chainedTweens(forward)
      .delay(delay)
      .start();
  },
};

export default Utils;
