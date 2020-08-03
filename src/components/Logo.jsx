import React, { Component } from 'react';
import styled from 'styled-components';

const Image = styled.img`
  width: 100%;
  height: auto;
`;

const Inline = styled.img`
  width: auto;
  height: 2rem;
`;

export default class Logo extends Component {
  constructor() {
    super();

    this.onClick = () => {
      const { onClick } = this.props;
      if (onClick) {
        onClick();
      }
    };
  }

  render() {
    const { inline } = this.props;

    return (
      <>
        {inline ? <Inline src={`${process.env.PUBLIC_URL}/assets/images/logo-inline.png`} alt="AR Earth Day 2020" /> : <Image src={`${process.env.PUBLIC_URL}/assets/images/logo.png`} alt="AR Earth Day 2020" />}
      </>
    );
  }
}
