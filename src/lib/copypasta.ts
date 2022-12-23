import { load } from 'cheerio';
import cloudscraper from 'cloudscraper';
import { getRandom } from 'utils/random';

async function getRandomCopyPastaPage() {
  const htmlText = await cloudscraper({
    method: 'GET',
    uri: 'https://copypasta-br.fandom.com/pt-br/wiki/Especial:Todas_as_p%C3%A1ginas',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
    },
  }).then((text: string) => text);

  const $ = load(htmlText);
  const allLinks = $('.mw-allpages-body li a').toArray();
  const random = getRandom(allLinks);

  return `https://copypasta-br.fandom.com${random.attribs.href}`;
}

export async function getRandomCopyPasta() {
  const page = await getRandomCopyPastaPage();
  const htmlText = await cloudscraper({
    method: 'GET',
    uri: page,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
    },
  })
    .then((text: string) => text)
    .catch(() => {
      console.log(page);
      return '';
    });

  const $ = load(htmlText);
  const text = $('.mw-parser-output p').text().trim();

  return text;
}
