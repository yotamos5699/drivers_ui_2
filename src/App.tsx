import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import MainScreen from "./components/MainScreen";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <MainScreen />
    </QueryClientProvider>
  );
}

export default App;
