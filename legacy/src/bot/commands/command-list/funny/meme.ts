import { outputErrorMessage } from '@bot-utils/output-error-message';
import { Command, CommandData, CommandType } from '@command-protocols';
import axios from 'axios';

interface GalleryDataMediaItem {
  media_id: string;
  id: string;
}

interface RedditPost {
  data: {
    children: [
      {
        data: {
          title: string;
          permalink: string;
          url: string;
          is_video: boolean;
          url_overridden_by_dest: string;
          post_hint?: 'image' | 'rich:video' | 'hosted:video';
          preview?: {
            images: { source: { url: string } }[];
          };
          gallery_data?: {
            items: GalleryDataMediaItem[];

            // [
            //   {
            //     media_id: 'matyn8ysgde71';
            //     id: 60896545;
            //   }
            // ];
          };
        };
      }
    ];
  };
}

type RedditResponse = [RedditPost, RedditPost];

const func: Command = async ({ client, message, value }) => {
  const post = await axios
    .get<RedditResponse>('https://www.reddit.com/r/memes_br/random.json')
    .then((response) => response.data)
    .catch((error) => {
      console.log(`\nError!\nresponse status code: ${error.response.status}`);
      return null;
    });

  if (!post) {
    outputErrorMessage(
      client,
      message,
      'Eu pedi o meme mas o reddit não quis me dar 😠'
    );
    return;
  }

  const { url, gallery_data, title, post_hint, url_overridden_by_dest } =
    post[0].data.children[0].data;

  // yt video
  if (post_hint === 'rich:video') {
    client.sendYoutubeLink(message.from, `\n${url_overridden_by_dest}`, title);
    return;
  }

  if (post_hint === 'hosted:video') {
    client.reply(
      message.from,
      `O meme que eu encontrei é um vídeo do Reddit, por enquanto ainda ñ consigo baixar os vídeos de lá.\n\nLink do post: ${url_overridden_by_dest}.`,
      message.id
    );
    return;
  }

  // more than 1 image
  if (gallery_data) {
    const imageUrls = gallery_data.items.map(
      (item) => `https://i.redd.it/${item.media_id}.png`
    );

    for (const image of imageUrls) {
      client.sendImage(message.from, image, 'meme', title, message.id);
    }
    return;
  }

  const image = url_overridden_by_dest;

  console.log({ url, image, title, url_overridden_by_dest, post_hint });

  if (!image) {
    await client.reply(message.from, '', message.id);
  }

  await client.sendImage(message.from, image, 'meme', title, message.id);
};

const imitar: CommandData = {
  func,
  command: ['.meme'],
  category: CommandType.FUNNY,
  description:
    '(beta) - Retorna um meme aleatório do https://www.reddit.com/r/MemesBrasil/',
  allowInGroups: true,
  allowInPrivate: true,
};

export default imitar;
