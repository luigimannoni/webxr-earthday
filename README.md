# WebXR Earth Day
[![Build Status](https://travis-ci.org/luigimannoni/webxr-earthday.svg?branch=master)](https://travis-ci.org/luigimannoni/webxr-earthday)

![WebXR Earth Day Demo](https://i.imgur.com/6AvpJFW.gif)

## [Demo here](https://luigimannoni.github.io/webxr-earthday)

## What's this?

This repo contains a (rather quick and ugly) refactor in pure WebXR of one of my previous projects, *Earth Day AR 2020* which originally ran through 8thwall's SLAM library.

Built on top of Threejs and React

## Requirements

At the moment you need a WebXR-capable browser, that means probably you need an Android device with Chrome 81 at least. Prior versions can still make the experiment run fiddling and enabling 2 flags on [chrome://flags](chrome://flags)<sup>\*</sup>

1. WebXRDevice API (#webxr) 
2. WebXR Hit Test (#webxr-hit-test)

## Forking, development and stuff

As usual, type in `npm install` and run `npm run dev` to start your Dev server on `https://localhost:3000`, you must have an Android phone running with the debug flag on, attached via USB. Head over to [chrome://inspect](chrome://inspect) and enable Port Forwarding from 3000 to localhost:3000.

Navigate on `https://localhost:3000`, accept any untrusted SSL warnings on your device and you are all set.

---

## Asset credits

### Models

* [Stylized Earth, courtesy of Ryan Zehm](http://www.nurfacegames.com/)
* [Palm Tree, courtesy of Ada_King](https://www.turbosquid.com/3d-models/blender-carrot-crystal-oak-tree-3d-model-1189852)
* [Low Poly Stone Archway, courtesy of AlicePandaArt](https://sketchfab.com/3d-models/low-poly-stone-archway-de9063734b9747378af656192de08ac1)
* [Low Poly Thumbleweed, courtesy of AlicePandaArt](https://sketchfab.com/3d-models/low-poly-thumbleweed-07b59c14e20d44cb875269eb17e92511)
* [Low Poly Cali Palm, courtesy of AlicePandaArt](https://sketchfab.com/3d-models/low-poly-cali-palm-c3014726e47b4977b6097306224fdd94)
* [Low Poly Rock set, courtesy of louis-miur](https://sketchfab.com/3d-models/low-poly-rock-set-48f8612d1db1429d976f8d4f08ed0f0c)
* [Low Poly Game set, courtesy of Svetlana Melnik](https://www.cgtrader.com/free-3d-models/plant/other/low-poly-trees-bc8c4b70-6db2-4632-b069-e5ac0a8a3902)

### Sounds
* [Cut and pasting and resampling various sounds from freesound.org](https://freesound.org/)

## Original project

The original project is cross-browser compatible but runs obviously less efficently than the WebXR counterpart.
It can still be accessed [through this link](https://earthdayar.com/)

<small>\* You're responsible for any changes on your browser</small> 