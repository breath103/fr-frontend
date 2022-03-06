import * as Entity from "./entities";

import { BaseClient } from "../base_client";

export class Client extends BaseClient {
  constructor(headers: { [key: string]: string }) {
    super({
      prefixUrl:
        "https://wit1pvu8rb.execute-api.ap-northeast-2.amazonaws.com/prod/",
      headers,
    });
  }

  public readonly createUser = {
    schema: JSON.parse(
      '{"description":"create new user","operationId":"createUser","parameters":[],"requestBody":{"description":"Body","required":true,"content":{"application/json":{"schema":{"type":"object","properties":{"user":{"type":"object","properties":{"email":{"type":"string"},"password":{"type":"string"},"nickname":{"type":"string"}},"required":["email","password","nickname"]}},"required":["user"]}}}},"responses":{"200":{"description":"Success","content":{"application/json":{"schema":{"$ref":"#/components/schemas/SuccessShow"}}}}}}'
    ),
    call: (params: Entity.CreateUserParameter) => {
      const path = "/users";

      return this.request<Entity.SuccessShow>({
        method: "POST",
        operationId: "createUser",
        path,
        queryParameters: {},
        body: {
          user: params["user"],
        },
        headers: {},
      });
    },
  };

  public readonly getUser = {
    schema: JSON.parse(
      '{"description":"create new user","operationId":"getUser","parameters":[{"in":"path","name":"userId","schema":{"type":"string"},"required":true}],"responses":{"200":{"description":"Success","content":{"application/json":{"schema":{"$ref":"#/components/schemas/UserShow"}}}}}}'
    ),
    call: (params: Entity.GetUserParameter) => {
      const path = `/users/${encodeURIComponent(params["userId"])}`;

      return this.request<Entity.UserShow>({
        method: "GET",
        operationId: "getUser",
        path,
        queryParameters: {},
        body: {},
        headers: {},
      });
    },
  };

  public readonly getMe = {
    schema: JSON.parse(
      '{"description":"create new session","operationId":"getMe","parameters":[],"responses":{"200":{"description":"Success","content":{"application/json":{"schema":{"$ref":"#/components/schemas/MeShow"}}}}}}'
    ),
    call: () => {
      const path = "/me";

      return this.request<Entity.MeShow>({
        method: "GET",
        operationId: "getMe",
        path,
        queryParameters: {},
        body: {},
        headers: {},
      });
    },
  };

  public readonly restartEmailVerification = {
    schema: JSON.parse(
      '{"description":"verify email with token","operationId":"restartEmailVerification","parameters":[],"responses":{"200":{"description":"Success","content":{"application/json":{"schema":{"$ref":"#/components/schemas/SuccessShow"}}}}}}'
    ),
    call: () => {
      const path = "/me/email-verification/restart";

      return this.request<Entity.SuccessShow>({
        method: "POST",
        operationId: "restartEmailVerification",
        path,
        queryParameters: {},
        body: {},
        headers: {},
      });
    },
  };

  public readonly verifyEmail = {
    schema: JSON.parse(
      '{"description":"verify email with token","operationId":"verifyEmail","parameters":[],"requestBody":{"description":"Body","required":true,"content":{"application/json":{"schema":{"type":"object","properties":{"token":{"type":"string"}},"required":["token"]}}}},"responses":{"200":{"description":"Success","content":{"application/json":{"schema":{"$ref":"#/components/schemas/SuccessShow"}}}}}}'
    ),
    call: (params: Entity.VerifyEmailParameter) => {
      const path = "/me/email-verification/verify";

      return this.request<Entity.SuccessShow>({
        method: "POST",
        operationId: "verifyEmail",
        path,
        queryParameters: {},
        body: {
          token: params["token"],
        },
        headers: {},
      });
    },
  };

  public readonly createProblem = {
    schema: JSON.parse(
      '{"description":"create problem for user","operationId":"createProblem","parameters":[],"requestBody":{"description":"Body","required":true,"content":{"application/json":{"schema":{"type":"object","properties":{"problem":{"type":"object","properties":{"content":{"anyOf":[{"type":"object","properties":{"type":{"type":"string","enum":["read-and-choose-v1"]},"question":{"type":"string"},"questionImage":{"type":"string"},"choices":{"type":"array","items":{"type":"string"}},"answerIndex":{"type":"number"}},"required":["type","question","questionImage","choices","answerIndex"]}]}},"required":["content"]}},"required":["problem"]}}}},"responses":{"200":{"description":"Success","content":{"application/json":{"schema":{"$ref":"#/components/schemas/ProblemShow"}}}}}}'
    ),
    call: (params: Entity.CreateProblemParameter) => {
      const path = "/problems";

      return this.request<Entity.ProblemShow>({
        method: "POST",
        operationId: "createProblem",
        path,
        queryParameters: {},
        body: {
          problem: params["problem"],
        },
        headers: {},
      });
    },
  };

  public readonly getProblem = {
    schema: JSON.parse(
      '{"description":"create problem for user","operationId":"getProblem","parameters":[{"in":"path","name":"problemId","schema":{"type":"string"},"required":true}],"responses":{"200":{"description":"Success","content":{"application/json":{"schema":{"$ref":"#/components/schemas/ProblemShow"}}}}}}'
    ),
    call: (params: Entity.GetProblemParameter) => {
      const path = `/problems/${encodeURIComponent(params["problemId"])}`;

      return this.request<Entity.ProblemShow>({
        method: "GET",
        operationId: "getProblem",
        path,
        queryParameters: {},
        body: {},
        headers: {},
      });
    },
  };

  public readonly createSession = {
    schema: JSON.parse(
      '{"description":"create new session","operationId":"createSession","parameters":[],"requestBody":{"description":"Body","required":true,"content":{"application/json":{"schema":{"type":"object","properties":{"auth":{"type":"object","properties":{"email":{"type":"string"},"password":{"type":"string"}},"required":["email","password"]}},"required":["auth"]}}}},"responses":{"200":{"description":"Success","content":{"application/json":{"schema":{"$ref":"#/components/schemas/SessionShow"}}}}}}'
    ),
    call: (params: Entity.CreateSessionParameter) => {
      const path = "/sessions";

      return this.request<Entity.SessionShow>({
        method: "POST",
        operationId: "createSession",
        path,
        queryParameters: {},
        body: {
          auth: params["auth"],
        },
        headers: {},
      });
    },
  };

  public readonly createPost = {
    schema: JSON.parse(
      '{"description":"create new post","operationId":"createPost","parameters":[],"requestBody":{"description":"Body","required":true,"content":{"application/json":{"schema":{"type":"object","properties":{"post":{"type":"object","properties":{"title":{"type":"string"},"boardId":{"anyOf":[{"type":"string","enum":["human"]},{"type":"string","enum":["troll"]}]},"content":{"type":"object","properties":{"blocks":{"type":"array","items":{"anyOf":[{"type":"object","properties":{"type":{"type":"string","enum":["text"]},"text":{"type":"string"}},"required":["type","text"]},{"type":"object","properties":{"type":{"type":"string","enum":["image"]},"url":{"type":"string"},"width":{"type":"number"},"height":{"type":"number"}},"required":["type","url","width","height"]}]}}},"required":["blocks"]}},"required":["title","boardId","content"]}},"required":["post"]}}}},"responses":{"200":{"description":"Success","content":{"application/json":{"schema":{"$ref":"#/components/schemas/PostShow"}}}}}}'
    ),
    call: (params: Entity.CreatePostParameter) => {
      const path = "/posts";

      return this.request<Entity.PostShow>({
        method: "POST",
        operationId: "createPost",
        path,
        queryParameters: {},
        body: {
          post: params["post"],
        },
        headers: {},
      });
    },
  };

  public readonly getPostsForBoard = {
    schema: JSON.parse(
      '{"description":"create new session","operationId":"getPostsForBoard","parameters":[{"in":"query","name":"boardId","schema":{"anyOf":[{"type":"string","enum":["human"]},{"type":"string","enum":["troll"]}]},"required":true},{"in":"query","name":"after","schema":{"type":"string"},"required":false},{"in":"query","name":"count","schema":{"type":"number"},"required":false}],"responses":{"200":{"description":"Success","content":{"application/json":{"schema":{"$ref":"#/components/schemas/SimplePostList"}}}}}}'
    ),
    call: (params: Entity.GetPostsForBoardParameter) => {
      const path = "/posts/for-board";

      return this.request<Entity.SimplePostList>({
        method: "GET",
        operationId: "getPostsForBoard",
        path,
        queryParameters: {
          boardId: params["boardId"],
          after: params["after"],
          count: params["count"],
        },
        body: {},
        headers: {},
      });
    },
  };

  public readonly getPost = {
    schema: JSON.parse(
      '{"description":"get post","operationId":"getPost","parameters":[{"in":"path","name":"postId","schema":{"type":"string"},"required":true}],"requestBody":{"description":"Body","required":true,"content":{"application/json":{"schema":{"type":"object","properties":{"comment":{"type":"object","properties":{"content":{"type":"object","properties":{"text":{"type":"string"},"media":{"anyOf":[{"type":"object","properties":{"type":{"type":"string","enum":["image"]},"url":{"type":"string"},"width":{"type":"number"},"height":{"type":"number"}},"required":["type","url","width","height"]}]}},"required":["text"]}},"required":["content"]}},"required":["comment"]}}}},"responses":{"200":{"description":"Success","content":{"application/json":{"schema":{"$ref":"#/components/schemas/SuccessShow"}}}}}}'
    ),
    call: (params: Entity.GetPostParameter) => {
      const path = `/posts/${encodeURIComponent(params["postId"])}`;

      return this.request<Entity.SuccessShow>({
        method: "GET",
        operationId: "getPost",
        path,
        queryParameters: {},
        body: {
          comment: params["comment"],
        },
        headers: {},
      });
    },
  };

  public readonly createPostComment = {
    schema: JSON.parse(
      '{"operationId":"createPostComment","parameters":[{"in":"path","name":"postId","schema":{"type":"string"},"required":true},{"in":"query","name":"after","schema":{"type":"string"},"required":false},{"in":"query","name":"count","schema":{"type":"number"},"required":false}],"responses":{"200":{"description":"Success","content":{"application/json":{"schema":{"$ref":"#/components/schemas/CommentList"}}}}}}'
    ),
    call: (params: Entity.CreatePostCommentParameter) => {
      const path = `/posts/${encodeURIComponent(params["postId"])}/comments`;

      return this.request<Entity.CommentList>({
        method: "POST",
        operationId: "createPostComment",
        path,
        queryParameters: {
          after: params["after"],
          count: params["count"],
        },
        body: {},
        headers: {},
      });
    },
  };

  public readonly getPostComments = {
    schema: JSON.parse(
      '{"operationId":"getPostComments","parameters":[{"in":"path","name":"postId","schema":{"type":"string"},"required":true},{"in":"query","name":"after","schema":{"type":"string"},"required":false},{"in":"query","name":"count","schema":{"type":"number"},"required":false}],"responses":{"200":{"description":"Success","content":{"application/json":{"schema":{"$ref":"#/components/schemas/CommentList"}}}}}}'
    ),
    call: (params: Entity.GetPostCommentsParameter) => {
      const path = `/posts/${encodeURIComponent(params["postId"])}/comments`;

      return this.request<Entity.CommentList>({
        method: "GET",
        operationId: "getPostComments",
        path,
        queryParameters: {
          after: params["after"],
          count: params["count"],
        },
        body: {},
        headers: {},
      });
    },
  };
}
