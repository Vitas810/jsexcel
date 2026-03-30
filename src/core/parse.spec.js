import { parse } from './parse';

describe('parse', () => {
  test('возвращает исходный текст для неформульного значения', () => {
    expect(parse('text value')).toBe('text value');
  });

  test('считает выражение с учетом приоритета операторов', () => {
    expect(parse('=1+2*3')).toBe(7);
  });

  test('считает выражение со скобками', () => {
    expect(parse('=(2+3)*4')).toBe(20);
  });

  test('поддерживает унарный минус в формуле', () => {
    expect(parse('=-2+3')).toBe(1);
    expect(parse('=2*-3')).toBe(-6);
  });

  test('игнорирует пробелы в формуле', () => {
    expect(parse('= 2 +   3 * 4 ')).toBe(14);
  });

  test('возвращает Infinity при делении на ноль', () => {
    expect(parse('=10/0')).toBe(Infinity);
  });

  test('возвращает исходную формулу для невалидного выражения', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const expression = '=2+*3';

    expect(parse(expression)).toBe(expression);
    expect(warnSpy).toHaveBeenCalled();

    warnSpy.mockRestore();
  });

  test('возвращает исходную формулу для пустого выражения после знака равно', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const expression = '=';

    expect(parse(expression)).toBe(expression);
    expect(warnSpy).toHaveBeenCalledWith('Skipping parse error', 'Empty expression');

    warnSpy.mockRestore();
  });

  test('возвращает исходную формулу для несбалансированных скобок', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const expression = '=(2+3';

    expect(parse(expression)).toBe(expression);
    expect(warnSpy).toHaveBeenCalledWith('Skipping parse error', 'Mismatched parentheses');

    warnSpy.mockRestore();
  });

  test('отклоняет небезопасное выражение и сохраняет исходное значение', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const expression = '=Math.random()';

    expect(parse(expression)).toBe(expression);
    expect(warnSpy).toHaveBeenCalledWith('Skipping parse error', 'Invalid symbol: M');

    warnSpy.mockRestore();
  });
});
