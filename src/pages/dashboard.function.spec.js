import { createRecordsTable } from './dashboard.function';
import { writeExcelTable, writeStorageByKey } from '../core/storage.service';

function saveTableRecord(key, model) {
  writeStorageByKey(key, model);
}

describe('dashboard.function', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('возвращает заглушку, если таблиц нет', () => {
    expect(createRecordsTable()).toContain('Вы пока не создали ни одной таблицы');
  });

  test('рендерит только записи с ключом excel: и игнорирует прочие', () => {
    writeExcelTable('1', {
      title: 'Таблица 1',
      openedDate: '2026-03-30T10:00:00.000Z'
    });
    saveTableRecord('custom:1', {
      title: 'Чужая запись',
      openedDate: '2026-03-30T11:00:00.000Z'
    });

    const html = createRecordsTable();

    expect(html).toContain('Таблица 1');
    expect(html).toContain('#excel/1');
    expect(html).not.toContain('Чужая запись');
    expect(html).toContain('db__list-header');
  });

  test('экранирует title и пропускает битые записи', () => {
    writeExcelTable('1', {
      title: '<img src=x onerror=alert(1)>',
      openedDate: '2026-03-30T10:00:00.000Z'
    });
    localStorage.setItem('excel:2', '{"openedDate":"2026-03-30T10:00:00.000Z"}');

    const html = createRecordsTable();

    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');
    expect(html).not.toContain('<img src=x onerror=alert(1)>');
    expect(html).not.toContain('#excel/2');
  });
});
