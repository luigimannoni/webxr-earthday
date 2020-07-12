import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Button from './Button';

import { toggleInfo } from '../redux/actions';


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

  &::before {
    content: '';
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin-top: 0.4rem;
  margin-bottom: 0.4rem;

  &.center {
    justify-content: center;
  }

  div + p {
    padding-left: 1rem;
    margin-top: 0;
    margin-bottom: 0;
  }
`;

const legend = [
  {
    icon: 'info',
    title: 'Point of interest',
    description: 'Tap on the pulsating icon to explore more',
  },
  {
    icon: 'camera',
    title: 'Camera mode',
    description: 'Take a picture and share with your friends',
  },
  {
    icon: 'globe',
    title: 'Cross-Section',
    description: 'Explore the Earth\'s inner core with this tool',
  },
  {
    icon: 'reset',
    title: 'Replace Earth',
    description: 'If you moved too far away you can reposition the planet by pressing this button',
  },
];

const InfoOverlay = (props) => (
  <>
    <Container>
      <h1>Exploring AR Earth Day 2020</h1>
      {
        legend.map((item) => {
          const { icon, title, description } = item;
          const key = `info-${icon}`;

          return (
            <List key={key}>
              <Button disabled icon={icon} />
              <p>
                <strong>{title}</strong>
                <br />
                {description}
              </p>
            </List>
          );
        })
      }
      <List key="info-button" className="center">
        <Button square text="Got it!" onClick={() => props.toggleInfo()} />
      </List>
    </Container>
  </>
);

export default connect(
  null,
  {
    toggleInfo,
  },
)(InfoOverlay);
