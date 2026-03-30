import { createStore } from './createStore';

const initialState = {
  count: 0
};

const reducer = (state = initialState, action) => {
  if (action.type === 'ADD') {
    return { ...state, count: state.count + 1 };
  }
  return state;
};

describe('createStore:', () => {
  let store;
  let handler;

  beforeEach(() => {
    store = createStore(reducer, initialState);
    handler = jest.fn();
  });

  test('возвращает объект store с публичным API', () => {
    expect(store).toBeDefined();
    expect(store.dispatch).toBeDefined();
    expect(store.subscribe).toBeDefined();
    expect(store.getState).not.toBeUndefined();
  });

  test('возвращает объект состояния', () => {
    expect(store.getState()).toBeInstanceOf(Object);
  });

  test('возвращает начальное состояние по умолчанию', () => {
    expect(store.getState()).toEqual(initialState);
  });

  test('изменяет состояние при известном action', () => {
    store.dispatch({ type: 'ADD' });
    expect(store.getState().count).toBe(1);
  });

  test('не изменяет состояние при неизвестном action', () => {
    store.dispatch({ type: 'NOT_EXISTING_ACTION' });
    expect(store.getState().count).toBe(0);
  });

  test('вызывает подписчика после dispatch', () => {
    store.subscribe(handler);
    store.dispatch({ type: 'ADD' });

    expect(handler).toHaveBeenCalled();
    expect(handler).toHaveBeenCalledWith(store.getState());
  });

  test('не вызывает подписчика после unsubscribe', () => {
    const sub = store.subscribe(handler);

    sub.unsubscribe();
    store.dispatch({ type: 'ADD' });

    expect(handler).not.toHaveBeenCalled();
  });

  test('возвращает глубокую копию через getState и защищает внутренний state от мутаций извне', () => {
    const snapshot = store.getState();

    snapshot.count = 999;

    expect(store.getState().count).toBe(0);
    expect(store.getState()).not.toBe(snapshot);
  });

  test('диспатчит в асинхронном сценарии', () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        store.dispatch({ type: 'ADD' });
      }, 500);

      setTimeout(() => {
        expect(store.getState().count).toBe(1);
        resolve();
      }, 1000);
    });
  });
});
