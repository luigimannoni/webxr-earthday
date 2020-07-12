import React, { Component } from 'react';
import styled from 'styled-components';

import {
  FaInfo,
  FaCaretLeft,
  FaCaretDown,
  FaCamera,
  FaTimes,
  FaGlobe,
  FaQuestion,
  FaCaretRight,
  FaRegHandPointUp,
  FaCompressArrowsAlt,
} from 'react-icons/fa';
import {
  IoIosWarning,
  IoMdMove,
} from 'react-icons/io';
import {
  AiOutlineLoading3Quarters,
} from 'react-icons/ai';


export default class Button extends Component {
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
    const {
      icon,
      square,
      big,
      text,
      disabled,
    } = this.props;

    let Size = big ? `
      padding: 1.25rem;
      font-size: 1.95rem;  
      line-height: 0;
    ` : `
      padding: 0.75rem;
      font-size: 1.55rem;  
      line-height: 0;
    `;

    if (square) {
      Size = `
        padding: 1rem;
        font-size: 1.2rem;
        line-height: 1rem;  
      `;
    }


    const greenButton = (icon === 'info' || icon === 'globe' || icon === 'tap');
    const BaseButton = greenButton ? `
      z-index: 1000;
      position: relative;
      background-color: transparent;
      color: var(--sand);
      cursor: pointer;
      border-width: 0;
      outline-width: 0;

      &:active {
        background-color: var(--green);
      }

      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 50%;
      }
      
      &::before {
        animation: buttonpulse 1500ms linear infinite;
        z-index: 1;
        border: 1rem solid var(--light-green);
      }
      &::after {
        background-color: var(--green);
        z-index: 2;
      }
      svg {
        position: relative;
        z-index: 3;
      }
    ` : `
      z-index: 1000;
      position: relative;
      background-color: var(--deep-blue);
      color: var(--sand);
      cursor: pointer;
      border-width: 0;
      outline-width: 0;

      &:active {
        background-color: var(--blue);
      }
    `;

    const FullButton = `
      border-radius: ${square ? '0.25rem' : '50%'};
      ${Size}
      ${BaseButton}
      opacity: ${icon === 'empty' ? '0' : '1'};
      pointer-events: auto;
    `;

    const UIButton = disabled ? styled.div`${FullButton}` : styled.button`${FullButton}`;

    const ComponentMap = {
      info: FaInfo,
      back: FaCaretLeft,
      reset: FaCaretDown,
      camera: FaCamera,
      close: FaTimes,
      globe: FaGlobe,
      help: FaQuestion,
      play: FaCaretRight,
      unknown: IoIosWarning,
      spinner: AiOutlineLoading3Quarters,
      tap: FaRegHandPointUp,
      move: IoMdMove,
      pinch: FaCompressArrowsAlt,
    };

    const IconComponent = ComponentMap[icon] || ComponentMap.unknown;
    const className = icon === 'spinner' ? 'fa-spin' : '';

    return (
      <>
        <UIButton
          onClick={disabled ? null : this.onClick}
          type={disabled ? '' : 'button'}
        >
          {icon ? <IconComponent className={className} /> : null}
          {text ? <span>{text}</span> : null}
        </UIButton>
      </>
    );
  }
}
