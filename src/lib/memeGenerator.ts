const canvas = require('canvas');

export default function memeGenerator(
  image: Buffer,
  TOP_TEXT: string,
  BOTTOM_TEXT: string
): Buffer {
  const img = new canvas.Image();
  img.src = image;
  const width = img.width;
  const height = img.height;

  // Create a new canvas with a size of 200x200 pixels
  const ctx = canvas.createCanvas(width, height).getContext('2d');
  // // use impact.ttf font
  // canvas.registerFont(__dirname + '/impact.ttf', {
  //   family: 'Impact',
  //   style: 'bold',
  //   weight: 'normal',
  // });
  ctx.drawImage(img, 0, 0);

  // Set the font style and text alignment
  const fontSize = width / 10;
  ctx.font = `bold ${fontSize}px Arial`;

  // add font outline
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'black';

  // Set the fill style to white and draw the text on top of the image
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';

  ctx.fillText(TOP_TEXT, width / 2, fontSize * 0.9, width - 30);
  ctx.strokeText(TOP_TEXT, width / 2, fontSize * 0.9, width - 30);

  ctx.fillText(BOTTOM_TEXT, width / 2, height - fontSize / 2, width - 30);
  ctx.strokeText(BOTTOM_TEXT, width / 2, height - fontSize / 2, width - 30);

  return ctx.canvas.toBuffer();
}
