import { $ } from './Dom';
import { StoreSubscriber } from './StoreSubscriber';
import { createStore } from './store/createStore';
import { rootReducer } from '../redux/rootReducer';
import { changeStyles, changeText, changeTitle } from '../redux/actions';
import { defaultStyles } from '../constants';
import { Formula } from '../components/formula/Formula';
import { Toolbar } from '../components/toolbar/Toolbar';

function createComponent(Component, store) {
  const $root = $.create('div');
  const component = new Component($root, {
    emitter: {
      emit: jest.fn(),
      subscribe: jest.fn(() => () => {})
    },
    store
  });

  $root.html(component.toHTML());
  component.init();

  return component;
}

function createInitialState() {
  return {
    title: 'Новая таблица',
    rowState: {},
    colState: {},
    dataState: {},
    stylesState: {},
    currentText: '',
    currentStyles: defaultStyles,
    openedDate: '2026-03-31T00:00:00.000Z'
  };
}

describe('StoreSubscriber', () => {
  /* =============== Контракт подписок компонентов ================ */
  test('уведомляет только Formula при изменении currentText', () => {
    const store = createStore(rootReducer, createInitialState());
    const formula = createComponent(Formula, store);
    const toolbar = createComponent(Toolbar, store);
    const formulaSpy = jest.spyOn(formula, 'storeChanged');
    const toolbarSpy = jest.spyOn(toolbar, 'storeChanged');
    const subscriber = new StoreSubscriber(store);

    subscriber.subscribeComponents([formula, toolbar]);
    store.dispatch(changeText({ id: '0:0', value: '=1+1' }));

    expect(formulaSpy).toHaveBeenCalledWith({ currentText: '=1+1' });
    expect(toolbarSpy).not.toHaveBeenCalled();
  });

  test('уведомляет только Toolbar при изменении currentStyles', () => {
    const store = createStore(rootReducer, createInitialState());
    const formula = createComponent(Formula, store);
    const toolbar = createComponent(Toolbar, store);
    const formulaSpy = jest.spyOn(formula, 'storeChanged');
    const toolbarSpy = jest.spyOn(toolbar, 'storeChanged');
    const subscriber = new StoreSubscriber(store);

    subscriber.subscribeComponents([formula, toolbar]);
    store.dispatch(changeStyles({ fontWeight: 'bold' }));

    expect(toolbarSpy).toHaveBeenCalledWith({ currentStyles: { fontWeight: 'bold' } });
    expect(formulaSpy).not.toHaveBeenCalled();
  });

  test('не уведомляет Formula и Toolbar при изменении несвязанного поля', () => {
    const store = createStore(rootReducer, createInitialState());
    const formula = createComponent(Formula, store);
    const toolbar = createComponent(Toolbar, store);
    const formulaSpy = jest.spyOn(formula, 'storeChanged');
    const toolbarSpy = jest.spyOn(toolbar, 'storeChanged');
    const subscriber = new StoreSubscriber(store);

    subscriber.subscribeComponents([formula, toolbar]);
    store.dispatch(changeTitle('Новое название'));

    expect(formulaSpy).not.toHaveBeenCalled();
    expect(toolbarSpy).not.toHaveBeenCalled();
  });
});
