import { isEqual } from './utils';

export class StoreSubscriber {
  constructor(store) {
    this.store = store;
    this.sub = null;
    this.prevState = {};
  }

  // Собираем список полей store, за которыми реально наблюдают компоненты
  getWatchedKeys(components) {
    return components.reduce((keys, component) => {
      if (!Array.isArray(component.subscribe)) {
        return keys;
      }

      component.subscribe.forEach((key) => keys.add(key));
      return keys;
    }, new Set());
  }

  // Отправляем изменение только тем компонентам, которые подписаны на ключ
  notifyWatchingComponents(components, key, state) {
    components.forEach((component) => {
      if (component.isWatching(key)) {
        component.storeChanged({ [key]: state[key] });
      }
    });
  }

  subscribeComponents(components) {
    this.prevState = this.store.getState();
    const watchedKeys = this.getWatchedKeys(components);

    this.sub = this.store.subscribe((state) => {
      watchedKeys.forEach((key) => {
        if (!isEqual(this.prevState[key], state[key])) {
          this.notifyWatchingComponents(components, key, state);
        }
      });
      this.prevState = state;
    });
  }
  unsubscribeFromStore() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
