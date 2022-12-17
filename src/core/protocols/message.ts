export interface Message<T> {
  id: string;
  chatId: string;
  type:
    | 'image'
    | 'video'
    | 'text'
    | 'audio'
    | 'file'
    | 'location'
    | 'sticker'
    | 'contact'
    | 'reply'
    | 'document';
  sender: {
    id: string;
    name: string;
  };
  text: string;
  caption?: string | null;
  image?: Buffer;
  video?: Buffer;
  quoted?: Message<T>;
  originalDriverMessage?: T;
}
