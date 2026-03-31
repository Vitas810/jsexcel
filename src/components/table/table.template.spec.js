import { createTable } from './table.template';

describe('table.template', () => {
  /* =============== Безопасный рендер ячеек ================ */
  test('экранирует пользовательское содержимое и сохраняет вычисленное значение 0', () => {
    const html = createTable(1, {
      rowState: {},
      colState: {},
      stylesState: {},
      dataState: {
        '0:0': '<img src=x onerror=alert(1)>',
        '0:1': '=1-1'
      }
    });

    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');
    expect(html).not.toContain('<img src=x onerror=alert(1)>');
    expect(html).toContain('data-id="0:1"');
    expect(html).toContain('>0</div>');
  });
});
