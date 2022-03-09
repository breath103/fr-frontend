import { useParams } from "solid-app-router";
import { Component, createResource, For, Show } from "solid-js";
import { frApi } from "../apiClient";

import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

type BoardId = "human" | "troll";

export const BoardShow: Component = () => {
  const params = useParams();
  const boardId = () => params.boardId as BoardId;
  const [problemQuery] = createResource(
    boardId,
    async (boardId: BoardId) => await frApi.getPostsForBoard.call({ boardId })
  );
  const isHuman = boardId() === "human";

  return (
    <>
      <h3 class="text-2xl">{isHuman ? "Let's Read" : "Just Fucking Read"}</h3>
      <div class="flex flex-col">
        <Show when={problemQuery.loading}>
          {<div class="spinner text-2xl self-center m-4" />}
        </Show>
        <Show when={!problemQuery.loading && problemQuery()}>
          {
            <For each={problemQuery()!.data}>
              {(item) => (
                <div class="flex flex-row border-b-white border-b-2 px-2 py-1">
                  <div class="flex-1 text-lg">{item.title}</div>
                  <div>@{item.author.nickname}</div>
                  <div>{formatDistanceToNow(new Date(item.createdAt))} 전</div>
                  <div>
                    <Show when={item.createdAt !== item.updatedAt}>
                      수정{" "}
                      {formatDistanceToNow(new Date(item.updatedAt), {
                        locale: ko,
                      })}{" "}
                      전
                    </Show>
                  </div>
                </div>
              )}
            </For>
          }
        </Show>
      </div>
    </>
  );
};
