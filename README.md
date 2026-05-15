# FashionAI Studio 🎨

> Plataforma SaaS ultra moderna de geração de criativos com IA especializada em Moda e E-commerce.

![FashionAI Studio](https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=400&fit=crop)

## ✨ Funcionalidades

- 👗 **Troca de Roupa IA** — Vista qualquer roupa em modelos com textura e logo originais
- 🧑‍🎨 **Avatar Creator** — Crie modelos humanos hiper-realistas por IA
- 👚 **Virtual Try-On** — Provador virtual fotorrealista
- 📸 **Fotos E-commerce** — Produza imagens profissionais para Shopee e Mercado Livre
- 📢 **Campanhas Automáticas** — Gere artes para Instagram, Stories e anúncios
- ✂️ **Remoção de Fundo** — Remoção automática com IA de alta precisão
- 🔍 **Upscaling 4K** — Melhore a qualidade de imagens em até 4x
- 🎬 **Geração de Vídeos** — Reels, TikTok e YouTube Shorts automáticos
- 📦 **Mockups** — Camisetas, canecas, embalagens e muito mais
- 📱 **Pack Social** — Pack completo de imagens para redes sociais

## 🛠 Stack

### Frontend
- **Next.js 15** (App Router, Server Actions, Turbopack)
- **React 19** + TypeScript
- **TailwindCSS** + shadcn/ui pattern
- **Framer Motion** (animações)
- **Zustand** (estado global)
- **React Query** (cache e mutações)

### Backend
- **Next.js Route Handlers** (API)
- **Prisma ORM** + PostgreSQL
- **JWT** (autenticação)
- **BullMQ** + Redis (filas)

### IA
- **Fal.ai** — Flux Kontext, Virtual Try-On, Upscaling
- **Replicate** — SDModels, InstantID
- **OpenAI** — GPT-4o para prompts inteligentes

### Infra
- **Cloudflare R2** (storage)
- **Stripe** (pagamentos)

## 🚀 Setup Rápido

### Pré-requisitos
- Node.js 20+
- PostgreSQL
- Redis (opcional para filas)

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
```

Preencha o `.env.local` com suas chaves:
- `DATABASE_URL` — string de conexão PostgreSQL
- `JWT_SECRET` — segredo aleatório (min 32 chars)
- `FAL_KEY` — chave da [Fal.ai](https://fal.ai)
- `REPLICATE_API_TOKEN` — token da [Replicate](https://replicate.com)
- `STRIPE_SECRET_KEY` — chave secreta Stripe
- `R2_*` — credenciais Cloudflare R2

### 3. Configurar banco de dados

```bash
npm run db:generate   # Gerar client Prisma
npm run db:push       # Criar tabelas
npm run db:studio     # Abrir Prisma Studio (opcional)
```

### 4. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── (auth)/          # Páginas de autenticação
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/     # App protegido
│   │   └── dashboard/
│   │       ├── outfit-swap/   # Troca de roupa
│   │       ├── avatar/        # Avatar creator
│   │       ├── tryon/         # Virtual Try-On
│   │       ├── ecommerce/     # Fotos produto
│   │       ├── campaigns/     # Campanhas
│   │       ├── remove-bg/     # Remover fundo
│   │       ├── upscale/       # Upscaling
│   │       ├── projects/      # Projetos
│   │       ├── history/       # Histórico
│   │       ├── subscription/  # Assinatura
│   │       └── settings/      # Configurações
│   ├── api/
│   │   ├── auth/          # Login, Register, Logout, Me
│   │   ├── generate/      # Todos os endpoints de geração IA
│   │   ├── billing/       # Stripe checkout + webhook
│   │   ├── projects/      # CRUD projetos
│   │   ├── generations/   # Histórico de gerações
│   │   └── upload/        # Upload de imagens
│   ├── onboarding/        # Fluxo de onboarding
│   └── page.tsx           # Landing page
├── components/
│   ├── landing/       # Componentes da landing page
│   ├── dashboard/     # Componentes do app
│   └── ui/            # Componentes base
├── lib/
│   ├── ai/            # Integrações Fal.ai e Replicate
│   ├── auth.ts        # JWT + bcrypt
│   ├── prisma.ts      # Client Prisma
│   ├── storage.ts     # Cloudflare R2
│   └── utils.ts       # Utilitários
├── store/             # Zustand stores
├── hooks/             # React Query hooks
├── types/             # TypeScript types
└── middleware.ts      # Auth middleware
```

## 💳 Sistema de Créditos

| Operação | Créditos |
|---|---|
| Remoção de fundo | 1 |
| Upscaling | 1 |
| Troca de roupa | 2 |
| Foto e-commerce | 2 |
| Pose/Expressão | 2 |
| Mockup | 2 |
| Avatar creation | 3 |
| Virtual Try-On | 3 |
| Catálogo | 3 |
| Campanha (por plataforma) | 2 |
| Vídeo | 5 |

## 💰 Planos

| Plano | Créditos/mês | Preço |
|---|---|---|
| Free | 10 total | Grátis |
| Starter | 100 | R$ 47/mês |
| Pro | 500 | R$ 147/mês |
| Business | 2.000 | R$ 397/mês |
| Enterprise | Custom | Consultar |

## 🔐 Segurança

- JWT com httpOnly cookies
- bcrypt para hash de senhas
- Rate limiting nas APIs de geração
- Validação com Zod em todos os inputs
- Verificação de créditos antes de cada geração
- Reembolso automático em caso de falha

## 🌐 Deploy

### Vercel (recomendado)

```bash
npx vercel
```

Variáveis de ambiente necessárias no Vercel:
- Todas as variáveis do `.env.example`
- `NEXTAUTH_URL` = URL de produção

### Docker

```dockerfile
# Dockerfile incluído na raiz
docker build -t fashionai-studio .
docker run -p 3000:3000 fashionai-studio
```

## 📡 API Pública

Autenticação via API Key (Bearer token):

```bash
curl -X POST https://api.fashionai.studio/v1/generate/outfit-swap \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "garmentImage": "...", "numImages": 2 }'
```

## 🤝 Contribuindo

1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Add nova-funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📜 Licença

MIT © FashionAI Studio
