/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable object-curly-spacing */
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import ReactSlider from 'react-slider';

import Button from './Button';

import { getState } from '../redux/selectors';
import { toggleSection, updateSection } from '../redux/actions';

const Container = styled.div`
  z-index: 1010;
  position: fixed;
  display: flex;
  flex-direction: column;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: auto;
  padding: 1rem;
  justify-content: flex-end;
  align-items: flex-start;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 15%, rgba(0, 0, 0, 0.8) 100%);  
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  width: 100%;
  margin-top: 0.8rem;
  margin-bottom: 0.8rem;

  &.center {
    align-items: center;
    justify-content: center;
  }

  p {
    margin-top: 0;
    margin-bottom: 0;
  }
`;

const StyledSlider = styled(ReactSlider)`
  width: 100%;
  height: 0.5rem;
`;

const StyledThumb = styled.div`
  height: 1.5rem;
  line-height: 1.5rem;
  width: 1.5rem;
  text-align: center;
  background-color: var(--blue);
  color: white;
  border-radius: 50%;
  cursor: grab;
  transform: translateY(-0.5rem);
  position: relative;
  outline: none;

  span {
    position: absolute;
    bottom: calc(100% + 10px);
    background-color: var(--deep-blue);
    color: white;
    border-radius: 0.15rem;
    font-size: 0.75rem;
    line-height: 0.75rem;
    padding: 0.5rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;

    &::before {
      content: '';
      position: absolute;
      height: 0;
      width: 0;
      border: 4px transparent solid;
      border-top-color: var(--deep-blue);
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);      
    }
  }
`;

const StyledTrack = styled.div`
  top: 0;
  bottom: 0;
  background: var(--deep-blue);
  border-radius: 0.25rem;
`;

const Thumb = (props, state) => (<StyledThumb {...props}><span>{`${(state.valueNow * (180 / 100)).toFixed(0)}\u00b0`}</span></StyledThumb>);
const Track = (props, state) => (<StyledTrack {...props} index={state.index} />);

const SectionControls = (props) => {
  const { store } = props;
  const { app } = store;

  return (
    <>
      <Container>
        <List key="section-slider">
          <StyledSlider
            defaultValue={(app.section / 180) * 100}
            ariaLabel="Angle section"
            renderTrack={Track}
            renderThumb={Thumb}
            onChange={(value) => {
              const degrees = (value * (180 / 100)).toFixed(0);
              props.updateSection(degrees);
            }}
          />
        </List>
        <List key="section-button" className="center">
          <Button icon="close" onClick={() => props.toggleSection()} />
        </List>
      </Container>
    </>
  );
};

export default connect(
  (state) => ({ store: getState(state) }),
  {
    toggleSection,
    updateSection,
  },
)(SectionControls);
