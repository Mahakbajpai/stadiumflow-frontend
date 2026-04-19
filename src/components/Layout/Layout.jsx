import React from 'react';
import Navbar from './Navbar.jsx';
import DiagnosticsPanel from '../Diagnostics/DiagnosticsPanel.jsx';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-grow max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
      <footer className="mt-8 pt-4 border-t border-slate-200 text-center pb-8">
        <a href="mailto:feedback@stadiumflow.app?subject=StadiumFlow%20Feedback%20-%20Event%20Day"
          style={{ fontSize: '13px', color: '#4A7A55' }}
          target="_blank" rel="noopener noreferrer">
          Send feedback
        </a>
      </footer>
      <DiagnosticsPanel />
    </div>
  );
};

export default Layout;
