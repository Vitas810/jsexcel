import { $ } from '../../core/Dom';
import { resizeHandler } from './table.resize';

function createResizeDom() {
  const rootElement = document.createElement('div');
  rootElement.innerHTML = `
    <div data-type="resizable" data-col="0">
      <div data-resize="col"></div>
    </div>
    <div data-col="0"></div>
  `;

  const parent = rootElement.querySelector('[data-type="resizable"]');
  const resizer = rootElement.querySelector('[data-resize="col"]');
  parent.getBoundingClientRect = jest.fn(() => ({
    width: 120,
    right: 120,
    height: 24,
    bottom: 24
  }));

  return {
    root: $(rootElement),
    parent,
    resizer,
    sameColumnCell: rootElement.querySelectorAll('[data-col="0"]')[1]
  };
}

describe('table.resize', () => {
  afterEach(() => {
    document.onmousemove = null;
    document.onmouseup = null;
  });

  /* =============== Изменение ширины колонки ================ */
  test('возвращает корректные данные и обновляет ширину колонки', async () => {
    const { root, parent, resizer, sameColumnCell } = createResizeDom();

    const resizePromise = resizeHandler(root, { target: resizer });
    document.onmousemove({ pageX: 150 });
    document.onmouseup({});

    const result = await resizePromise;

    expect(result).toEqual({
      value: 150,
      type: 'col',
      id: '0'
    });
    expect(parent.style.width).toBe('150px');
    expect(sameColumnCell.style.width).toBe('150px');
    expect(document.onmousemove).toBeNull();
    expect(document.onmouseup).toBeNull();
  });
});
