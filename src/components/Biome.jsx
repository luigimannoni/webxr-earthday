/* eslint-disable object-curly-spacing */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Button from './Button';

import { closeBiome } from '../redux/actions';

const Container = styled.div`
  position: fixed;
  z-index: 1010;
  bottom: 0;
  left: 0;
  width: 100%;
  pointer-events: none;
`;

const Slider = styled.div`
  display: flex;
  flex-direction: column;
  height: auto;
  padding: 1rem;
  justify-content: flex-end;
  align-items: flex-start;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 15%, rgba(0, 0, 0, 0.8) 100%);
  pointer-events: auto;

  h1, h2, h4 {
    margin: 0;
  }
`;


const MainTitle = styled.h1`
  vertical-align: middle;
`;

const MainDescription = styled.h4`
  vertical-align: middle;
  font-size: 1.05em;

  button {
    vertical-align: middle;
    margin-right: 0.35rem;
    font-size: 0.95em;
    padding: 0.4em;
  }
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

  .fact {
    font-size: 2.15rem;
    font-weight: 400;
    line-height: 1.15;
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;

    b {
      color: var(--fact);
    }
  }
`;

const BIOMES = {
  Ocean: {
    interactive: true,
    title: 'Atlantic Ocean',
    subtitle: 'Ocean Facts:',
    description: 'The largest and most diverse biome in the world is largely affected by trash buildup. Make sure you are taking steps to recycle your waste!',
    facts: [
      {
        title: 'Over <b>90%</b>',
        description: 'of the life on Earth lives in the oceans',
      },
      {
        title: '<b>12,400</b> feet',
        description: 'The average depth of the ocean is 12,400 ft or about 2.35 miles!',
      },
    ],
  },
  TropicalRainforest: {
    interactive: true,
    title: 'The Amazon Forest',
    subtitle: 'Tropical Rainforest Facts:',
    description: 'Tropical rainforests are important because they provide oxygen, take in carbon dioxide, and are a huge source of biodiversity and cultural diversity. Be conscious of the amount of paper you use each day to help reduce the levels of deforestation!',
    facts: [

      {
        title: 'The <b>Amazon</b>',
        description: 'is the largest Tropical Rainforest',
      },
      {
        title: '<b>50</b>% of flora and fauna',
        description: 'Only covers 2% of Earth’s surface, but contains 50% of its plants and land animals',
      },
    ],
  },
  TemperateRainforest: {
    interactive: true,
    title: 'US National Forests',
    subtitle: 'Temperate Rainforest Facts:',
    description: 'Characterized by vast amounts of rainforests and cooler temperatures than Tropical Rainforests. These forests and others have been receding from deforestation, get your friends and family together and go plant trees to help grow the forests back!',
    facts: [
      {
        title: '<b>90,000</b> acorns',
        description: 'A single oak tree in this forest can produce 90,000 acorns each year!',
      },
      {
        title: '<b>Sharp</b> claws',
        description: 'Many animals in these forests have sharp claws for climbing trees',
      },
    ],
  },
  Freshwater: {
    interactive: true,
    title: 'The Nile',
    subtitle: 'Freshwater Facts:',
    description: 'This biome consists of lakes, ponds, streams and rivers that have less than 1% of salt content. Make sure you use safe green approved pesticides and fertilizer in your gardens to help stop dangerous runoff!',
    facts: [
      {
        title: '<b>4,132</b> miles',
        description: 'The Nile is the longest freshwater river biome',
      },
      {
        title: '<b>3</b> groups',
        description: 'There are 3 groups of Freshwater biomes: lakes and ponds, streams and rivers, and wetlands',
      },
    ],
  },
  Chaparral: {
    interactive: true,
    title: 'Southern California',
    subtitle: 'Chaparral Facts:',
    description: 'Chaparral biomes help protect the dry land from eroding from wind and rain. One way to protect this biome is to take extra steps to make sure you are safe from starting a fire as these areas are prone to wildfires.',
    facts: [
      {
        title: '<b>Fire!</b>',
        description: 'Some plants in this biome have adapted to the fires, their seeds lay dormant until they are touched by fire!',
      },
      {
        title: '<b>30</b>℉ - <b>100</b>℉',
        description: 'During winter temperatures can get as low as 30 degrees F in the summer it can get up to 100 degrees F!',
      },
    ],
  },
  InnerCore: {
    title: 'Inner Core',
    subtitle: 'About 70% of the moon size',
    description: 'Only discovered to be a hard solid ball in 1936, is believed to be just as hot as the sun\'s surface.',
    facts: [
      {
        title: '<b>760</b> miles',
        description: 'is the diameter of the inner core',
      },
    ],
  },
  OuterCore: {
    title: 'Outer Core',
    subtitle: 'The only liquid layer',
    description: 'The outer core is responsible for Earth\'s magnetic field. As Earth spins on its axis, the iron inside the liquid outer core moves around',
    facts: [
      {
        title: 'Liquid <b>iron</b>',
        description: 'The outer core is so hot that the iron inside it is permanently liquid',
      },
    ],
  },
  Mantle: {
    title: 'Mantle',
    subtitle: 'Makes up about 84% of Earth\'s volume.',
    description: 'The entire mantle is about 1800 miles thick, which means the lower mantle makes up the bulk of this part of the Earth. The temperature of the mantle near the crust ranges from 900 to 1600 degrees Fahrenheit',
    facts: [
      {
        title: '<b>5400</b>℉',
        description: 'The average temperature of the Mantle',
      },
    ],
  },
  Crust: {
    title: 'Crust',
    subtitle: 'Relatively thin and rocky',
    description: 'The Earth\'s lithosphere is the rigid outer layer that is made up of the crust and the part of the mantle just below it.',
    facts: [
      {
        title: 'Only <b>2</b> miles',
        description: 'That is the thickness the crust can reach under the oceans',
      },
    ],
  },
};

class Biome extends Component {
  constructor() {
    super();
    this.state = {
      show: false,
    };

    this.toggleShow = () => {
      const { show } = this.state;
      this.setState({
        show: !show,
      });
    };
  }

  render() {
    const { props, state } = this;
    const { biome } = props;
    const b = BIOMES[biome];
    const { show } = state;

    return (
      <Container>
        <Slider
          className={`peek-down ${show ? 'show-full' : 'show-partial'}`}
          onClick={this.toggleShow}
        >
          <MainTitle>
            {b.title}
          </MainTitle>
          <MainDescription>
            {!show ? <Button icon="tap" /> : null}
            {!show ? <span>Tap here to show some facts</span> : b.subtitle}
          </MainDescription>
          {
            b.facts.map((fact, index) => {
              const { title, description } = fact;
              const key = `biome-fact-${index}`;

              return (
                <List key={key}>
                  <h1
                    className="fact"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{__html: title}}
                  />
                  <p>{description}</p>
                </List>
              );
            })
          }
          <List key="biome-description">
            <p>{b.description}</p>
          </List>
          {
            b.interactive
              ? (
                <List key="biome-button" className="center">
                  <Button icon="tap" onClick={this.toggleShow} />
                  <span>You can tap on the biome to interact with it</span>
                </List>
              ) : null
          }
        </Slider>
      </Container>
    );
  }
}

export default connect(
  null,
  {
    closeBiome,
  },
)(Biome);
