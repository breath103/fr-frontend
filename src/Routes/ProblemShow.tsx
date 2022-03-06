import { useParams } from "solid-app-router";
import { Component, createResource, For } from "solid-js";

import { frApi } from "../apiClient";

export const ProblemShow: Component = () => {
  const params = useParams();
  const [problemQuery] = createResource(
    params.problemId, 
    async (problemId: string) => await frApi.getProblem.call({ problemId }),
  );
  
  return <div>
    {problemQuery.loading && <div>Loading...</div>}
    {problemQuery() && (() => {
      const problem = problemQuery()!.data.content;
      return <div>
        <h4 className="text-xl pb-4">{problem.question}</h4>        
        <img className="w-auto h-auto pb-4 max-w-lg" src={problem.questionImage} />
        <For each={problem.choices}>{(choice, index) =>
          <div>
            {choice} <input type="radio" name="season" value={index()} checked />
          </div>
        }</For>
      </div>;
    })()}    
  </div>
}