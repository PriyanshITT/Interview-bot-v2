import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import RootApp from './App';  // ✅ Use RootApp instead of App
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './services/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RootApp />  {/* ✅ Updated here */}
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
