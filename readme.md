<h1 align="center">Eliabot</h1>
<div align="center"><img src="./logo.png" /></div>

## O que é

Um bot para whatspapp feito com [@open-wa/wa-automate]([https://link](https://github.com/open-wa/wa-automate-nodejs))

Nada sério, é só por diversão.


## Funcionalidades

Além do automatizador para o Whatsapp, o projeto tem:

- Uma sistema de armazenamento tosco em JSON
- Um painel simples feito em ReactJS 
- Uma API em  NodeJS com Express


## Instalando dependências

```bash
  yarn install &&
  cd src/panel &&
  yarn install &&
  cd ../..  
```
## Rodando

Para executar o bot:
```bash
  yarn dev:bot
```

Para executar a api:
```bash
  yarn dev:api
```

Para executar o painel:
```bash
  yarn dev:panel
```

## Adicionando comandos novos

Os comandos ficam na pasta ```src/bot/commands/command-list```.

Não é necessário incluir o comando em nenhum lugar. Ao criá-lo ele será automaticamente importado usando o [fast-glob]([htlinktps://](https://github.com/mrmlnc/fast-glob)).

## Exemplo de um comando

```typescript
import { Command, CommandData } from '../protocols/command';

const func: Command = async ({client, message}) => {
  await client.sendText(message.from, 'hello world');
};

const sampleCommand: CommandData = {
  command: '.hello', // o quê o usuário precisará digitar
  description: 'Printa "hello world"', // descrição, isso printa no comando ajuda
  func, // função que o comando executa
};

export default sampleCommand;

```

## Testando
Este projeto não possui muitos testes 😥

Rodando os testes unitários
```bash
  yarn test:unit
```
