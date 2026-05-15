import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex flex-col w-1/2 relative overflow-hidden bg-gradient-to-br from-brand-500/10 via-background to-orange-500/5">
        <div className="absolute inset-0 bg-mesh-gradient noise-bg" />
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-brand-500/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px]" />

        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center shadow-brand">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-foreground">fashion</span>
              <span className="gradient-text">ai</span>
              <span className="text-muted-foreground font-normal">.studio</span>
            </span>
          </Link>

          {/* Central showcase */}
          <div className="flex-1 flex flex-col items-center justify-center gap-8">
            <div className="grid grid-cols-2 gap-3 max-w-xs">
              {[
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=400&fit=crop",
                "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&h=400&fit=crop",
                "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&h=400&fit=crop",
                "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop",
              ].map((src, i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden border border-white/10 shadow-glass aspect-[3/4]"
                  style={{
                    animationDelay: `${i * 0.5}s`,
                    transform: i % 2 === 1 ? "translateY(12px)" : "none",
                  }}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold gradient-text-white">
                IA especializada em moda
              </h2>
              <p className="text-sm text-muted-foreground max-w-xs">
                Crie fotos profissionais, troque roupas e gere campanhas em segundos.
              </p>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-2 glass px-4 py-2.5 rounded-xl">
              <div className="flex -space-x-2">
                {["MC", "RO", "AL"].map((initial) => (
                  <div
                    key={initial}
                    className="w-7 h-7 rounded-full bg-gradient-brand flex items-center justify-center text-xs font-bold text-white border-2 border-background"
                  >
                    {initial}
                  </div>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                +8.000 marcas ativas
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background relative">
        {/* Mobile logo */}
        <div className="lg:hidden absolute top-8 left-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center shadow-brand">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold">
              <span className="text-foreground">fashion</span>
              <span className="gradient-text">ai</span>
            </span>
          </Link>
        </div>

        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
