import React from "react";
import { UserStatus } from "../components/UserStatus";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <UserStatus>
      <div className="main-layout">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </UserStatus>
  );
};
