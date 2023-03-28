<h1 align="center">Eliabot</h1>
<p align="center">
  <img src="logo.png" alt="Eliabot" width="200" />
</p>

## What is this?

A Node.js Whatsapp bot

## Prerequisites

- [Node.js](https://nodejs.org/en/) v12 or higher
- [FFmpeg](https://ffmpeg.org/download.html) installed and added to PATH

## Installing

```bash
  git clone https://github.com/eliabefranca/eliabot
  cd eliabot
  npm install
  cp .env.example .env
  npm run db
```

## Running

```bash
  npm run build
  npm run start
```

<!-- ## Termux

You can run this bot on Android with [Termux](<[termux](https://play.google.com/store/apps/details)>).
You need `wget`, if you don't have you can install it by running:

```bash
pkg install curl
```

Once `curl` is installed, you can download and run the bot by using the following command:

```bash
sudo chmod u+w,g+w /data/data/com.termux/files/usr/temp && curl -sS https://raw.githubusercontent.com/eliabefranca/eliabot/main/install.sh | bash
``` -->
