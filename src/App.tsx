import { Component } from "solid-js";

import { Route, Router, Routes, Link } from "solid-app-router";
import { ProblemShow } from "./Routes/ProblemShow";
import { BoardShow } from "./Routes/BoardShow";
import { Home } from "./Routes/Home";

export const App: Component = () => {
  return (
    <Router>
      <div class="h-full flex flex-col bg-zinc-900 text-gray-100 overflow-overlay">
        <header class="bg-zinc-700 sticky top-0 p-2 text-center space-x-8">
          <Link href="/boards/troll">
            트롤촌
          </Link>
          <Link href="/boards/human">
            선비촌
          </Link>
        </header>

        <main class="flex-auto pt-4 pb-12">
          <div class="container mx-auto">
            <Routes>
              <Route path="/" component={Home} />
              <Route path="/boards/:boardId" component={BoardShow} />
              <Route path="/problems/:problemId" component={ProblemShow} />
              {/* <Route path="/*all" element={<NotFound />} /> */}
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};
