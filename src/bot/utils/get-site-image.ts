import axios from 'axios';

const shorten = async (url: string) => {
  let apiResponse = await axios
    // TODO: type this return
    .post<any>(
      `https://api.rebrandly.com/v1/links`,
      {
        destination: url,
      },
      {
        headers: {
          apiKey: process.env.REBRANDLY_API_KEY,
        },
      }
    )
    .catch((error) => {
      console.log(error.response.data);
      return null;
    });

  let link = apiResponse?.data;
  return link?.shortUrl;
};

export async function getSiteImage(url: string): Promise<string> {
  /**
   * statically.io doesn't support query params, so we need to shorten the url
   */
  const shortUrl = await shorten(url);

  return `https://cdn.statically.io/screenshot/full=true/${shortUrl}`;
}
