import {
  SELECT_BIOME,
  CLOSE_BIOME,
  SET_MESSAGE,
  PLACE_GLOBE,
  RESET_GLOBE,
  UPDATE_SECTION,
  HELP_DISPLAYED,
} from '../actionTypes';

const initialState = {
  camera: false,
  biome: false,
  message: 'PLACE_GLOBE',
  globePlaced: false,
  section: 120,
  helpDisplayed: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SELECT_BIOME: {
      const { biome } = action.payload;

      return {
        ...state,
        biome,
      };
    }

    case CLOSE_BIOME: {
      return {
        ...state,
      };
    }

    case SET_MESSAGE: {
      const { message } = action.payload;

      return {
        ...state,
        message,
      };
    }

    case PLACE_GLOBE: {
      return {
        ...state,
        globePlaced: true,
      };
    }

    case RESET_GLOBE: {
      return {
        ...state,
        globePlaced: false,
        message: 'PLACE_GLOBE',
      };
    }

    case UPDATE_SECTION: {
      const { degrees } = action.payload;

      return {
        ...state,
        section: degrees,
      };
    }


    case HELP_DISPLAYED: {
      return {
        ...state,
        helpDisplayed: true,
      };
    }

    default:
      return state;
  }
}
