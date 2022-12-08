import { Client, Message } from '@open-wa/wa-automate';
import { CONFIG } from 'config';
import puppeteer from 'puppeteer';

const WIDTH = 1920;
const HEIGHT = 1080;

export const watch = async (url: string, client: Client, message: Message) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [`--window-size=${WIDTH},${HEIGHT}`], // new option
  });
  const tab = await browser.newPage();
  await tab.setViewport({ width: WIDTH, height: HEIGHT });
  let currentNumberOfBoxes = 0;

  const watchForUpdates = async () => {
    await tab.goto(url);
    await tab.waitForSelector('[data-tab_type=SOCCER_TIMELINE]');
    await tab.click('[data-tab_type="SOCCER_TIMELINE"]');
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await tab.waitForSelector('[jscontroller="NO1nre"]'); // wait for the selector to load

    const numberOfBoxes = await tab.evaluate(
      () => document.querySelectorAll('[jscontroller="NO1nre"]').length
    );

    console.log(numberOfBoxes, currentNumberOfBoxes);

    if (numberOfBoxes > currentNumberOfBoxes) {
      const element = (await tab.$(
        `.imso_gf__gf-itm`
      )) as puppeteer.ElementHandle<Element>;

      const box = (await element.boundingBox()) as puppeteer.BoundingBox; // this method returns an array of geometric parameters of the element in pixels.
      const x = box['x']; // coordinate x
      const y = box['y']; // coordinate y
      const w = box['width']; // area width
      const h = box['height']; // area height

      await new Promise((resolve) => setTimeout(resolve, 1000));

      await tab
        .screenshot({
          path: `${CONFIG.screenshotsFolder}/view-group.png`,
          clip: { x: x - 2, y: y - 2, width: w + 4, height: h + 4 },
        })
        .then(async () => {
          await client.sendImage(
            message.from,
            `${CONFIG.screenshotsFolder}/view-group.png`,
            'group-screenshot',
            ''
          );
        });

      currentNumberOfBoxes = numberOfBoxes;
    }
  };

  while (true) {
    await watchForUpdates();
    await new Promise((resolve) => setTimeout(resolve, 30000));
    console.timeEnd('wait');
  }
};
