import { escapeHtml } from '../core/utils';
import { listExcelTables } from '../core/storage.service';

/* =============== Подготовка данных таблиц ================ */
function isValidRecord(model) {
  return Boolean(model && typeof model.title === 'string' && model.openedDate);
}

function formatOpenedDate(openedDate) {
  const date = new Date(openedDate);

  if (Number.isNaN(date.getTime())) {
    return 'Некорректная дата';
  }

  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

function toHtml({ id, model }) {
  if (!isValidRecord(model)) {
    return '';
  }

  return `
    <li class="db__record">
      <a href="#excel/${escapeHtml(id)}">${escapeHtml(model.title)}</a>
      <strong>
        ${formatOpenedDate(model.openedDate)}
      </strong>
    </li>
  `;
}

export function createRecordsTable() {
  const records = listExcelTables().map(toHtml).filter(Boolean);

  if (!records.length) {
    return `<p>Вы пока не создали ни одной таблицы</p>`;
  }

  return `
    <div class="db__list-header">
        <span>Название</span>
        <span>Дата открытия</span>
    </div>
    <ul class="db__list">
      ${records.join('')}
    </ul>
 
  `;
}
