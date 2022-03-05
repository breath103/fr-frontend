import { Component } from 'solid-js';

import { Route, Router, Routes } from "solid-app-router";
import { ProblemShow } from './Routes/ProblemShow';
import { Home } from './Routes/Home';

export const App: Component = () => {
  return (
    <Router>
      <div class="h-full flex flex-col bg-zinc-900 text-gray-100 overflow-auto">
        <header class="bg-zinc-700 sticky top-0 p-2 text-center">
          Home
        </header>

        <main class="flex-auto pt-4 pb-12">
          <div className="container mx-auto">
            <Routes>
              <Route path="/" component={Home} />
              <Route path="/problems/:problemId" component={ProblemShow} />
              {/* <Route path="/*all" element={<NotFound />} /> */}
            </Routes>
          </div>
        </main>        
      </div>
    </Router>
  );
};
