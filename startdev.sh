#!/bin/bash
concurrently "yarn --cwd ./src/panel start" "yarn dev:bot"