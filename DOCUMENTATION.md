# 📘 Documentação Técnica - SGA Tuntum (Mega Tecnologia)

Este documento detalha o funcionamento técnico, segurança, integrações e processos de deploy do projeto da landing page SGA Tuntum.

---

## 🏗️ 1. Arquitetura do Projeto

O projeto foi construído como um **SPA (Single Page Application)** estático em React, mas utiliza um componente dinâmico em **PHP** para lidar com notificações seguras.

- **Frontend:** React 19 (com Vite)
- **Hospedagem:** Hostinger (Hospedagem Apache/Litespeed)
- **Integração:** PHP 8+ para Proxy de Notificações
- **Deploy Automático:** GitHub Actions (Branch: `production`)

---

## ⚡ 2. Fluxo de Leads e Notificações

Para garantir que cada lead seja notificada instantaneamente, o projeto utiliza uma estratégia híbrida:

### 📱 Notificação vía Telegram (Principal)
O site utiliza um **Proxy PHP** (`public/api/notify.php`) que:
1.  Recebe os dados do formulário via JSON.
2.  Valida a origem da requisição (`Allowed Origin`).
3.  Envia os dados de forma segura para a API do Telegram utilizando CURL.
4.  **Segurança:** O bot token e o chatId permanecem protegidos no servidor, nunca sendo expostos ao navegador do usuário.

### ✉️ Notificação vía E-mail (Backup)
Utiliza a API pública do `FormSubmit.co` para enviar os dados diretamente para `gomesdocarmo@gmail.com`. Esta é uma solução de failover robusta que não exige SMTP configurado localmente.

### 📊 Tracker de Sessão (`useTracker.ts`)
Além do formulário, o sistema monitora eventos importantes como:
- Cliques no WhatsApp.
- Visualização da tabela de preços.
- Scroll até o final da página.
- Localização aproximada do visitante (via IP API).

---

## 🔒 3. Segurança para Hostinger

### Arquivo `.htaccess` (Configuração Estratégica)
Localizado em `public/.htaccess`, ele gerencia:
- **Forçar HTTPS:** Redireciona tráfego HTTP para HTTPS.
- **Headers de Segurança:**
  - `X-Frame-Options: SAMEORIGIN` (Protege contra Clickjacking).
  - `X-Content-Type-Options: nosniff` (Protege contra MIME Sniffing).
  - `X-XSS-Protection: 1; mode=block` (Protege contra Cross-Site Scripting).
- **Proteção de Dados:** Bloqueia acesso a arquivos como `.env`, `.git` e READMEs sensíveis via URL.
- **Suporte a SPA:** Redireciona rotas inexistentes para o `index.html` para que o React Router possa carregá-las.

### PHP Origin Checking
O `notify.php` está configurado para aceitar requisições APENAS do domínio `https://tuntum.megatecnologias.com`, evitando que terceiros utilizem seu bot de notificações.

---

## 🚀 4. CI/CD - Deploy Automatizado

O fluxo de trabalho foi automatizado utilizando **GitHub Actions** (`.github/workflows/deploy.yml`):

1.  **Branch `main`:** É onde você desenvolve e faz seus commits.
2.  **Build Automático:** Ao dar `push` na `main`, o GitHub roda o `npm run build`.
3.  **Branch `production`:** O conteúdo da pasta `dist/` (arquivos finais otimizados) é enviado automaticamente para a branch `production`.
4.  **Hostinger Sync:** A Hostinger deve ser configurada para monitorar a branch **`production`**. Assim que houver um novo deploy, o site é atualizado instantaneamente.

---

## 📈 5. SEO e Performance

### Estratégia de Metadados
- **Canonical URLs:** Garantem que os mecanismos de busca não indexem conteúdo duplicado.
- **OpenGraph:** Tags otimizadas para compartilhamento em redes sociais (WhatsApp/Facebook).
- **Robots.txt:** Configurado para permitir a indexação de todo o domínio.
- **Imagens:** Carregadas do Cloudinary para garantir tempos de carregamento ultra-rápidos e cache global.

---

## ⚙️ 6. Alterações Futuras

Para alterar o Token do Telegram ou o Chat ID:
1.  Acesse `public/api/notify.php`.
2.  Edite as variáveis `$botToken` e `$chatId`.
3.  Faça o Git Push e o deploy será automático.

---

<p align="center">
  <em>Desenvolvido com foco em segurança, escalabilidade e conversão.</em>
</p>
