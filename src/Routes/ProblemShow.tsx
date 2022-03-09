import { useParams } from "solid-app-router";
import { Component, createResource, For, Show } from "solid-js";

import { frApi } from "../apiClient";

export const ProblemShow: Component = () => {
  const params = useParams();
  const [problemQuery] = createResource(
    params.problemId,
    async (problemId: string) => await frApi.getProblem.call({ problemId })
  );

  return (
    <div>
      {<Show when={problemQuery.loading}>{<div>Loading...</div>}</Show>}
      {problemQuery() &&
        (() => {
          const problem = problemQuery()!.data.content;
          return (
            <div>
              <h4 class="text-xl pb-4">{problem.question}</h4>
              <img
                class="w-auto h-auto pb-4 max-w-lg"
                src={problem.questionImage}
              />
              <For each={problem.choices}>
                {(choice, index) => (
                  <div>
                    {choice}{" "}
                    <input type="radio" name="season" value={index()} checked />
                  </div>
                )}
              </For>
            </div>
          );
        })()}
    </div>
  );
};
