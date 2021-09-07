import {DomListener} from '@core/DomListener';

export class ExcelComponent extends DomListener {
  constructor($root, options = {}) {
    super($root, options.listeners);
    this.name = options.name || '';
    this.store = options.store;
    this.emitter = options.emitter;
    this.unsubscribers = [];
    this.storeSub = null;
    this.prepare();
  }
  // Настратваем компонент до init
  prepare() {}
  // возвращает шаблон скомпонента
  toHTML() {
    return '';
  }
  // уведомляем слушателей про событие event
  $emit(event, ...args) {
    this.emitter.emit(event, ...args);
  }
  // подписываемся на событие event
  $on(event, fn) {
    const unsub = this.emitter.subscribe(event, fn);
    this.unsubscribers.push(unsub);
  }
  $dispatch(action) {
    this.store.dispatch(action);
  }
  $subscribe(fn) {
    this.storeSub = this.store.subscribe(fn);
  }
  // инициализируем компонент
  // добавляем dom слушателей
  init() {
    this.initDOMListeners();
  }
  // удаляем компонент
  // чистим слушателей
  destroy() {
    this.removeDOMListeners();
    this.unsubscribers.forEach(unsub => unsub());
    this.storeSub.unsubscribe();
  }
}
