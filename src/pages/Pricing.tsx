import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X, Shield, CreditCard, RefreshCw, HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const tiers = [
  {
    name: "Starter",
    monthlyPrice: 0,
    annualPrice: 0,
    badge: null,
    cta: "Get Started Free",
    ctaVariant: "outline" as const,
    plan: null,
    features: [
      "PDF Engine (eBook only, up to 3 books/month)",
      "Royalty Calculator",
      "Spine Width Calculator",
      "Upload Checklist (read-only)",
      "KDP Keyword Finder (3 searches/day)",
    ],
    excluded: [
      "Cover Checker",
      "Price & BSR Tracker",
      "Landing Page Builder",
      "AI Voice Agent",
      "Lead CRM",
      "Email & SMS Sequences",
    ],
  },
  {
    name: "Author",
    monthlyPrice: 19,
    annualPrice: 15,
    badge: "Most Popular",
    cta: "Start 7-Day Free Trial",
    ctaVariant: "default" as const,
    plan: "author",
    features: [
      "Everything in Starter",
      "PDF Engine (eBook + Paperback, unlimited)",
      "Cover Checker (unlimited uploads)",
      "Price & BSR Tracker (up to 5 books)",
      "Landing Page Builder (3 templates)",
      "Upload Checklist (interactive with save)",
      "Keyword Finder (unlimited)",
      "Priority email support",
    ],
    excluded: [
      "AI Voice Agent",
      "Lead CRM",
      "Email & SMS Sequences",
      "White-label PDF output",
    ],
  },
  {
    name: "Publisher",
    monthlyPrice: 49,
    annualPrice: 39,
    badge: null,
    cta: "Start 7-Day Free Trial",
    ctaVariant: "default" as const,
    plan: "publisher",
    features: [
      "Everything in Author",
      "AI Voice Agent (Sarah — unlimited calls)",
      "Lead CRM (unlimited leads)",
      "Email & SMS sequences",
      "Landing Page Builder (all templates + custom color)",
      "Price tracker (unlimited books)",
      "White-label PDF output (remove branding)",
      "Dedicated account manager",
    ],
    excluded: [],
  },
];

const guarantees = [
  { icon: Shield, label: "AES-256 encryption" },
  { icon: Shield, label: "TCPA compliance" },
  { icon: RefreshCw, label: "Cancel anytime" },
  { icon: CreditCard, label: "30-day money-back guarantee" },
];

const faqs = [
  { q: "Can I change plans later?", a: "Yes, upgrade or downgrade anytime from your account settings." },
  { q: "Is there a free trial?", a: "Author and Publisher plans include a 7-day free trial, no credit card required." },
  { q: "Do you store my manuscript?", a: "No — all PDF processing happens in your browser. We never see your content." },
  { q: "What payment methods do you accept?", a: "All major credit cards via Stripe. Annual plans available by invoice." },
  { q: "Can I use this for non-KDP platforms?", a: "Yes — our PDF formatting works for IngramSpark, Draft2Digital, and any platform accepting standard PDF." },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Pricing — KDP Unlocked";
  }, []);

  return (
    <div className="min-h-screen bg-background" style={{ background: "var(--gradient-body)" }}>
      {/* Nav */}
      <nav className="flex justify-between items-center px-6 md:px-15 h-[70px] sticky top-0 z-[200] border-b border-primary/[0.12]" style={{ background: "rgba(5,10,26,0.75)", backdropFilter: "blur(20px)" }}>
        <div className="font-black text-lg tracking-tight cursor-pointer" onClick={() => navigate("/")}>
          <span className="text-primary">Amazon</span> <span className="text-foreground">Unlocked</span>
        </div>
        <div className="hidden md:flex items-center gap-0.5">
          {[{ label: "Unlock", path: "/" }, { label: "About Us", path: "/" }, { label: "Marketing", path: "/" }, { label: "Pricing", path: "/pricing" }, { label: "KDP Sales", path: "/" }].map((link) => (
            <a key={link.label} onClick={() => navigate(link.path)} className={`text-sm font-medium px-4 py-1.5 rounded-full border border-transparent transition-all cursor-pointer ${link.label === "Pricing" ? "bg-primary/[0.12] border-primary/[0.2] text-primary" : "text-foreground hover:border-primary/[0.12] hover:bg-primary/[0.06]"}`}>
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2.5">
          <button onClick={() => navigate("/")} className="bg-transparent border border-primary/[0.12] text-foreground px-5 py-2 rounded-lg font-semibold text-sm transition-all hover:border-primary hover:text-primary">Login</button>
          <button onClick={() => navigate("/")} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-bold text-sm transition-all hover:shadow-[0_0_24px_rgba(0,229,255,0.4)] hover:-translate-y-0.5">Sign Up</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center pt-20 pb-8 px-6">
        <div className="inline-flex items-center gap-2 bg-primary/[0.08] border border-primary/[0.2] rounded-full px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-widest mb-6">
          Simple, transparent pricing
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-4">
          Choose Your <span className="text-primary">Plan</span>
        </h1>
        <p className="text-muted text-base max-w-[500px] mx-auto mb-8 leading-relaxed">
          Start free. Upgrade when you're ready. Every plan includes browser-based processing — your manuscripts never leave your device.
        </p>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <span className={`text-sm font-semibold ${!annual ? "text-foreground" : "text-muted"}`}>Monthly</span>
          <Switch checked={annual} onCheckedChange={setAnnual} />
          <span className={`text-sm font-semibold ${annual ? "text-foreground" : "text-muted"}`}>Annual</span>
          {annual && <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">Save up to 21%</Badge>}
        </div>
      </section>

      {/* Cards */}
      <section className="max-w-[1100px] mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {tiers.map((tier) => {
            const price = annual ? tier.annualPrice : tier.monthlyPrice;
            const isPopular = tier.badge === "Most Popular";
            return (
              <Card key={tier.name} className={`relative p-7 flex flex-col ${isPopular ? "border-primary/40 shadow-[0_0_40px_rgba(0,229,255,0.1)]" : "border-border"}`}>
                {isPopular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground font-bold text-xs px-4">
                    Most Popular
                  </Badge>
                )}
                <div className="text-lg font-bold text-foreground mb-1">{tier.name}</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-black text-foreground">{price === 0 ? "Free" : `$${price}`}</span>
                  {price > 0 && <span className="text-sm text-muted">/month</span>}
                </div>
                {annual && price > 0 && (
                  <div className="text-xs text-muted mb-4">Billed annually</div>
                )}
                {!annual && price === 0 && <div className="text-xs text-muted mb-4">Forever free</div>}
                {!annual && price > 0 && <div className="text-xs text-muted mb-4">Billed monthly</div>}

                <Button
                  variant={tier.ctaVariant}
                  className={`w-full mb-6 font-bold ${isPopular ? "bg-primary text-primary-foreground hover:shadow-[0_0_24px_rgba(0,229,255,0.3)]" : ""}`}
                  onClick={() => navigate(tier.plan ? `/signup?plan=${tier.plan}` : "/signup")}
                >
                  {tier.cta}
                </Button>

                <div className="space-y-2.5 flex-1">
                  {tier.features.map((f) => (
                    <div key={f} className="flex items-start gap-2 text-sm">
                      <Check size={14} className="text-emerald mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{f}</span>
                    </div>
                  ))}
                  {tier.excluded.map((f) => (
                    <div key={f} className="flex items-start gap-2 text-sm">
                      <X size={14} className="text-muted mt-0.5 flex-shrink-0" />
                      <span className="text-muted">{f}</span>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* All plans include */}
      <section className="border-y border-primary/[0.12] py-10 px-6" style={{ background: "rgba(5,10,26,0.65)" }}>
        <div className="text-center text-[0.68rem] font-bold uppercase tracking-[0.15em] text-primary mb-6">All plans include</div>
        <div className="flex justify-center flex-wrap gap-6 max-w-[800px] mx-auto">
          {guarantees.map((g) => (
            <div key={g.label} className="flex items-center gap-2 text-sm text-muted">
              <g.icon size={16} className="text-emerald" />
              {g.label}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-[700px] mx-auto py-20 px-6">
        <div className="text-center text-[0.68rem] font-bold uppercase tracking-[0.15em] text-primary mb-3">FAQ</div>
        <h2 className="text-center text-3xl font-extrabold text-foreground mb-10">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border rounded-lg px-5">
              <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/[0.12] px-6 md:px-16 pt-16 pb-8" style={{ background: "hsl(222 50% 6%)" }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-[1100px] mx-auto">
          <div>
            <div className="text-xl font-black mb-3.5"><span className="text-primary">Amazon</span> Unlocked</div>
            <p className="text-sm text-muted leading-relaxed max-w-[280px]">The all-in-one KDP marketing suite.</p>
          </div>
          {[
            { title: "Product", links: [{ label: "Dashboard", path: "/" }, { label: "Manuscript Engine", path: "/" }, { label: "Landing Pages", path: "/" }, { label: "AI Agent", path: "/" }, { label: "Pricing", path: "/pricing" }] },
            { title: "Resources", links: [{ label: "Documentation", path: "/" }, { label: "API Reference", path: "/" }, { label: "Blog", path: "/" }] },
            { title: "Company", links: [{ label: "About", path: "/" }, { label: "Contact", path: "/" }, { label: "Legal", path: "/" }] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-primary mb-4">{col.title}</h4>
              {col.links.map(link => (
                <a key={link.label} onClick={() => navigate(link.path)} className="block text-sm text-muted mb-2.5 cursor-pointer transition-colors hover:text-foreground">{link.label}</a>
              ))}
            </div>
          ))}
        </div>
        <div className="max-w-[1100px] mx-auto mt-11 pt-5 border-t border-primary/[0.12] text-center">
          <p className="text-xs text-muted">© 2026 Amazon Unlocked. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
