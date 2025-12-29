# Forms 2.0 + Booking 2.0 — Diagnostico e Plano

## Diagnostico do sistema atual

### Stack e arquitetura
- Frontend: Next.js (App Router) com React 18.
- Backend: rotas API em `app/api/*` com acesso direto a Postgres via `pg`.
- Banco: Postgres (Supabase pool), schema criado em `lib/db.ts` e `scripts/init-db.ts`.
- Auth: sessao admin customizada em `lib/adminAuth.ts` (cookies + `admin_sessions`).
- Observabilidade: logs em console; sem fila/jobs dedicados.

### Formularios atuais
- Entrada principal: formulario de contato em `components/Contact.tsx`.
- Persistencia: tabela `leads` com insert via `app/api/leads/route.ts`.
- Sem builder, sem schema versionado, sem drafts, sem automacoes.
- Sem antispam/captcha, sem rate limit, sem auditoria.

### Agendamentos atuais
- Entrada principal: formulario em `app/agendar/page.tsx`.
- Persistencia: tabela `appointments`, endpoints em `app/api/appointments/*`.
- Google Calendar: integracao direta em `lib/googleCalendar.ts`.
- Status manual no admin (`pending`, etc) via `PATCH` em `app/api/appointments/[id]/route.ts`.
- Sem recursos/availability engine, sem conflitos, sem precos, sem pagamentos.

### Pagamentos/integracoes
- Nao existe modulo de pagamentos para forms/booking.
- Integracao externa atual relevante: Google Calendar (service account).
- Analytics interno ja implementado (Erilson Analytics).

## Diagrama textual (alto nivel)

UI (Contact/Agendar)
  -> Next API (app/api/leads, app/api/appointments)
      -> Postgres (leads, appointments)
      -> Google Calendar (create event)

Admin (app/admin/page.tsx)
  -> Next API (leads, appointments, auth)
      -> Postgres

## Riscos e mitigacoes

- Migracao de dados: manter tabelas antigas e criar mapping incremental.
  - Mitigacao: manter endpoints atuais funcionando e criar adaptador.
- Overbooking: concorrencia sem lock.
  - Mitigacao: transacoes + constraints + idempotency keys.
- Privacidade/LGPD: dados sensiveis sem politicas.
  - Mitigacao: novos schemas com status + retention + anonimization.
- Mudanca de schema: impacto em admin e analytics.
  - Mitigacao: feature flags + compat layer.

## Plano de substituicao (fases)

### Fase 0 (Preparacao)
- Criar flags: `FORMS_V2_ENABLED`, `BOOKING_V2_ENABLED`.
- Adicionar novos schemas sem remover os antigos.
- Criar adapters nos endpoints atuais (leads/appointments).

### Fase 1 (Forms 2.0 MVP)
- Modelos: forms, fields, entries, drafts, actions.
- Render server + client com schema versionado.
- Validacao + sanitizacao + rate limit + captcha interface.
- Endpoints: create/update schema, submit, draft, export.
- UI admin basica: builder (JSON) + listagem entries.

### Fase 2 (Booking 2.0 MVP)
- Recursos (resources) + availability engine basico.
- Booking form conectado ao Forms 2.0.
- Transacoes/locks anti-overbooking.
- CRUD bookings + status base.
- Calendario (ICS export) e Google Calendar (push basico).

### Fase 3 (Avancado)
- Campos calculados, templates, views, quizzes.
- Pricing rules, seasons, coupons, policies.
- Pagamentos (Stripe/PayPal) via drivers.
- Jobs/queues para notificacoes e webhooks.

### Fase 4 (Full)
- Engine completa de disponibilidade (buffers, duration, rules).
- Automation scheduler + webhooks + SMS.
- Relatorios, exports, PDF templates.

## Compatibilidade

- Endpoints atuais:
  - `POST /api/leads` -> adapta para Forms 2.0 (form "Contato").
  - `POST /api/appointments` -> adapta para Booking 2.0 (resource "Diagnostico").
- Admin atual continua lendo legacy tables enquanto v2 esta em rollout.

## Estrategia de migracao e rollback

- Migracao incremental: copiar leads/appointments para novas tabelas.
- Relatorio de migracao: quantos registros migrados e inconsistencias.
- Rollback: manter endpoints antigos e nao remover tabelas legacy.

## Deliverables planejados

- ERD textual + migrations.
- Endpoints Forms 2.0 / Booking 2.0.
- UI admin (builder, listings, reports).
- Testes minimos: conflitos, pricing, disponibilidade, webhooks.

