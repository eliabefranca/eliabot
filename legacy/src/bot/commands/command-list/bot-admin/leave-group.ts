import { Command, CommandData, CommandType } from '@command-protocols';
import { getGroupByIdOrName } from 'src/bot/helpers/get-group-by-id-or-name';
import { outputErrorMessage } from 'src/bot/utils/output-error-message';

const func: Command = async ({ client, message, value }) => {
  if (!value) {
    outputErrorMessage(
      client,
      message,
      'Você precisa enviar o id ou o nome do grupo.'
    );
    return;
  }

  const targetGroup = await getGroupByIdOrName(client, value);

  if (!targetGroup) {
    outputErrorMessage(client, message, 'Nenhum grupo encontrado.');
    return;
  }

  client
    .leaveGroup(targetGroup.id as any)
    .then(() => {
      client.reply(
        message.from,
        'Sucesso, não estou mais nesse grupo.',
        message.id
      );
    })
    .catch((error) => {
      console.log(error);
      client.reply(message.from, 'Não foi possível sair do grupo.', message.id);
    });
};

const alert: CommandData = {
  func,
  description: 'Abandona um grupo',
  category: CommandType.BOT_ADMINISTRATION,
  command: ['.lvg', '.leave'],
  allowedUsers: 'admin',
  allowInGroups: true,
  allowInPrivate: true,
};

export default alert;
