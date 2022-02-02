import { EnrollUserProvider } from "./contexts/EnrollUserContext";
import { LoginProvider } from "./contexts/LoginContext";
import { UserProvider } from "./contexts/UserContext";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
  return (
    <EnrollUserProvider>
      <LoginProvider>
        <UserProvider>
          <AppRoutes />
        </UserProvider>
      </LoginProvider>
    </EnrollUserProvider>
  );
}

export default App;
