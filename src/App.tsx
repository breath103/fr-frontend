import { Component, createResource, createSignal } from 'solid-js';

import logo from './logo.svg';
import styles from './App.module.css';

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
    return this.kyClient.get(`problems/${problemId}`).json();
  }
}

// @TODO - put into Context
const frApi = new FrApiClient();

const App: Component = () => {
  const [problemId, setProblemId] = createSignal("4EZNVWEPAWKGY75M");
  const [problemQuery] = createResource(problemId, async (problemId: string) => {
    return await frApi.getProblem(problemId);
  });
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <h1>Just Fucking Read</h1>        
      </header>
      <main>
        <div>
          {JSON.stringify(problemQuery())}
        </div>
      </main>
    </div>
  );
};

export default App;
