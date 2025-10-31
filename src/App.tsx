import { RouterProvider } from "react-router-dom";
import { routes } from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const query = new QueryClient();


export default function App() {
  return (
    <QueryClientProvider client={query}>
      <RouterProvider router={routes}></RouterProvider>
    </QueryClientProvider>
  );
}
