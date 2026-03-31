/// <reference types="vite/client" />
import { useEffect, useRef } from 'react';

// ─── Configuração ────────────────────────────────────────────────────────────
// Production Tracking via Hostinger PHP Proxy
// A integração com Telegram é feita de forma segura no backend (PHP).
// FormSubmit.co é usado para backup via e-mail.

const LOG_INTERVAL_MS = 60 * 1000;
const NOTIFY_ENDPOINT = '/api/notify.php';

// ─── Tipos ───────────────────────────────────────────────────────────────────
type EventName =
    | 'page_open'
    | 'saw_pricing'
    | 'scrolled_to_end'
    | 'cta_whatsapp_click'
    | 'cta_form_submit';

interface TrackedEvent {
    name: EventName;
    time: string;
}

interface SessionData {
    city: string;
    region: string;
    country: string;
    openTime: string;
    openDate: string;
    events: TrackedEvent[];
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
    if (hasEvent(session, name)) return;
    session.events.push({ name, time: now() });
    saveSession(session);
}

function logSession(session: SessionData, label: string): void {
    console.log(`[Tracker] ${label}`);
    console.log(`  Visitante de: ${session.city}, ${session.region}, ${session.country}`);
    console.log(`  Aberto às: ${session.openTime} de ${session.openDate}`);
    console.log(`  Eventos (${session.events.length}):`);
    session.events.forEach(e => console.log(`    - ${e.name} (${e.time})`));
}

// ─── Labels legíveis ─────────────────────────────────────────────────────────
const EVENT_LABELS: Record<EventName, string> = {
    page_open: 'Abriu a página',
    saw_pricing: 'Viu a seção de preços',
    scrolled_to_end: 'Chegou ao final da página',
    cta_whatsapp_click: 'Clicou no botão WhatsApp',
    cta_form_submit: 'Enviou o formulário de Aceite',
};

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
                logSession(session, 'Nova sessão iniciada');
            }

            const pricingEl = document.getElementById('pricing-section');
            if (pricingEl) {
                const obs = new IntersectionObserver(
                    (entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                addEvent('saw_pricing');
                                const s = loadSession();
                                if (s) logSession(s, 'Evento: viu preços');
                                obs.disconnect();
                            }
                        });
                    },
                    { threshold: 0.4 }
                );
                obs.observe(pricingEl);
            }

            const footerEl = document.getElementById('page-footer');
            if (footerEl) {
                const obs = new IntersectionObserver(
                    (entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                addEvent('scrolled_to_end');
                                const s = loadSession();
                                if (s) logSession(s, 'Evento: chegou ao final');
                                obs.disconnect();
                            }
                        });
                    },
                    { threshold: 0.4 }
                );
                obs.observe(footerEl);
            }

            intervalRef.current = setInterval(() => {
                const s = loadSession();
                if (s && s.events.length > 0) logSession(s, 'Relatório automático');
            }, LOG_INTERVAL_MS);

            (window as unknown as Record<string, unknown>).__sendTrackerReport = () => {
                const s = loadSession();
                if (s) {
                    logSession(s, 'Relatório manual solicitado');
                } else {
                    console.warn('[Tracker] Nenhuma sessão encontrada.');
                }
            };

            return () => {
                if (intervalRef.current) clearInterval(intervalRef.current);
            };
        }

        const cleanup = init();
        return () => {
            cleanup.then(fn => fn && fn());
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    async function sendProposal(data: any): Promise<void> {
        const session = loadSession();
        const payload = {
            ...data,
            ...(session ? { 
                localizacao: `${session.city}, ${session.region}, ${session.country}`,
                sessao_aberta: session.openTime
            } : {}),
            visto_precos: session ? hasEvent(session, 'saw_pricing') : false,
            chegou_ao_fim: session ? hasEvent(session, 'scrolled_to_end') : false
        };

        console.log('[Tracker] Enviando proposta via proxy...', payload);

        try {
            await fetch(NOTIFY_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } catch (err) {
            console.error('[Tracker] Erro ao enviar notificação para Telegram via PHP:', err);
        }
    }

    return { addEvent, sendProposal };
}
