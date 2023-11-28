
import React from 'react';
import RequireAuth from '../contexts/requireAuth';

const Layout =  ({ children }: { children: React.ReactNode }) => {
  // Your layout component code here
  return (
    <RequireAuth>
      {/* Your layout content here */}
      {
        children
      }
    </RequireAuth>
  );
};

export default Layout;
