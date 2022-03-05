module.exports = {
  targets: {
    node: 'current',
  },
  presets: ['@babel/preset-env', '@babel/preset-typescript'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@command-protocols': './src/bot/commands/protocols/index.ts',
          '@json-db': '././src/database/json/index.ts',
          '@bot-utils/*': './src/bot/utils/*',
          '@bot-utils': './src/bot/utils/index.ts',
          '@utils': './src/utils/index.ts',
        },
      },
    ],
  ],
  ignore: ['**/*.spec.ts'],
};
