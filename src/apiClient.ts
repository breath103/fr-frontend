import ky from 'ky';

class FrApiClient {
  private readonly kyClient: typeof ky;
  constructor() {
    this.kyClient = ky.extend({
      prefixUrl: "https://wit1pvu8rb.execute-api.ap-northeast-2.amazonaws.com/prod/",
      headers: {
        'x-fr-auth-token': "guest:12345-12345",
      }
    });
  }

  public async getProblem(problemId: string) {
    return this.kyClient.get(`problems/${problemId}`).json<{
      data: {
        id: string, 
        content: {
          type: "read-and-choose-v1" | string,
          questionImage: string,
          answerIndex: number,
          question: string,
          choices: string[],
        }
      }
    }>();
  }
}

// @TODO - put into Context
export const frApi = new FrApiClient();
