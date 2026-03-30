import { Page } from '../Page';
import { Router } from './Router';

class DashboardPage extends Page {
  static destroyCounter = 0;

  getRoot() {
    const root = document.createElement('div');
    root.innerHTML = 'dashboard';
    return root;
  }

  destroy() {
    DashboardPage.destroyCounter += 1;
  }
}
class ExcelPage extends Page {
  static destroyCounter = 0;

  getRoot() {
    const root = document.createElement('div');
    root.innerHTML = 'excel';
    return root;
  }

  destroy() {
    ExcelPage.destroyCounter += 1;
  }
}

describe('Router:', () => {
  let router;
  let $root;

  beforeEach(() => {
    window.location.hash = '';
    DashboardPage.destroyCounter = 0;
    ExcelPage.destroyCounter = 0;
    $root = document.createElement('div');
    router = new Router($root, {
      dashboard: DashboardPage,
      excel: ExcelPage
    });
  });

  afterEach(() => {
    router.destroy();
  });

  test('создается без ошибок при переданном root-элементе', () => {
    expect(router).toBeDefined();
  });

  test('рендерит dashboard по умолчанию', () => {
    expect($root.innerHTML).toBe('<div>dashboard</div>');
  });

  test('рендерит excel-страницу для hash с префиксом excel', () => {
    router.destroy();
    window.location.hash = '#excel/42';
    router = new Router($root, {
      dashboard: DashboardPage,
      excel: ExcelPage
    });

    expect($root.innerHTML).toBe('<div>excel</div>');
  });

  test('вызывает destroy предыдущей страницы при смене маршрута', () => {
    window.location.hash = '#excel/55';
    router.changePageHandler();

    expect(DashboardPage.destroyCounter).toBe(1);
    expect($root.innerHTML).toBe('<div>excel</div>');
  });

  test('снимает обработчик hashchange в destroy', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    router.destroy();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('hashchange', router.changePageHandler);
    removeEventListenerSpy.mockRestore();
  });

  test('бросает ошибку если selector не передан', () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new Router(undefined, {
        dashboard: DashboardPage,
        excel: ExcelPage
      });
    }).toThrow('Selector is not provided in Router');
  });
});
