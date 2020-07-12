import {
  TOGGLE_INFO,
  TOGGLE_CAMERA,
  TOGGLE_SECTION,
  SELECT_BIOME,
  CLOSE_BIOME,
  SET_MESSAGE,
  CLOSE_MESSAGE,
  PLACE_GLOBE,
  RESET_GLOBE,
  TAKE_PICTURE,
  UPDATE_SECTION,
  HELP_DISPLAYED,
} from './actionTypes';

export const toggleInfo = () => ({
  type: TOGGLE_INFO,
});

export const toggleCamera = () => ({
  type: TOGGLE_CAMERA,
});

export const toggleSection = () => ({
  type: TOGGLE_SECTION,
});

export const selectBiome = (biome, section) => ({
  type: SELECT_BIOME,
  payload: {
    biome,
    section,
  },
});

export const closeBiome = () => ({
  type: CLOSE_BIOME,
});

export const setMessage = (message) => ({
  type: SET_MESSAGE,
  payload: {
    message,
  },
});

export const closeMessage = (hide) => ({
  type: CLOSE_MESSAGE,
  payload: {
    hide,
  },
});

export const placeGlobe = () => ({
  type: PLACE_GLOBE,
});

export const resetGlobe = () => ({
  type: RESET_GLOBE,
});

export const takePicture = () => ({
  type: TAKE_PICTURE,
});

export const updateSection = (degrees) => ({
  type: UPDATE_SECTION,
  payload: {
    degrees,
  },
});

export const setHelpDisplayed = () => ({
  type: HELP_DISPLAYED,
});
