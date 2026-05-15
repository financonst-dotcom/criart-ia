"use client";

import { useState } from "react";
import { HelpCircle, MessageCircle, Book, ExternalLink, Send, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Como funciona o sistema de créditos?",
    a: "Cada ferramenta de IA consome uma quantidade de créditos por geração. Por exemplo, troca de roupa custa 2 créditos, avatar creation 3 créditos, e vídeo 5 créditos. Você pode ver o custo antes de gerar.",
  },
  {
    q: "Os créditos expiram?",
    a: "Créditos de assinatura se renovam mensalmente. Créditos comprados em pacotes avulsos não expiram.",
  },
  {
    q: "Qual é o formato ideal para upload de imagens?",
    a: "Recomendamos PNG ou JPG com no mínimo 512×512 pixels. Para melhor resultado nas trocas de roupa, use fundo branco ou neutro.",
  },
  {
    q: "Posso usar as imagens geradas comercialmente?",
    a: "Sim! Você tem direitos totais sobre as imagens geradas na plataforma para uso comercial, incluindo e-commerce, redes sociais e materiais de marketing.",
  },
  {
    q: "Como funciona a troca de roupa com modelo?",
    a: "Nossa IA usa tecnologia Virtual Try-On (CatVTON) para aplicar a peça de roupa em um modelo mantendo a textura, cor e estampas originais da peça.",
  },
  {
    q: "Por que minha geração ficou em processamento?",
    a: "Gerações de vídeo e algumas imagens complexas podem levar de 30 a 120 segundos. Se demorar mais, entre em contato com o suporte.",
  },
  {
    q: "Posso cancelar minha assinatura?",
    a: "Sim, você pode cancelar a qualquer momento. O acesso continua até o fim do período pago.",
  },
  {
    q: "Existe API disponível?",
    a: "Sim! Usuários PRO e superiores têm acesso à API. Acesse o menu 'API' no dashboard para gerar sua chave de acesso.",
  },
];

const CATEGORIES = [
  { id: "billing", label: "Pagamentos" },
  { id: "technical", label: "Técnico" },
  { id: "account", label: "Conta" },
  { id: "generation", label: "Geração" },
  { id: "other", label: "Outro" },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("technical");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit() {
    if (!subject.trim() || !message.trim()) return toast.error("Preencha assunto e mensagem");
    setSending(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      toast.success("Ticket enviado! Responderemos em até 24h.");
      setSubject("");
      setMessage("");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
          <HelpCircle className="w-5 h-5 text-sky-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Suporte</h1>
          <p className="text-sm text-muted-foreground">Dúvidas? Estamos aqui para ajudar</p>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Book, label: "Documentação", desc: "Guias e tutoriais completos", badge: "Novo" },
          { icon: MessageCircle, label: "Chat ao vivo", desc: "Disponível seg–sex, 9h–18h", badge: null },
          { icon: ExternalLink, label: "Status da API", desc: "Verifique status dos serviços", badge: null },
        ].map(({ icon: Icon, label, desc, badge }) => (
          <button key={label}
            className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-card hover:bg-accent transition-colors text-left">
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-sky-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{label}</span>
                {badge && <Badge variant="default" className="text-xs py-0">{badge}</Badge>}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* FAQ */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <h2 className="font-semibold">Perguntas Frequentes</h2>
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="rounded-xl border border-border overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-left hover:bg-accent transition-colors">
                <span>{faq.q}</span>
                {openFaq === i ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact form */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <h2 className="font-semibold">Abrir Ticket</h2>
        <p className="text-sm text-muted-foreground">Não encontrou sua resposta? Envie uma mensagem e retornamos em até 24 horas.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Assunto</label>
            <Input placeholder="Descreva brevemente o problema" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Categoria</label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) => (
                <button key={c.id} onClick={() => setCategory(c.id)}
                  className={cn("px-3 py-1 rounded-lg text-xs font-medium border transition-all",
                    category === c.id ? "bg-sky-500/15 border-sky-500/40 text-sky-400" : "border-border text-muted-foreground hover:bg-accent"
                  )}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Mensagem</label>
          <Textarea
            placeholder="Descreva detalhadamente o problema ou dúvida..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="h-32"
          />
        </div>

        <Button className="gap-2 bg-sky-600 hover:bg-sky-500 text-white" onClick={handleSubmit} loading={sending}>
          <Send className="w-4 h-4" />
          Enviar Ticket
        </Button>
      </div>
    </div>
  );
}
