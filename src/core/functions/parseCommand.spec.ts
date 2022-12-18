import { parseCommand } from './parseCommand';

describe('handleCommand', () => {
  it('should return the command data if the provided string is a command', () => {
    const result = parseCommand('.help value');
    expect(result).toBeTruthy();
    expect(result.keyword).toBe('.help');
    expect(result.value).toBe('value');
  });

  it('should accept other special characters as command prefix', () => {
    let result = parseCommand(',help value');
    expect(result).toBeTruthy();
    expect(result.keyword).toBe('.help');
    expect(result.value).toBe('value');

    result = parseCommand('/help value');
    expect(result).toBeTruthy();
    expect(result.keyword).toBe('.help');
    expect(result.value).toBe('value');

    result = parseCommand('!help value');
    expect(result).toBeTruthy();
    expect(result.keyword).toBe('.help');
    expect(result.value).toBe('value');

    result = parseCommand('#help value');
    expect(result).toBeTruthy();
    expect(result.keyword).toBe('.help');
    expect(result.value).toBe('value');
  });

  it('Should Return the parameters', () => {
    const result = parseCommand('.help #param1 #param2 #param3');

    expect(result.params).toBeTruthy();
    expect(result.params.length).toBe(3);
    expect(result.params[0]).toBe('param1');
    expect(result.params[1]).toBe('param2');
    expect(result.params[2]).toBe('param3');
  });
});
