import { useState } from "react";
import LandingPage from "@/components/LandingPage";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const [showApp, setShowApp] = useState(false);

  if (showApp) {
    return <Dashboard onLogout={() => setShowApp(false)} />;
  }

  return <LandingPage onOpenApp={() => setShowApp(true)} />;
};

export default Index;
