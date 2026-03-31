import { readStorageByKey, writeStorageByKey } from './storage.service';

// Pure function

export function capitalize(string) {
  if (typeof string !== 'string') {
    return '';
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}
export function range(start, end) {
  if (start > end) {
    [end, start] = [start, end];
  }
  return new Array(end - start + 1).fill('').map((_, index) => start + index);
}

/* =============== Работа с хранилищем ================ */
export function storage(key, data) {
  if (arguments.length < 2) {
    return readStorageByKey(key);
  }
  writeStorageByKey(key, data);
}

export function isEqual(a, b) {
  if (Object.is(a, b)) {
    return true;
  }

  if (a && b && typeof a === 'object' && typeof b === 'object') {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  return false;
}
export function camelToDashCase(str) {
  return str.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
}

/* =============== Безопасный вывод строк ================ */
export function escapeHtml(value = '') {
  const htmlEntitiesMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  return String(value).replace(/[&<>"']/g, (symbol) => htmlEntitiesMap[symbol]);
}

export function toInlineStyles(styles = {}) {
  return Object.keys(styles)
    .map((key) => `${camelToDashCase(key)}: ${styles[key]}`)
    .join(';');
}
export function debounce(fn, wait) {
  let timeout;
  return function (...args) {
    const later = () => {
      clearTimeout(timeout);
      // eslint-disable-next-line no-invalid-this
      fn.apply(this, args);
      // fn(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
export function preventDefault(event) {
  event.preventDefault();
}
