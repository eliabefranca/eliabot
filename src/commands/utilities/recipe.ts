import {
  CommandData,
  CommandHandler,
  CommandType,
  Message,
} from 'core/protocols';
import { ClientSendMessageParams, IClient } from 'core/protocols/client';
import { getRecipe, searchRecipe } from 'lib/tudogostoso';
import { isUrl } from 'utils/isUrl';

async function getRecipeByUrl(
  url: string
): Promise<{ text: string; photo: string }> {
  const recipe = await getRecipe(url);

  let text = '';
  text += `*${recipe.title}*\n`;
  text += `\nCategoria: ${recipe.category} - Autor(a): ${recipe.author} - Duração: ${recipe.duration} - Rende ${recipe.portions}`;
  text += '\n';

  text += '\n*Ingredientes:*\n';

  for (const ingredient of recipe.ingredients) {
    text += `\n- ${ingredient}`;
  }

  text += '\n\n*Modo de preparo:*';

  let i = 1;
  for (const step of recipe.steps) {
    text += `\n\n*${i}.* ${step}`;
    i++;
  }

  return {
    text,
    photo: recipe.image,
  };
}

function getRecipeUrlFromQuoted(n: string, recipes: string): string {
  const lines = recipes.split('\n').map((l) => l.trim().replace(/\*/g, ''));

  for (const line of lines) {
    const lineNumber = line.split(' - ')[0].trim();
    if (lineNumber === n) {
      return line.match(/https?:\/\/[^\s]+/g)![0].trim();
    }
  }

  return '';
}

async function handleByUrl(
  client: IClient,
  url: string,
  message: Message<any>
) {
  const recipe = await getRecipeByUrl(url);
  client.sendMessage({
    chatId: message.chatId,
    image: {
      url: recipe.photo,
      caption: recipe.text,
    },
  });
  return;
}

const handler: CommandHandler = async ({ client, message, value, args }) => {
  if (args.includes('handleReply')) {
    if (isNaN(Number(value))) {
      return;
    }

    const url = getRecipeUrlFromQuoted(value, message.quoted!.text);
    handleByUrl(client, url, message);
    return;
  }

  if (isUrl(value)) {
    handleByUrl(client, value, message);
    return;
  }

  const result = await searchRecipe(value, 1);

  let text = '';
  let index = 1;
  // const buttons: ClientSendMessageParams['buttons'] = [];
  for (const recipe of result.recipes) {
    text += `*${index} - ${recipe.title}* - ${recipe.url}\n`;
    text += `${recipe.category} - ${recipe.author} - ${recipe.duration} - ${recipe.portions}\n\n`;
    index++;
    //     buttons.push({
    //       id: `recipe-${index}`,
    //       displayText: `${index}. ${recipe.title} \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0
    // .recipe ${recipe.url}`,
    //     });
  }

  text += '\n%.recipe%';

  await client.sendMessage({
    chatId: message.chatId,
    text,
    // buttons,
    quote: message,
  });
};

export default {
  keywords: ['.receita', '.recipe'],
  category: CommandType.UTILS,
  handler,
  description:
    'Retorna a receita a partir de uma pesquisa: .receita <nome da receita> #p<numero da página>',
  allowInGroups: true,
  allowInPrivate: true,
} as CommandData;
