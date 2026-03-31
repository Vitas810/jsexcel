import { ExcelComponent } from '@core/ExcelComponent';
import { $ } from '../../core/Dom';
import { createTable } from './table.template';
import { resizeHandler } from './table.resize';
import { isCell, matrix, nextSelector, shouldResize } from './table.functions';
import { TableSelection } from './TableSelection';
import * as actions from '@/redux/actions';
import { defaultStyles } from '../../constants';
import { parse } from '../../core/parse';

const NAVIGATION_KEYS = ['Enter', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

export class Table extends ExcelComponent {
  static className = 'excel__table';
  constructor($root, options) {
    super($root, {
      name: 'Table',
      listeners: ['mousedown', 'keydown', 'input'],
      ...options
    });
  }
  toHTML() {
    return createTable(20, this.store.getState());
  }
  prepare() {
    this.selection = new TableSelection();
  }
  init() {
    super.init();
    const $cell = this.$root.find('[data-id="0:0"]');
    this.selectCell($cell);

    this.$on('formula:input', (value) => {
      this.selection.current.attr('data-value', value).text(parse(value));
      this.updateTextInStore(value);
    });
    this.$on('formula:done', () => {
      this.selection.current.focus();
    });
    this.$on('toolbar:applyStyle', (value) => {
      this.selection.applyStyle(value);
      this.$dispatch(
        actions.applyStyle({
          value,
          ids: this.selection.selectedIds
        })
      );
    });
  }
  selectCell($cell) {
    this.selection.select($cell);
    this.$emit('table:select', $cell);
    const styles = $cell.getStyles(Object.keys(defaultStyles));
    this.$dispatch(actions.changeStyles(styles));
  }
  async resizeTable(event) {
    try {
      const data = await resizeHandler(this.$root, event);
      this.$dispatch(actions.tableResize(data));
    } catch (e) {
      console.warn('Resize_error', e.message);
    }
  }
  onMousedown(event) {
    if (shouldResize(event)) {
      this.handleResizeAction(event);
      return;
    }

    if (isCell(event)) {
      this.handleCellSelectionAction(event);
    }
  }

  // Запускаем изменение размера строки или колонки
  handleResizeAction(event) {
    this.resizeTable(event);
  }

  // Выбираем одну ячейку или диапазон с Shift
  handleCellSelectionAction(event) {
    const $target = $(event.target);

    if (event.shiftKey) {
      this.selectGroupByShift($target);
      return;
    }

    this.selectCell($target);
  }

  // Строим диапазон выделения между текущей и целевой ячейкой
  selectGroupByShift($target) {
    const $cells = matrix($target, this.selection.current).map((id) =>
      this.$root.find(`[data-id="${id}"]`)
    );
    this.selection.selectGroup($cells);
  }

  onKeydown(event) {
    const { key } = event;

    if (!this.isNavigationKey(key, event.shiftKey)) {
      return;
    }

    event.preventDefault();
    this.selectNextCell(key);
  }

  // Проверяем, относится ли клавиша к навигации таблицы
  isNavigationKey(key, isShiftPressed) {
    return NAVIGATION_KEYS.includes(key) && !isShiftPressed;
  }

  // Переходим к следующей ячейке по клавише навигации
  selectNextCell(key) {
    const id = this.selection.current.id(true);
    const $next = this.$root.find(nextSelector(key, id));
    this.selectCell($next);
  }

  updateTextInStore(value) {
    this.$dispatch(
      actions.changeText({
        id: this.selection.current.id(),
        value
      })
    );
  }
  onInput(event) {
    this.updateTextInStore($(event.target).text());
  }
}
