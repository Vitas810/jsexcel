import { getExcelStorageKey, isExcelStorageKey } from './storage.service';

describe('storage.service', () => {
  test('формирует корректный ключ таблицы', () => {
    expect(getExcelStorageKey('123')).toBe('excel:123');
  });

  test('распознает только ключи с префиксом excel:', () => {
    expect(isExcelStorageKey('excel:1')).toBe(true);
    expect(isExcelStorageKey('excel:')).toBe(true);
    expect(isExcelStorageKey('excel')).toBe(false);
    expect(isExcelStorageKey('excelx:1')).toBe(false);
    expect(isExcelStorageKey('my-excel:1')).toBe(false);
  });
});
