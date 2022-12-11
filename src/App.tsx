import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./components/Login";

const queryClient = new QueryClient();

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <Login />
      {/* <Comp /> */}
    </QueryClientProvider>
  );
}

export default App;
