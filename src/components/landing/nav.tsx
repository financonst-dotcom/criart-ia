"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  {
    label: "Recursos",
    href: "#features",
    children: [
      { label: "Troca de Roupa IA", href: "#outfit-swap", desc: "Vista modelos com suas roupas" },
      { label: "Avatar Creator", href: "#avatar", desc: "Crie modelos humanos por IA" },
      { label: "Virtual Try-On", href: "#tryon", desc: "Provador virtual realista" },
      { label: "Fotos E-commerce", href: "#ecommerce", desc: "Fotos profissionais automáticas" },
      { label: "Campanhas IA", href: "#campaigns", desc: "Stories, banners e anúncios" },
    ],
  },
  { label: "Showcase", href: "#showcase" },
  { label: "Preços", href: "#pricing" },
  { label: "API", href: "/docs/api" },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-glass"
          : "bg-transparent"
      )}
    >
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center shadow-brand group-hover:shadow-brand-lg transition-shadow">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold">
            <span className="text-foreground">fashion</span>
            <span className="gradient-text">ai</span>
            <span className="text-muted-foreground font-normal">.studio</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <div key={link.label} className="relative">
              {link.children ? (
                <button
                  className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
                  onMouseEnter={() => setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {link.label}
                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 transition-transform duration-200",
                      activeDropdown === link.label && "rotate-180"
                    )}
                  />
                </button>
              ) : (
                <Link
                  href={link.href}
                  className="px-4 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
                >
                  {link.label}
                </Link>
              )}

              {link.children && activeDropdown === link.label && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-72 glass rounded-2xl p-2 shadow-glass-lg border border-border"
                    onMouseEnter={() => setActiveDropdown(link.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="flex flex-col px-4 py-3 rounded-xl hover:bg-accent transition-all duration-150 group"
                      >
                        <span className="text-sm font-medium text-foreground group-hover:text-brand-400 transition-colors">
                          {child.label}
                        </span>
                        <span className="text-xs text-muted-foreground mt-0.5">
                          {child.desc}
                        </span>
                      </Link>
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Entrar
          </Link>
          <Button asChild size="sm">
            <Link href="/register">
              <Sparkles className="w-4 h-4" />
              Começar grátis
            </Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-xl hover:bg-accent transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border"
          >
            <div className="container mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block px-4 py-3 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-border flex flex-col gap-2">
                <Button variant="outline" asChild className="w-full">
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/register">
                    <Sparkles className="w-4 h-4" />
                    Começar grátis
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
