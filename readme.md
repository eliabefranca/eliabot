<h1 align="center">Eliabot</h1>

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
  yarn install
```
## Rodando

Para executar o bot, a api e o painel tudo de uma vez:
```bash
  yarn dev 
```

Para executar apenas o bot:
```bash
  yarn dev:bot
```

Para executar apenas a api:
```bash
  yarn dev:api
```

Para executar apenas o painel:
```bash
  yarn dev:panel
```

## Testando
Rodar os testes unitários
```bash
  yarn test:unit
```
