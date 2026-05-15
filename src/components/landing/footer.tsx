import Link from "next/link";
import { Sparkles, Instagram, Twitter, Youtube, Linkedin } from "lucide-react";

const LINKS = {
  Produto: [
    { label: "Troca de Roupa", href: "#" },
    { label: "Avatar Creator", href: "#" },
    { label: "Virtual Try-On", href: "#" },
    { label: "Fotos E-commerce", href: "#" },
    { label: "Gerador de Vídeos", href: "#" },
    { label: "API", href: "/docs/api" },
  ],
  Empresa: [
    { label: "Sobre nós", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Casos de uso", href: "/cases" },
    { label: "Afiliados", href: "/afiliados" },
    { label: "Trabalhe conosco", href: "/careers" },
  ],
  Suporte: [
    { label: "Central de ajuda", href: "/help" },
    { label: "Documentação", href: "/docs" },
    { label: "Status", href: "/status" },
    { label: "Comunidade", href: "/community" },
    { label: "Contato", href: "/contact" },
  ],
  Legal: [
    { label: "Termos de uso", href: "/terms" },
    { label: "Privacidade", href: "/privacy" },
    { label: "Cookies", href: "/cookies" },
    { label: "LGPD", href: "/lgpd" },
  ],
};

export function LandingFooter() {
  return (
    <footer className="border-t border-border/50 bg-background/50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold">
                <span className="text-foreground">fashion</span>
                <span className="gradient-text">ai</span>
                <span className="text-muted-foreground font-normal">.studio</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Plataforma de IA especializada em moda e e-commerce. Crie criativos
              profissionais em segundos.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Youtube, href: "#" },
                { icon: Linkedin, href: "#" },
              ].map(({ icon: Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  className="w-9 h-9 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-brand-400 hover:border-brand-500/30 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title} className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} FashionAI Studio. Todos os direitos reservados.
          </p>
          <p className="text-sm text-muted-foreground">
            Feito com ❤️ no Brasil 🇧🇷
          </p>
        </div>
      </div>
    </footer>
  );
}
