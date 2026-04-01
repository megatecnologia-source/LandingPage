# 📘 Documentação Técnica - SGA Tuntum (Mega Tecnologia)

Este documento detalha o funcionamento técnico, segurança, integrações e processos de deploy do projeto da landing page SGA Tuntum.

---

## 🏗️ 1. Arquitetura do Projeto

O projeto foi construído como um **SPA (Single Page Application)** estático em React, mas utiliza componentes dinâmicos em **PHP** para lidar com notificações seguras.

- **Frontend:** React 19 (com Vite)
- **Hospedagem:** Hostinger (Hospedagem Apache/Litespeed)
- **Backend:** PHP 8+ para Proxy de Notificações (Telegram e E-mail)
- **Deploy Automático:** GitHub Actions (Branch: `production`)

---

## ⚡ 2. Fluxo de Leads e Notificações

Para garantir que cada lead seja notificada instantaneamente, o projeto utiliza uma estratégia híbrida com execução paralela via `Promise.allSettled()`:

### 📱 Notificação vía Telegram
O site utiliza um **Proxy PHP** (`public/api/notify.php`) que:
1. Recebe os dados do formulário via JSON.
2. Valida a origem da requisição (`Allowed Origin`).
3. Envia os dados de forma segura para a API do Telegram utilizando cURL com SSL verificação.
4. **Segurança:** O bot token e o chatId são armazenados como variáveis de ambiente no hPanel da Hostinger, nunca sendo expostos ao navegador do usuário.
5. Usa formatação **HTML** para robustez (em vez de Markdown).

### ✉️ Notificação vía E-mail
O projeto utiliza PHP nativo (`mail()`) via `public/api/send_email.php`:
1. Recebe os dados do formulário via JSON.
2. Envia e-mail para `gomesdocarmo@gmail.com` com remetente `noreply@tuntum.megatecnologias.com`.
3. O endereço `noreply@tuntum.megatecnologias.com` deve ser criado no hPanel da Hostinger.

### 🔄 Execução Paralela
O frontend (`App.tsx`) dispara ambas as notificações em paralelo:
- Se o e-mail funcionar, o usuário recebe feedback de sucesso.
- Se o Telegram falhar, apenas um warning é logado (não bloqueia o sucesso).
- Isso garante que mesmo que um canal esteja indisponível, o lead não é perdido.

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
- **Proteção da API:** Bloqueia acesso GET direto aos arquivos `notify.php` e `send_email.php` (apenas POST é permitido).
- **Bloqueio de config.php:** Impede acesso direto ao arquivo de configurações via browser.
- **Suporte a SPA:** Redireciona rotas inexistentes para o `index.html` para que o React Router possa carregá-las.

### Proteções nos Endpoints PHP
Ambas as APIs (`notify.php` e `send_email.php`) possuem:
- **Honeypot:** Verificação do campo `bot-field` (silencia bots).
- **Rate Limiting:** Limite de 3 tentativas por IP em janela de 10 minutos.
- **Sanitização:** Todos os dados de entrada são sanitizados com `htmlspecialchars()` + `strip_tags()`.
- **Validação de E-mail:** O campo e-mail é validado com `FILTER_VALIDATE_EMAIL` (previne Header Injection).
- **SSL Verificação:** cURL configurado com `CURLOPT_SSL_VERIFYPEER = true`.

### Variáveis de Ambiente (hPanel)
As credenciais do Telegram são configuradas no hPanel:
1. Acesse **Hospedagem** → **Avançado** → **Variáveis de ambiente PHP**
2. Adicione:
   - `TELEGRAM_BOT_TOKEN` = (token do BotFather)
   - `TELEGRAM_CHAT_ID` = (ID do grupo/canal)

---

## 🚀 4. CI/CD - Deploy Automatizado

O fluxo de trabalho foi automatizado utilizando **GitHub Actions** (`.github/workflows/deploy.yml`):

1. **Branch `main`:** É onde você desenvolve e faz seus commits.
2. **Build Automático:** Ao dar `push` na `main`, o GitHub roda o `npm run build`.
3. **Branch `production`:** O conteúdo da pasta `dist/` (arquivos finais otimizados) é enviado automaticamente para a branch `production`.
4. **Hostinger Sync:** A Hostinger deve ser configurada para monitorar a branch **`production`**. Assim que houver um novo deploy, o site é atualizado instantaneamente.

---

## 📈 5. SEO e Performance

### Estratégia de Metadados
- **Canonical URLs:** Garantem que os mecanismos de busca não indexem conteúdo duplicado.
- **OpenGraph:** Tags otimizadas para compartilhamento em redes sociais (WhatsApp/Facebook).
- **Robots.txt:** Configurado para permitir a indexação de todo o domínio.
- **Imagens:** Carregadas do Cloudinary para garantir tempos de carregamento ultra-rápidos e cache global.

---

## ⚙️ 6. Alterações Futuras

### Para alterar as configurações do Telegram:
1. Acesse o hPanel → **Variáveis de ambiente PHP**
2. Atualize `TELEGRAM_BOT_TOKEN` e `TELEGRAM_CHAT_ID`
3. Não é necessário reiniciar o servidor em hospedagem compartilhada.

### Para alterar o e-mail de destino:
1. Edite o arquivo `public/api/send_email.php`
2. Modifique a variável `$to` para o novo endereço.
3. Faça o Git Push e o deploy será automático.

---

## 📝 7. Feedback do Formulário

O formulário de aceite da proposta exibe feedback inline (banner) ao usuário:
- **Sucesso:** Banner verde com mensagem de confirmação.
- **Erro:** Banner vermelho com instrução para contactar via WhatsApp.
- **Carregamento:** Botão desabilitado com texto "Enviando...".

---

<p align="center">
  <em>Desenvolvido com foco em segurança, escalabilidade e conversão.</em>
</p>