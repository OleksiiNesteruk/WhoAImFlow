import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import FeedbackSummary from "./pages/FeedbackSummary";
import FeedbackTable from "./pages/FeedbackTable";
import GameStatistics from "./pages/GameStatistics";
import { Layout } from "./components/Layout";
import { useState } from "react";
import { LoginPage } from "./pages/LoginPage";

function App() {
  const [isAuth, setIsAuth] = useState(
    localStorage.getItem("isAuth") === "true"
  );

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout isAuth={isAuth} />}>
          <Route path="summary" element={<FeedbackSummary />} />
          <Route
            path="login"
            element={
              <LoginPage
                onLogin={() => {
                  setIsAuth(true);
                }}
              />
            }
          />
          {isAuth && (
            <>
              <Route path="table" element={<FeedbackTable />} />
              <Route path="game-stats" element={<GameStatistics />} />
            </>
          )}
          <Route index element={<Navigate to="/summary" replace />} />
          <Route path="*" element={<Navigate to="/summary" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
