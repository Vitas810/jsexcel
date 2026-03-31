import { escapeHtml, isEqual, storage } from './utils';

describe('utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  /* =============== Работа с хранилищем ================ */
  test('сохраняет и читает falsy-значения без смены режима работы', () => {
    storage('excel:false', false);
    storage('excel:zero', 0);
    storage('excel:empty', '');

    expect(storage('excel:false')).toBe(false);
    expect(storage('excel:zero')).toBe(0);
    expect(storage('excel:empty')).toBe('');
  });

  /* =============== Безопасный вывод строк ================ */
  test('экранирует HTML-символы', () => {
    expect(escapeHtml('<script>"test"&\'x\'</script>')).toBe(
      '&lt;script&gt;&quot;test&quot;&amp;&#39;x&#39;&lt;/script&gt;'
    );
  });

  /* =============== Сравнение значений ================ */
  test('сравнивает примитивы и объекты без изменения контракта', () => {
    expect(isEqual(1, 1)).toBe(true);
    expect(isEqual(1, 2)).toBe(false);
    expect(isEqual({ a: 1 }, { a: 1 })).toBe(true);
    expect(isEqual({ a: 1 }, { a: 2 })).toBe(false);
  });
});
