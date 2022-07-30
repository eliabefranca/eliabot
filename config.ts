import path from 'path';

export const CONFIG = {
  dbFolder: path.resolve(__dirname, 'db'),
  imageDownloadsFolder: path.resolve(__dirname, 'files', 'images'),
  screenshotsFolder: path.resolve(__dirname, 'files', 'screenshots'),
  videoDownloadsFolder: path.resolve(__dirname, 'files', 'videos'),
};
