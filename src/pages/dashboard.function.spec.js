import { createRecordsTable } from './dashboard.function';

function saveTableRecord(key, model) {
  localStorage.setItem(key, JSON.stringify(model));
}

describe('dashboard.function', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('возвращает заглушку, если таблиц нет', () => {
    expect(createRecordsTable()).toContain('Вы пока не создали ни одной таблицы');
  });

  test('рендерит только записи с ключом excel: и игнорирует прочие', () => {
    saveTableRecord('excel:1', {
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
});
