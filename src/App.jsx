import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store.js';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus } from './redux/auth/operations';
import { selectIsAuthenticated } from './redux/auth/selectors';
import PrivateRoutes from './routes/PrivateRoutes';
import RestrictedRoutes from './routes/RestrictedRoutes';
import { getTransactions } from "./redux/transactions/operations";
import './App.css';

const LoginPage = React.lazy(() => import('./pages/LoginPage/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage/RegisterPage'));
const LandingPage = React.lazy(() => import('./pages/LandingPage/LandingPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage/DashboardPage'));
const StatisticsPage = React.lazy(() => import('./pages/StatisticsPage/StatisticsPage'));
const CurrencyPage = React.lazy(() => import('./pages/CurrencyPage/CurrencyPage'));

// Giriş yapanları dashboard'a, misafirleri landing page'e yönlendirir
const HomeRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return isAuthenticated ? <Navigate to="/home" replace /> : <LandingPage />;
};

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    const init = async () => {
      // ⿡ Sayfa yüklendiğinde kullanıcı oturumunu kontrol et
      await dispatch(checkAuthStatus()).unwrap();

      // ⿢ Token store'a geldiği için artık transactions çekilebilir
      dispatch(getTransactions());
    };
    init();
  }, [dispatch]);


  return (
    <Router>
      <div className="App">
        <Suspense fallback={<div>Loading...</div>}><Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/login" element={
            <RestrictedRoutes>
              <LoginPage />
            </RestrictedRoutes>
          } />
          <Route path="/register" element={
            <RestrictedRoutes>
              <RegisterPage />
            </RestrictedRoutes>
          } />
          <Route path="/dashboard" element={
            <PrivateRoutes>
              <DashboardPage />
            </PrivateRoutes>
          } />
          <Route path="/home" element={
            <PrivateRoutes>
              <DashboardPage />
            </PrivateRoutes>
          } />
          <Route path="/statistics" element={
            <PrivateRoutes>
              <StatisticsPage />
            </PrivateRoutes>
          } />
          <Route path="/currency" element={
            <PrivateRoutes>
              <CurrencyPage />
            </PrivateRoutes>
          } />
        </Routes></Suspense>
      </div>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}

export default App;
