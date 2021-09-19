import {TABLE_RESIZE} from './types';
// action creator
export function tableResize(data) {
  return {
    type: TABLE_RESIZE,
    data
  };
}