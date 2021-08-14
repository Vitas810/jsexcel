 export class Emmitter {
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
// emmiter.subscribe('vitas', data => console.log('sub', data));
//
// emmiter.emit('vitas', 42);