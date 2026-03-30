import { Page } from '../core/Page';
import { createStore } from '../core/store/createStore';
import { rootReducer } from '../redux/rootReducer';
import { debounce, storage } from '../core/utils';
import { normalizeInitialState } from '../redux/initialState';
import { Excel } from '../components/excel/Excel';
import { Header } from '../components/header/Header';
import { Toolbar } from '../components/toolbar/Toolbar';
import { Formula } from '../components/formula/Formula';
import { Table } from '../components/table/Table';
import { getExcelStorageKey } from '../core/storage.service';

export class ExcelPage extends Page {
  getRoot() {
    const params = this.params ? this.params : Date.now().toString();

    const storageKey = getExcelStorageKey(params);
    const state = storage(storageKey);
    const store = createStore(rootReducer, normalizeInitialState(state));
    const stateListener = debounce((state) => {
      storage(storageKey, state);
    }, 300);

    this.storeSubscription = store.subscribe(stateListener);
    this.excel = new Excel({
      components: [Header, Toolbar, Formula, Table],
      store
    });

    return this.excel.getRoot();
  }

  afterRender() {
    this.excel.init();
  }

  destroy() {
    if (this.storeSubscription) {
      this.storeSubscription.unsubscribe();
    }
    this.excel.destroy();
  }
}
