import { Component, createResource, For } from "solid-js";
import { frApi } from "../apiClient";

export const Home: Component = () => {
  return <div class="h-full flex flex-col justify-center items-center">
    <h1 class="text-center text-2xl">
      Just Fucking Read
    </h1>
    <div>
      <Board boardId="human" />
    </div>
  </div>
}

type BoardId = "human" | "troll";

const Board: Component<{ boardId: BoardId }> = (props) => {
  const [problemQuery] = createResource(
    props.boardId, 
    async (boardId: BoardId) => await frApi.getPostsForBoard.call({ boardId }),
  );
  return <table>
    {problemQuery() && <For each={problemQuery()!.data}>{
      (item) => <tr>
        <td>
          {item.title}
        </td>
        <td>
          @{item.author.nickname}
        </td>
        <td>
          {new Date(item.createdAt).toISOString()}
        </td>
        <td>
          {new Date(item.updatedAt).toISOString()}
        </td>
      </tr>
    }</For>}    
  </table>
}