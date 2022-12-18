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

  it('Should Return the args', () => {
    const result = parseCommand('.help #param1 #param2 #param3');

    expect(result.args).toBeTruthy();
    expect(result.args.length).toBe(3);
    expect(result.args[0]).toBe('param1');
    expect(result.args[1]).toBe('param2');
    expect(result.args[2]).toBe('param3');
  });

  it('Should parse commands in the end of the string', () => {
    const result = parseCommand(
      'This is a message with a command at the end .help #param1 #param2 #param3 value here'
    );

    expect(result.args).toBeTruthy();
    expect(result.args.length).toBe(3);
    expect(result.args[0]).toBe('param1');
    expect(result.args[1]).toBe('param2');
    expect(result.args[2]).toBe('param3');
    expect(result.value).toBe('value here');
  });

  it('Should accept special characters in the value', () => {
    const result = parseCommand('.help https://www.site.com #param1');

    expect(result.args).toBeTruthy();
    expect(result.args.length).toBe(1);
    expect(result.args[0]).toBe('param1');
    expect(result.value).toBe('https://www.site.com');
  });
});
