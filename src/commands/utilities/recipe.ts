import {
  CommandData,
  CommandHandler,
  CommandType,
  Message,
} from 'core/protocols';
import { ClientSendMessageParams } from 'core/protocols/client';
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

const handler: CommandHandler = async ({ client, message, value }) => {
  const result = await searchRecipe(value, 1);

  if (isUrl(value)) {
    const recipe = await getRecipeByUrl(value);
    client.sendMessage({
      chatId: message.chatId,
      image: {
        url: recipe.photo,
        caption: recipe.text,
      },
      buttons: [
        {
          id: 'recipe-1',
          displayText: 'Ver no site',
          url: value,
        },
      ],
    });
    return;
  }

  let text = '';

  let index = 1;
  const buttons: ClientSendMessageParams['buttons'] = [];
  for (const recipe of result.recipes) {
    text += `*${index} - ${recipe.title}*`;
    text += `\n${recipe.url}`;
    text += `\n${recipe.category} - ${recipe.author} - ${recipe.duration} - ${recipe.portions}`;
    text += '\n\n';
    index++;
    buttons.push({
      id: `recipe-${index}`,
      displayText: `${index}. ${recipe.title} \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 
.recipe ${recipe.url}`,
    });
  }

  await client.sendMessage({
    chatId: message.chatId,
    text,
    buttons,
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
