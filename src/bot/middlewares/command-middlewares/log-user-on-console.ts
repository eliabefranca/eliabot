import { getTimeStamp } from 'src/utils/date';
import { CommandMiddleware } from '../../bot';

export const logUserOnConsole: CommandMiddleware = async ({
  commandData,
  client,
  message,
  query,
}): Promise<boolean> => {
  console.log(
    `${getTimeStamp()}: Running command ${commandData.command} for ${
      message.sender.pushname
    }`
  );

  return true;
};
