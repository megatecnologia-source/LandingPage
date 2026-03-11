/// <reference types="vite/client" />
import { useEffect, useRef } from 'react';

// ─── Configuração ────────────────────────────────────────────────────────────
// Não usamos mais tokens no frontend! As mensagens vão via /api/telegram.
const TELEGRAM_API_URL = '/api/telegram';

// Intervalo de envio de relatório: 5 horas em ms
const REPORT_INTERVAL_MS = 5 * 60 * 60 * 1000;

// ─── Tipos ───────────────────────────────────────────────────────────────────
type EventName =
    | 'page_open'
    | 'saw_pricing'
    | 'scrolled_to_end'
    | 'cta_whatsapp_click'
    | 'cta_form_submit';

interface TrackedEvent {
    name: EventName;
    time: string; // "HH:MM"
}

interface SessionData {
    city: string;
    region: string;
    country: string;
    openTime: string;     // "HH:MM"
    openDate: string;     // "DD/MM/YYYY"
    events: TrackedEvent[];
    reportSentAt?: number; // timestamp da última vez que enviou
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const SESSION_KEY = 'mega_tracker_session';

function now(): string {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function today(): string {
    return new Date().toLocaleDateString('pt-BR');
}

function loadSession(): SessionData | null {
    try {
        const raw = sessionStorage.getItem(SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function saveSession(data: SessionData) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

function hasEvent(session: SessionData, name: EventName): boolean {
    return session.events.some(e => e.name === name);
}

function addEvent(name: EventName): void {
    const session = loadSession();
    if (!session) return;
    // Evita duplicatas
    if (hasEvent(session, name)) return;
    session.events.push({ name, time: now() });
    saveSession(session);
}

// ─── Labels legíveis ─────────────────────────────────────────────────────────
const EVENT_LABELS: Record<EventName, string> = {
    page_open: '👁️ Abriu a página',
    saw_pricing: '💰 Viu a seção de preços',
    scrolled_to_end: '📜 Chegou ao final da página',
    cta_whatsapp_click: '📱 Clicou no botão WhatsApp (Agendar Reunião)',
    cta_form_submit: '✅ Enviou o formulário de Aceite da Proposta',
};

// ─── Envio para Telegram ─────────────────────────────────────────────────────
async function sendReport(session: SessionData, isAuto = false): Promise<void> {
    if (session.events.length === 0) return;

    const header = isAuto
        ? `📊 *Relatório Automático — ${session.openDate}*`
        : `📊 *Relatório Final da Sessão — ${session.openDate}*`;

    const location = `📍 *Localização:* ${session.city}, ${session.region} — ${session.country}`;
    const openInfo = `🕐 *Hora de abertura:* ${session.openTime}`;
    const eventLines = session.events.map(e => `• ${EVENT_LABELS[e.name]} *(${e.time})*`).join('\n');

    const text = [
        `🔔 *Landing Page Mega Tecnologia*`,
        ``,
        header,
        ``,
        location,
        openInfo,
        ``,
        `📋 *Eventos registrados:*`,
        eventLines,
    ].join('\n');

    try {
        await fetch(TELEGRAM_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text,
                parse_mode: 'Markdown',
            }),
        });

        // Atualiza timestamp do último envio
        session.reportSentAt = Date.now();
        saveSession(session);
    } catch (err) {
        console.warn('[Tracker] Falha ao enviar para API:', err);
    }
}

// ─── Geolocalização via IP ───────────────────────────────────────────────────
async function fetchLocation(): Promise<{ city: string; region: string; country: string }> {
    try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        return {
            city: data.city || 'Desconhecida',
            region: data.region || '',
            country: data.country || '',
        };
    } catch {
        return { city: 'Desconhecida', region: '', country: '' };
    }
}

// ─── Hook Principal ───────────────────────────────────────────────────────────
export function useTracker() {
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        async function init() {
            let session = loadSession();

            // Se não há sessão, é uma nova visita
            if (!session) {
                const loc = await fetchLocation();
                session = {
                    ...loc,
                    openTime: now(),
                    openDate: today(),
                    events: [],
                };
                saveSession(session);
                addEvent('page_open');
                // Envia notificação imediata de abertura para feedback instantâneo
                await sendReport(session, true);
            }

            // ── IntersectionObserver: seção de preços ───────────────────────────
            const pricingEl = document.getElementById('pricing-section');
            if (pricingEl) {
                const obs = new IntersectionObserver(
                    (entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                addEvent('saw_pricing');
                                obs.disconnect();
                            }
                        });
                    },
                    { threshold: 0.4 }
                );
                obs.observe(pricingEl);
            }

            // ── IntersectionObserver: rodapé (final da página) ──────────────────
            const footerEl = document.getElementById('page-footer');
            if (footerEl) {
                const obs = new IntersectionObserver(
                    (entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                addEvent('scrolled_to_end');
                                obs.disconnect();
                            }
                        });
                    },
                    { threshold: 0.4 }
                );
                obs.observe(footerEl);
            }

            // ── Envio automático a cada 5 horas ────────────────────────────────
            intervalRef.current = setInterval(async () => {
                const s = loadSession();
                if (s) await sendReport(s, true);
            }, REPORT_INTERVAL_MS);

            // ── Envio ao ocultar/fechar a aba ──────────────────────────────────
            const handleVisibility = async () => {
                if (document.visibilityState === 'hidden') {
                    const s = loadSession();
                    if (s) await sendReport(s, false);
                }
            };
            document.addEventListener('visibilitychange', handleVisibility);

            // ── Expõe função de debug no console ────────────────────────────────
            (window as unknown as Record<string, unknown>).__sendTrackerReport = async () => {
                const s = loadSession();
                if (s) {
                    await sendReport(s, false);
                    console.log('[Tracker] Relatório enviado manualmente.');
                } else {
                    console.warn('[Tracker] Nenhuma sessão encontrada.');
                }
            };

            return () => {
                document.removeEventListener('visibilitychange', handleVisibility);
            };
        }

        const cleanup = init();
        return () => {
            cleanup.then(fn => fn && fn());
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    // ── Envio de Proposta (Aceite) ──────────────────────────────────────────────
    async function sendProposal(data: any): Promise<void> {
        const loc = await fetchLocation();
        const text = [
            `✅ *NOVA PROPOSTA ACEITA!*`,
            ``,
            `🏢 *Empresa:* ${data.empresa}`,
            `🏠 *Endereço:* ${data.endereco}`,
            `📍 *Cidade:* ${data.cidade}`,
            `👤 *Responsável:* ${data.responsavel}`,
            `📞 *Telefone:* ${data.telefone}`,
            `📧 *E-mail:* ${data.email}`,
            ``,
            `📍 *Localização do IP:* ${loc.city}, ${loc.region} — ${loc.country}`,
            `📅 *Data:* ${today()} às ${now()}`,
        ].join('\n');

        try {
            const response = await fetch(TELEGRAM_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text,
                    parse_mode: 'Markdown',
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('[Tracker] Erro na nossa API de Telegram:', errorData);
            }
        } catch (err) {
            console.warn('[Tracker] Falha ao enviar proposta para API:', err);
        }
    }

    // ── Retorna funções para o App ───────────────────────────────────────
    return { addEvent, sendProposal };
}
