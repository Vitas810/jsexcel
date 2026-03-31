import { isCell, matrix, nextSelector, shouldResize } from './table.functions';

function createCellStub(row, col) {
  return {
    id: (parse) => {
      if (!parse) {
        return `${row}:${col}`;
      }

      return { row, col };
    }
  };
}

describe('table.functions', () => {
  /* =============== Предикаты событий ================ */
  test('определяет resize и cell target', () => {
    expect(shouldResize({ target: { dataset: { resize: 'col' } } })).toBe('col');
    expect(isCell({ target: { dataset: { type: 'cell' } } })).toBe(true);
    expect(isCell({ target: { dataset: { type: 'row' } } })).toBe(false);
  });

  /* =============== Матрица диапазона ================ */
  test('формирует диапазон id между текущей и целевой ячейкой', () => {
    const ids = matrix(createCellStub(1, 1), createCellStub(0, 0));
    expect(ids).toEqual(['0:0', '1:0', '0:1', '1:1']);
  });

  /* =============== Навигация по таблице ================ */
  test('возвращает следующий селектор для всех направлений', () => {
    expect(nextSelector('Enter', { row: 1, col: 1 })).toBe('[data-id="2:1"]');
    expect(nextSelector('Tab', { row: 1, col: 1 })).toBe('[data-id="1:2"]');
    expect(nextSelector('ArrowRight', { row: 1, col: 1 })).toBe('[data-id="1:2"]');
    expect(nextSelector('ArrowLeft', { row: 1, col: 0 })).toBe('[data-id="1:0"]');
    expect(nextSelector('ArrowUp', { row: 0, col: 1 })).toBe('[data-id="0:1"]');
  });
});
