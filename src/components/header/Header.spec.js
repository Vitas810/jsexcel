import { $ } from '../../core/Dom';
import { Header } from './Header';
import { removeExcelTable } from '../../core/storage.service';

jest.mock('../../core/storage.service', () => ({
  removeExcelTable: jest.fn()
}));

function createHeaderComponent(title = 'Новая таблица') {
  const dispatch = jest.fn();
  const component = new Header($.create('div'), {
    emitter: {
      emit: jest.fn(),
      subscribe: jest.fn(() => () => {})
    },
    store: {
      dispatch,
      getState: () => ({ title })
    }
  });

  return { component, dispatch };
}

describe('Header', () => {
  beforeEach(() => {
    window.location.hash = '#excel/77';
    removeExcelTable.mockClear();
  });

  /* =============== Рендер заголовка ================ */
  test('экранирует title в input value', () => {
    const { component } = createHeaderComponent('<img src=x onerror=alert(1)>');
    const html = component.toHTML();

    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');
    expect(html).not.toContain('<img src=x onerror=alert(1)>');
  });

  /* =============== Удаление таблицы ================ */
  test('удаляет таблицу и переходит на дашборд после подтверждения', () => {
    global.confirm = jest.fn(() => true);
    const { component } = createHeaderComponent();
    const target = document.createElement('div');
    target.dataset.button = 'remove';

    component.onClick({ target });

    expect(removeExcelTable).toHaveBeenCalledWith('77');
    expect(window.location.hash).toBe('');
  });

  test('не удаляет таблицу при отмене подтверждения', () => {
    global.confirm = jest.fn(() => false);
    const { component } = createHeaderComponent();
    const target = document.createElement('div');
    target.dataset.button = 'remove';

    component.onClick({ target });

    expect(removeExcelTable).not.toHaveBeenCalled();
    expect(window.location.hash).toBe('#excel/77');
  });

  /* =============== Выход без удаления ================ */
  test('переходит на дашборд при нажатии exit', () => {
    const { component } = createHeaderComponent();
    const target = document.createElement('div');
    target.dataset.button = 'exit';

    component.onClick({ target });

    expect(removeExcelTable).not.toHaveBeenCalled();
    expect(window.location.hash).toBe('');
  });
});
