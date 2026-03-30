import { rootReducer } from './rootReducer';
import {
  APPLY_STYLE,
  CHANGE_STYLES,
  CHANGE_TEXT,
  CHANGE_TITLE,
  TABLE_RESIZE,
  UPDATE_DATE
} from './types';

describe('rootReducer', () => {
  /* =============== Базовое поведение ================ */
  test('возвращает исходный state для неизвестного action', () => {
    const state = { marker: true };

    const nextState = rootReducer(state, { type: 'UNKNOWN_ACTION' });

    expect(nextState).toBe(state);
  });

  /* =============== Изменение текста ================ */
  test('иммутабельно обновляет dataState и currentText для CHANGE_TEXT', () => {
    const initialState = {
      dataState: { '0:0': '1' },
      currentText: '',
      currentStyles: {}
    };
    const action = {
      type: CHANGE_TEXT,
      data: {
        id: '0:1',
        value: '2'
      }
    };

    const nextState = rootReducer(initialState, action);

    expect(nextState).not.toBe(initialState);
    expect(nextState.dataState).toEqual({ '0:0': '1', '0:1': '2' });
    expect(nextState.dataState).not.toBe(initialState.dataState);
    expect(initialState.dataState).toEqual({ '0:0': '1' });
    expect(nextState.currentText).toBe('2');
  });

  /* =============== Изменение стилей выделения ================ */
  test('обновляет currentStyles для CHANGE_STYLES', () => {
    const initialState = {
      currentStyles: { textAlign: 'left' }
    };
    const nextStyles = { textAlign: 'center', fontWeight: 'bold' };

    const nextState = rootReducer(initialState, {
      type: CHANGE_STYLES,
      data: nextStyles
    });

    expect(nextState.currentStyles).toEqual(nextStyles);
    expect(nextState).not.toBe(initialState);
  });

  /* =============== Применение стилей к диапазону ================ */
  test('иммутабельно применяет APPLY_STYLE к нескольким ячейкам', () => {
    const initialState = {
      stylesState: {
        '0:0': { fontWeight: 'normal' }
      },
      currentStyles: {
        textAlign: 'left'
      }
    };
    const action = {
      type: APPLY_STYLE,
      data: {
        ids: ['0:0', '0:1'],
        value: { fontWeight: 'bold' }
      }
    };

    const nextState = rootReducer(initialState, action);

    expect(nextState.stylesState).toEqual({
      '0:0': { fontWeight: 'bold' },
      '0:1': { fontWeight: 'bold' }
    });
    expect(nextState.stylesState).not.toBe(initialState.stylesState);
    expect(nextState.stylesState['0:0']).not.toBe(initialState.stylesState['0:0']);
    expect(initialState.stylesState).toEqual({
      '0:0': { fontWeight: 'normal' }
    });
    expect(nextState.currentStyles).toEqual({
      textAlign: 'left',
      fontWeight: 'bold'
    });
  });

  test('создает stylesState с нуля для APPLY_STYLE при пустом state', () => {
    const initialState = {
      stylesState: undefined,
      currentStyles: {}
    };

    const nextState = rootReducer(initialState, {
      type: APPLY_STYLE,
      data: {
        ids: ['2:3'],
        value: { textAlign: 'right' }
      }
    });

    expect(nextState.stylesState).toEqual({
      '2:3': { textAlign: 'right' }
    });
    expect(nextState.currentStyles).toEqual({ textAlign: 'right' });
  });

  /* =============== Ресайз таблицы ================ */
  test('обновляет colState для TABLE_RESIZE с типом col', () => {
    const initialState = {
      colState: { 1: 110 },
      rowState: {}
    };

    const nextState = rootReducer(initialState, {
      type: TABLE_RESIZE,
      data: { id: '2', value: 140, type: 'col' }
    });

    expect(nextState.colState).toEqual({ 1: 110, 2: 140 });
    expect(nextState.colState).not.toBe(initialState.colState);
    expect(nextState.rowState).toBe(initialState.rowState);
  });

  test('обновляет rowState для TABLE_RESIZE с типом row', () => {
    const initialState = {
      colState: {},
      rowState: { 0: 24 }
    };

    const nextState = rootReducer(initialState, {
      type: TABLE_RESIZE,
      data: { id: '3', value: 30, type: 'row' }
    });

    expect(nextState.rowState).toEqual({ 0: 24, 3: 30 });
    expect(nextState.rowState).not.toBe(initialState.rowState);
    expect(nextState.colState).toBe(initialState.colState);
  });

  /* =============== Заголовок и дата ================ */
  test('обновляет title для CHANGE_TITLE', () => {
    const initialState = {
      title: 'Старая таблица'
    };

    const nextState = rootReducer(initialState, {
      type: CHANGE_TITLE,
      data: 'Новая таблица'
    });

    expect(nextState.title).toBe('Новая таблица');
  });

  test('обновляет openedDate для UPDATE_DATE', () => {
    const toJsonSpy = jest.spyOn(Date.prototype, 'toJSON').mockReturnValue('2026-03-30T10:00:00.000Z');
    const initialState = {
      openedDate: '2021-01-01T00:00:00.000Z'
    };

    const nextState = rootReducer(initialState, {
      type: UPDATE_DATE
    });

    expect(nextState.openedDate).toBe('2026-03-30T10:00:00.000Z');
    toJsonSpy.mockRestore();
  });
});
