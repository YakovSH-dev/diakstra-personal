//import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
//import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { UserProvider } from "./entities/user/UserContext";

import "./index.css";
import App from "./app/App";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <App />
      </UserProvider>
      {/** <ReactQueryDevtools /> **/}
    </QueryClientProvider>
  </>,
);
