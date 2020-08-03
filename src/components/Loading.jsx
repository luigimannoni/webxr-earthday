import React from 'react';
import styled from 'styled-components';

import Button from './Button';
import Logo from './Logo';

const baseStyles = `
  z-index: 1000;
  position: relative;
  display: flex;
  flex-direction: row;
  position: fixed;
  left: 0;
  width: 100vw;
  margin: auto;
  padding: 2rem;
  justify-content: center;
  align-items: center;
`;

const TopContainer = styled.div`
  top: 50%;
  ${baseStyles}
  transform: translateY(-50%);
  transition: top 1500ms ease-in-out, transform 1500ms ease-in-out;

  &.loaded {
    transform: translateY(0);
    top: 0;
  }
`;

const MiddleContainer = styled.div`
  bottom: 6rem;
  ${baseStyles}
  opacity: 1;
  transition: opacity 900ms linear;

  &.loaded {
    opacity: 0;
  }

  img {
    max-height: 2rem;
    width: auto;
    margin: 0 0.5rem;
  }
`;

const BottomContainer = styled.div`
  bottom: 0;
  ${baseStyles}
  flex-direction: column;

  & p {
  }
`;

const LogoContainer = styled.div`
  max-width: 240px;
`;

const Loading = (props) => {
  const { load, onClickPlay, compatible } = props;

  return (
    <>
      <TopContainer className={load ? 'loading' : 'loaded'}>
        <LogoContainer>
          <Logo />
        </LogoContainer>
      </TopContainer>

      <MiddleContainer className={load ? 'loading' : 'loaded'}>
        <a
          rel="nofollow noopener noreferrer"
          target="_blank"
          href="https://threejs.org"
        >
          <img
            alt="Powered by ThreeJS"
            src={`${process.env.PUBLIC_URL}/assets/images/threejs.svg`}
          />
        </a>

        <a
          rel="nofollow noopener noreferrer"
          target="_blank"
          href="https://immersive-web.github.io/webxr-samples/"
        >
          <img
            alt="Powered by WebXR"
            src={`${process.env.PUBLIC_URL}/assets/images/webxr-logo.svg`}
          />
        </a>
      </MiddleContainer>

      <BottomContainer>
        {load && <Button square text="Loading assets" />}
        {(!load && compatible) && <Button square text="Start AR" onClick={() => { if (onClickPlay) onClickPlay(); }} />}
        {(!load && !compatible) && (
          <>
            <p>
              WebXR is either not supported or not enabled on your browser,
              please make sure you&apos;re running at least Chrome 81 on an AR-compliant device
            </p>
            <p>
              Alternatively enable the following two Chrome flags (chrome://flags):
              WebXRDevice API (#webxr) and WebXR Hit Test (#webxr-hit-test)
            </p>
          </>
        )}
      </BottomContainer>
    </>
  );
};

export default Loading;
