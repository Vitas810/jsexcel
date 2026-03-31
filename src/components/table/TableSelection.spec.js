import { TableSelection } from './TableSelection';

function createCellMock(id) {
  const cell = {
    focus: jest.fn(() => cell),
    addClass: jest.fn(() => cell),
    removeClass: jest.fn(() => cell),
    css: jest.fn(() => cell),
    id: jest.fn(() => id)
  };

  return cell;
}

describe('TableSelection', () => {
  /* =============== Одиночное выделение ================ */
  test('выделяет одну ячейку и обновляет current', () => {
    const selection = new TableSelection();
    const first = createCellMock('0:0');
    const second = createCellMock('0:1');

    selection.select(first);
    selection.select(second);

    expect(first.removeClass).toHaveBeenCalledWith(TableSelection.className);
    expect(second.focus).toHaveBeenCalled();
    expect(selection.current).toBe(second);
    expect(selection.selectedIds).toEqual(['0:1']);
  });

  /* =============== Групповое выделение и стили ================ */
  test('выделяет группу и применяет стиль ко всем', () => {
    const selection = new TableSelection();
    const group = [createCellMock('1:0'), createCellMock('1:1')];

    selection.selectGroup(group);
    selection.applyStyle({ fontWeight: 'bold' });

    expect(group[0].addClass).toHaveBeenCalledWith(TableSelection.className);
    expect(group[1].addClass).toHaveBeenCalledWith(TableSelection.className);
    expect(group[0].css).toHaveBeenCalledWith({ fontWeight: 'bold' });
    expect(group[1].css).toHaveBeenCalledWith({ fontWeight: 'bold' });
    expect(selection.selectedIds).toEqual(['1:0', '1:1']);
  });
});
