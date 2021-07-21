import { CommandMiddleware } from '../../bot';

export const logUserOnConsole: CommandMiddleware = async ({
  commandData,
  client,
  message,
  query,
}): Promise<boolean> => {
  console.log(
    `Running command  ${commandData.command} for ${message.sender.pushname}`
  );

  return true;
};
