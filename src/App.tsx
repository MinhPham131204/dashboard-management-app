// src/App.tsx
import React, { Suspense, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import MainPage from "./pages/MainPage";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/NotFound";
import LoginPage from "./pages/LoginPage";

// Lazy load pages
const DashboardsPage = React.lazy(() => import("./pages/DashboardsPage"));
const DashboardDetailPage = React.lazy(() => import("./pages/DashboardDetailPage"));
const CreateDashboardPage = React.lazy(() => import("./pages/CreateDashboardPage"));

function App() {
  console.log("App component rendered");
  
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="dashboards" element={<MainPage />}>
          <Route index element={
            <Suspense fallback={<div className="text-center p-8">Loading dashboard list...</div>}>
              <DashboardsPage />
            </Suspense>
          } />
          <Route path="create" element={
            <Suspense fallback={<div className="text-center p-8">Loading form...</div>}>
              <CreateDashboardPage />
            </Suspense>
          } />
          <Route path=":id" element={
            <Suspense fallback={<div className="text-center p-8">Loading dashboard details...</div>}>
              <DashboardDetailPage />
            </Suspense>
          } />
        </Route>
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;