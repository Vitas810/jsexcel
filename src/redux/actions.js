import {CHANGE_TEXT, TABLE_RESIZE} from './types';
// action creator
export function tableResize(data) {
  return {
    type: TABLE_RESIZE,
    data
  };
}
export function changeText(data) {
  return {
    type: CHANGE_TEXT,
    data
  };
}