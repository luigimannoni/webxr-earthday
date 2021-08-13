import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';

import { getState } from '../redux/selectors';
import {
  toggleCamera,
  toggleSection,
  toggleInfo,
  closeBiome,
  resetGlobe,
} from '../redux/actions';


import Biome from './Biome';
import InfoOverlay from './InfoOverlay';

import Button from './Button';
import Logo from './Logo';
import SectionControls from './SectionControls';

const baseStyles = `
  z-index: 1001;
  position: relative;
  display: flex;
  flex-direction: row;
  position: fixed;
  left: 0;
  width: 100%;
  padding: 1rem;
  justify-content: space-between;
  align-items: center;
`;

const TopContainer = styled.div`
  top: 0;
  ${baseStyles}
  pointer-events: none;
`;

const BottomContainer = styled.div`
  bottom: 0;
  ${baseStyles}

  p {
    width: 100%;
    text-align: center;
    font-size: 1.3rem;

    button {
      vertical-align: middle;
      margin: 0 0.5rem;
    }
  }
`;

const BottomFade = styled.div`
  bottom: 0;
  ${baseStyles}
  z-index: 1000;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%);
  height: 5rem;
  pointer-events: none;
`;

const STRINGS = {
  CAMERA_ACCESS_REQUIRED: 'To continue with the AR experience we need to access to your camera',
  CAMERA_ACCESS_DENIED: 'We can\'t offer an AR experience without camera permissions',
  SCAN_FLOOR: 'Move your phone to scan a well lit and flat surface',
  PLACE_GLOBE: 'Tap on the screen to spawn the 3D earth',
  INSTRUCTIONS_SWIPE: (
    <>
      <Button icon="move" />
      <span>Swipe to spin the globe</span>
    </>
  ),
  INSTRUCTIONS_PINCH: (
    <>
      <Button icon="pinch" />
      <span>Pinch to zoom in and out</span>
    </>
  ),
  INSTRUCTIONS_TAP: (
    <>
      <Button icon="tap" />
      <span>Tap on biomes to interact and titles to find out more</span>
    </>
  ),
  INSTRUCTIONS_ICON: (
    <>
      <span>Tap on </span>
      <Button icon="info" />
      <span> to explore</span>
    </>
  ),
};

const Interface = (props) => {
  const { store } = props;

  return (
    <div id="interface">
      <TopContainer>
        <CSSTransition
          in={!store.ui.picture}
          classNames="slide-up"
          timeout={300}
          unmountOnExit
          appear
        >
          <Logo inline />
        </CSSTransition>
        <CSSTransition
          in={!store.ui.hide || store.ui.biome}
          classNames="slide-up"
          timeout={300}
          appear
        >
          <div>
            {
              store.ui.biome
                ? <Button icon="close" onClick={() => props.closeBiome()} />
                : <Button icon="help" onClick={() => props.toggleInfo()} />
            }
          </div>
        </CSSTransition>
      </TopContainer>

      <CSSTransition
        in={!store.ui.hide && !store.ui.biome}
        classNames="slide-down"
        timeout={300}
        unmountOnExit
        appear
      >
        <BottomContainer>
          <Button icon="reset" onClick={() => props.resetGlobe()} />
        </BottomContainer>
      </CSSTransition>

      <CSSTransition
        in={store.ui.section && !store.ui.biome}
        classNames="slide-down"
        timeout={300}
        unmountOnExit
        appear
      >
        <BottomContainer>
          <SectionControls />
        </BottomContainer>
      </CSSTransition>

      <CSSTransition
        in={store.ui.info}
        classNames="slide-down"
        timeout={300}
        unmountOnExit
        appear
      >
        <InfoOverlay />
      </CSSTransition>

      <CSSTransition
        in={store.ui.biome}
        classNames="slide-down"
        timeout={300}
        unmountOnExit
        appear
      >
        <Biome biome={store.app.biome} />
      </CSSTransition>

      <CSSTransition
        in={store.ui.message}
        classNames="slide-down"
        timeout={300}
        unmountOnExit
        appear
      >
        <BottomContainer>
          <p>{STRINGS[store.app.message]}</p>
        </BottomContainer>
      </CSSTransition>

      <BottomFade />
    </div>
  );
};

export default connect(
  (state) => ({ store: getState(state) }),
  {
    toggleInfo,
    toggleCamera,
    toggleSection,
    closeBiome,
    resetGlobe,
  },
)(Interface);
