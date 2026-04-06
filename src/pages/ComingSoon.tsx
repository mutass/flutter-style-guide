import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const pageTitles: Record<string, string> = {
  "/blog": "Blog",
  "/careers": "Careers",
  "/privacy": "Privacy Policy",
  "/terms": "Terms of Service",
  "/tcpa": "TCPA Compliance",
  "/cookies": "Cookie Policy",
};

export default function ComingSoon() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const title = pageTitles[pathname] || "Coming Soon";

  useEffect(() => { document.title = `${title} — Amazon Unlocked`; }, [title]);

  return (
    <div className="min-h-screen bg-background flex flex-col" style={{ background: "var(--gradient-body)" }}>
      <nav className="flex justify-between items-center px-6 md:px-15 h-[70px] border-b border-primary/[0.12]" style={{ background: "rgba(5,10,26,0.75)", backdropFilter: "blur(20px)" }}>
        <div className="font-black text-lg tracking-tight cursor-pointer" onClick={() => navigate("/")}>
          <span className="text-primary">Amazon</span> <span className="text-foreground">Unlocked</span>
        </div>
        <button onClick={() => navigate("/")} className="bg-transparent border border-primary/[0.12] text-foreground px-5 py-2 rounded-lg font-semibold text-sm transition-all hover:border-primary hover:text-primary">Home</button>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-[400px]">
          <h1 className="text-3xl font-black text-foreground mb-3">{title}</h1>
          <p className="text-muted mb-8">This page is coming soon. We are working on it.</p>
          <div className="text-sm text-muted mb-3">Get notified when it's ready</div>
          <div className="flex gap-2">
            <Input placeholder="your@email.com" className="flex-1" />
            <Button className="font-bold">Notify Me</Button>
          </div>
          <button onClick={() => navigate("/")} className="text-sm text-primary mt-6 cursor-pointer hover:underline">← Back to home</button>
        </div>
      </div>
    </div>
  );
}
