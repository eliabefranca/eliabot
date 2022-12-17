<h1 align="center">Eliabot</h1>

## What is this?

A Node.js Whatsapp bot

## Installing

```bash
  git clone https://github.com/eliabefranca/eliabot
  cd eliabot
  npm install
  cp .env.example .env
```

## Running

```bash
  npm run build
  npm run start
```

## Termux

You can run this bot on Android with [Termux](<[termux](https://play.google.com/store/apps/details)>).
You need `wget`, if you don't have you can install it by running:

```bash
pkg install wget
```

Once `wget` is installed, you can download and run the bot by using the following command:

```bash
wget -qO- https://raw.githubusercontent.com/eliabefranca/eliabot/main/install.sh | bash
```
