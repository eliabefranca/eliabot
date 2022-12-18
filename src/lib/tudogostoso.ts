import { load } from 'cheerio';
import cloudscraper from 'cloudscraper';

interface RecipeSearchResult {
  totalPages: number;
  currentPage: number;
  recipes: Recipe[];
}

interface Recipe {
  title: string;
  image: string;
  url: string;
  category: string;
  author: string;
  duration: string;
  portions: string;
}

interface DetailedRecipe extends Recipe {
  ingredients: string[];
  steps: string[];
}

const formatText = (text: string | undefined) => {
  if (!text) return '';
  return text.trim().replace(/\s+/g, ' ').replace(/\n/g, '');
};

export const searchRecipe = async (recipeName: string, page: number) => {
  const htmlText = await cloudscraper({
    method: 'GET',
    uri: `https://www.tudogostoso.com.br/busca?q=${encodeURIComponent(
      recipeName
    )}&page=${page}`,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
    },
  }).then((text: string) => text);

  const $ = load(htmlText);
  const recipeCards = $('.col-lg-5 .recipe-card');
  const recipes: Recipe[] = [];

  recipeCards.each((_, recipeCard) => {
    const recipe: Recipe = {
      title: formatText($(recipeCard).find('.title').text()),
      image: formatText($(recipeCard).find('img').attr('src')!),
      url:
        'https://www.tudogostoso.com.br' +
        formatText($(recipeCard).find('a').attr('href')!),
      category: formatText($(recipeCard).find('.category span').text()),
      author: formatText($(recipeCard).find('.user span').text()),
      duration: formatText($(recipeCard).find('.time').text()),
      portions: formatText($(recipeCard).find('.portion').text()),
    };
    recipes.push(recipe);
  });

  const totalPages = Number(
    formatText($('.pagination .row+.row a:last-child').text())
  );

  return {
    totalPages,
    currentPage: page,
    recipes,
  } as RecipeSearchResult;
};

export const getRecipe = async (recipeUrl: string) => {
  const htmlText = await cloudscraper({
    method: 'GET',
    uri: recipeUrl,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
    },
  }).then((text: string) => text);

  const $ = load(htmlText);

  const title = formatText($('.recipe-title h1').text());
  const image = formatText($('meta[property="og:image"]').attr('content')!);
  const category = formatText($('.breadcrumb li:nth-child(2) a').text());
  const author = formatText($('.author-name').text());
  const duration = formatText($('.dt-duration').text());
  const portions = formatText($('.p-yield.num.yield').text());

  const ingredients: string[] = [];
  $('.ingredients-card li span').each((_, ingredient) => {
    ingredients.push(formatText($(ingredient).text()));
  });

  const steps: string[] = [];
  $('.instructions.e-instructions li span').each((_, step) => {
    steps.push(formatText($(step).text()));
  });

  return {
    title,
    image,
    url: recipeUrl,
    category,
    author,
    duration,
    portions,
    ingredients,
    steps,
  } as DetailedRecipe;
};
