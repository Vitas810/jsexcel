import {APPLY_STYLE, CHANGE_STYLES, CHANGE_TEXT, TABLE_RESIZE} from './types';
import {toInlineStyles} from '../core/utils';

export function rootReducer(state, action) {
  let field;
  let val;
  switch (action.type) {
    case TABLE_RESIZE:
      field = action.data.type === 'col' ? 'colState' : 'rowState';
      return {...state, [field]: value(state, field, action)};
    case CHANGE_TEXT:
      return {
        ...state,
        currentText: action.data.value,
        dataState: value(state, field, action)
      };
    case CHANGE_STYLES:
      return {...state, currrentStyles: action.data};
    case APPLY_STYLE:
      field = 'stylesState';
      val = state[field] || {};
      action.data.ids.forEach(id => {
        val[id] = toInlineStyles(action.data.value);
      });
      return {
        ...state,
        [field]: val,
        currentStyles: {...state.currentStyles, ...action.data.value}
      };
    default: return state;
  }
}

function value(state, field, action) {
  const val = state[field] || {};
  val[action.data.id] = action.data.value;
  return val;
}