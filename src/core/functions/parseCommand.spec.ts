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
});
