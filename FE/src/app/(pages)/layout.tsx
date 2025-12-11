import React from 'react';
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AppHeader></AppHeader>
      {children}
      <AppFooter></AppFooter>
    </>
  );
};

export default PageLayout;
