import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Navigate, Route, Routes } from "react-router";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import * as Sentry from "@sentry/react";

const SentryRoutes = Sentry.withSentryReactRouterV7Routing(Routes);
function App() {
  const throwError = () => {
    throw new Error("Error");
  };
  return (
    <>
      <button onClick={throwError}>Show Error</button>
      <SignedOut>
        {/* <SignInButton mode="modal" /> */}
        <SentryRoutes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<Navigate to={"/auth"} replace />} />
        </SentryRoutes>
      </SignedOut>

      <SignedIn>
        {/* <UserButton /> */}
        <SentryRoutes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<Navigate to={"/"} replace />} />
        </SentryRoutes>
      </SignedIn>
    </>
  );
}

export default App;
