import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Contact() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => { document.title = "Contact — Amazon Unlocked"; }, []);

  return (
    <div className="min-h-screen bg-background" style={{ background: "var(--gradient-body)" }}>
      <nav className="flex justify-between items-center px-6 md:px-15 h-[70px] sticky top-0 z-[200] border-b border-primary/[0.12]" style={{ background: "rgba(5,10,26,0.75)", backdropFilter: "blur(20px)" }}>
        <div className="font-black text-lg tracking-tight cursor-pointer" onClick={() => navigate("/")}>
          <span className="text-primary">Amazon</span> <span className="text-foreground">Unlocked</span>
        </div>
        <button onClick={() => navigate("/")} className="bg-transparent border border-primary/[0.12] text-foreground px-5 py-2 rounded-lg font-semibold text-sm transition-all hover:border-primary hover:text-primary">Home</button>
      </nav>

      <section className="max-w-[600px] mx-auto pt-20 pb-16 px-6">
        <h1 className="text-4xl font-black tracking-tight text-foreground mb-4 text-center">Contact Us</h1>
        <p className="text-muted text-center mb-10">We respond within 24 hours on business days.</p>

        {submitted ? (
          <div className="bg-card border border-emerald/20 rounded-xl p-8 text-center">
            <div className="text-3xl mb-3">✓</div>
            <div className="text-xl font-bold text-foreground mb-2">Message Sent</div>
            <div className="text-sm text-muted">We'll get back to you within 24 hours.</div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-8 space-y-5">
            <div>
              <Label className="text-foreground">Name</Label>
              <Input className="mt-1.5" placeholder="Your name" />
            </div>
            <div>
              <Label className="text-foreground">Email</Label>
              <Input className="mt-1.5" type="email" placeholder="you@example.com" />
            </div>
            <div>
              <Label className="text-foreground">Subject</Label>
              <Select>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select a topic" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="technical">Technical Support</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-foreground">Message</Label>
              <textarea className="mt-1.5 w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="How can we help?" />
            </div>
            <Button className="w-full font-bold" onClick={() => setSubmitted(true)}>Send Message</Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="bg-card border border-border rounded-xl p-5">
            <Mail size={20} className="text-primary mb-2" />
            <div className="font-bold text-foreground text-sm mb-1">For billing questions</div>
            <div className="text-xs text-muted">support@amazonunlocked.com</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <Headphones size={20} className="text-primary mb-2" />
            <div className="font-bold text-foreground text-sm mb-1">For technical support</div>
            <div className="text-xs text-muted">support@amazonunlocked.com</div>
          </div>
        </div>
      </section>
    </div>
  );
}
