const EXCEL_STORAGE_PREFIX = 'excel:';

// Формирует ключ таблицы в localStorage
export function getExcelStorageKey(id) {
  return `${EXCEL_STORAGE_PREFIX}${id}`;
}

// Проверяет, что ключ относится к таблице Excel
export function isExcelStorageKey(key) {
  return key.startsWith(EXCEL_STORAGE_PREFIX);
}
