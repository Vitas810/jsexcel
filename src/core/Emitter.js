 export class Emitter {
  constructor(props) {
    this.listeners = {};
  }
  // dispatch, fire, trigger
  // уведомляем слушателя если они есть
  emit(event, ...args) {
    if (!Array.isArray(this.listeners[event])) {
      return false;
    }
    this.listeners[event].forEach(listener => {
      listener(...args);
    });
    return true;
  }

  // on, listen
  // подписываемся на уведомления
  // добавляем нового слушателя
  subscribe(event, fn) {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event].push(fn);
    return () => {
      this.listeners[event] = this.listeners[event]
        .filter(listener => listener !== fn);
    };
  }
}
// const emmiter = new Emmitter();
// const unsub = emmiter.subscribe('vitas', data => console.log('sub', data));
//
// emmiter.emit('vitas', 42);
//
// setTimeout(() => {
//   emmiter.emit('vitas', '2 sec');
// }, 2000);
//
// setTimeout(() => {
//     unsub();
// }, 3000);
//
//   setTimeout(() => {
//     emmiter.emit('vitas', '4 sec');
//   }, 4000);