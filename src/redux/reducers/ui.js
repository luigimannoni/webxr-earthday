import {
  TOGGLE_INFO,
  TOGGLE_CAMERA,
  TOGGLE_SECTION,
  SET_MESSAGE,
  CLOSE_MESSAGE,
  PLACE_GLOBE,
  RESET_GLOBE,
  SELECT_BIOME,
  CLOSE_BIOME,
  TAKE_PICTURE,
} from '../actionTypes';

const initialState = {
  info: false,
  camera: false,
  hide: true,
  biome: false,
  message: true,
  picture: false,
  hideHotspots: false,
  section: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case TOGGLE_INFO: {
      return {
        ...state,
        info: !state.info,
        hide: !state.info,
      };
    }

    case TOGGLE_CAMERA: {
      return {
        ...state,
        camera: !state.camera,
        hide: !state.camera,
        picture: false,
      };
    }

    case TOGGLE_SECTION: {
      return {
        ...state,
        section: !state.section,
        info: false,
        hide: !state.section,
        hideHotspots: !state.section,
      };
    }


    case SET_MESSAGE: {
      return {
        ...state,
        message: true,
        hide: true,
      };
    }

    case CLOSE_MESSAGE: {
      const { hide = false } = action.payload;
      return {
        ...state,
        message: false,
        hide,
      };
    }

    case PLACE_GLOBE: {
      return {
        ...state,
      };
    }

    case RESET_GLOBE: {
      return {
        ...state,
        message: true,
        hide: true,
      };
    }

    case SELECT_BIOME: {
      if (state.biome === true) {
        return state;
      }

      return {
        ...state,
        biome: true,
        camera: false,
        hide: true,
        hideHotspots: true,
      };
    }

    case CLOSE_BIOME: {
      return {
        ...state,
        biome: false,
        camera: false,
        hide: state.section, // remains hidden if we're in section mode
        hideHotspots: state.section, // remains hidden if we're in section mode
      };
    }

    case TAKE_PICTURE: {
      return {
        ...state,
        picture: true,
      };
    }

    default:
      return state;
  }
}
