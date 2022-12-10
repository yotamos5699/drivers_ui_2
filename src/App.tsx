import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./components/Login";
//import Comp from "./components/Comp";
// Create a client
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
