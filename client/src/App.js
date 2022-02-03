import { LoginProvider } from "./contexts/LoginContext";
import { UserProvider } from "./contexts/UserContext";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
  return (
    <LoginProvider>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </LoginProvider>
  );
}

export default App;
