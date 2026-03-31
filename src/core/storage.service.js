const EXCEL_STORAGE_PREFIX = 'excel:';

// Формирует ключ таблицы в localStorage
export function getExcelStorageKey(id) {
  return `${EXCEL_STORAGE_PREFIX}${id}`;
}

// Проверяет, что ключ относится к таблице Excel
export function isExcelStorageKey(key) {
  return key.startsWith(EXCEL_STORAGE_PREFIX);
}

/* =============== Базовые операции localStorage ================ */
export function readStorageByKey(key) {
  const rawValue = localStorage.getItem(key);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    console.warn('Storage parse error', error.message);
    return null;
  }
}

export function writeStorageByKey(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function removeStorageByKey(key) {
  localStorage.removeItem(key);
}

/* =============== Операции хранения таблиц ================ */
export function readExcelTable(id) {
  return readStorageByKey(getExcelStorageKey(id));
}

export function writeExcelTable(id, state) {
  writeStorageByKey(getExcelStorageKey(id), state);
}

export function removeExcelTable(id) {
  removeStorageByKey(getExcelStorageKey(id));
}

export function listExcelStorageKeys() {
  const keys = [];

  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index);

    if (!key || !isExcelStorageKey(key)) {
      continue;
    }

    keys.push(key);
  }

  return keys;
}

export function listExcelTables() {
  return listExcelStorageKeys()
    .map((key) => {
      const id = key.split(':')[1];
      const model = readStorageByKey(key);

      return {
        id,
        key,
        model
      };
    })
    .filter(({ model }) => Boolean(model));
}
