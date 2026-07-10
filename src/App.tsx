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
          <Route path="/admin" element={<Admin />} />
          <Route path="/peto" element={<AdminLogin />} />
        </Routes>
      </BrowserRouter>
    </ContentProvider>
  );
}
