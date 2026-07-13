/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Portfolio from './pages/Portfolio';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import { ContentProvider } from './contexts/ContentContext';

export default function App() {
  return (
    <ContentProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/peto" element={<Admin />} />
          <Route path="/peto-login" element={<AdminLogin />} />
          <Route path="*" element={<div className="min-h-screen bg-background flex items-center justify-center text-white text-3xl font-bold font-display tracking-tight">404 - Page Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </ContentProvider>
  );
}
