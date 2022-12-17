import axios from 'axios';
const gis = require('g-i-s');

export const imageSearch = async (term: string) => {
  return new Promise((resolve, reject) => {
    let index: number;
    let text = term;

    if (/#\d+$/.test(term)) {
      text = term.split(/#\d+$/)[0].trim();

      index = parseInt(term.match(/#\d+$/)?.[0].replace('#', '') as string);
      index = index <= 0 ? index : index - 1;
    }

    if (text)
      gis(text, async (error: any, results: any[]) => {
        if (error || !results || !results[0]) {
          reject(false);
        }

        if (index) {
          const image = results[index];
          if (image) {
            const headers: any = await axios
              .get(image.url)
              .then((resp) => resp.headers)
              .catch(() => false);

            if (
              !headers ||
              headers['content-type' as keyof object] === 'text/html'
            ) {
              resolve('cant resolve');
            }
            resolve(image.url);
          } else {
            resolve('not found');
          }
        }

        try {
          for (const image of results) {
            const headers: any = await axios
              .get(image.url)
              .then((resp) => resp.headers)
              .catch(() => false);

            if (headers && headers['content-type'] !== 'text/html') {
              resolve(image.url);
              break;
            }
          }
        } catch (e) {
          resolve(false);
        }
      });
  }).catch((error) => {
    console.log(error);
    return false;
  });
};
