import {
  getExcelStorageKey,
  isExcelStorageKey,
  listExcelStorageKeys,
  listExcelTables,
  readExcelTable,
  readStorageByKey,
  removeExcelTable,
  writeExcelTable,
  writeStorageByKey
} from './storage.service';

describe('storage.service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

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

  test('читает и пишет значения по ключу', () => {
    writeStorageByKey('excel:1', { title: 'A' });
    expect(readStorageByKey('excel:1')).toEqual({ title: 'A' });
  });

  test('возвращает null для битого JSON', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    localStorage.setItem('excel:1', '{invalid-json');

    expect(readStorageByKey('excel:1')).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith('Storage parse error', expect.any(String));

    warnSpy.mockRestore();
  });

  test('работает с таблицей по id и корректно удаляет запись', () => {
    writeExcelTable('42', { title: 'Table 42' });

    expect(readExcelTable('42')).toEqual({ title: 'Table 42' });

    removeExcelTable('42');
    expect(readExcelTable('42')).toBeNull();
  });

  test('возвращает только excel-ключи и только валидные таблицы', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    writeExcelTable('1', { title: 'A', openedDate: '2026-03-31T10:00:00.000Z' });
    localStorage.setItem('custom:1', JSON.stringify({ title: 'B' }));
    localStorage.setItem('excel:2', '{invalid-json');

    expect(listExcelStorageKeys()).toEqual(expect.arrayContaining(['excel:1', 'excel:2']));

    const tables = listExcelTables();
    expect(tables).toHaveLength(1);
    expect(tables[0]).toEqual({
      id: '1',
      key: 'excel:1',
      model: { title: 'A', openedDate: '2026-03-31T10:00:00.000Z' }
    });

    warnSpy.mockRestore();
  });
});
