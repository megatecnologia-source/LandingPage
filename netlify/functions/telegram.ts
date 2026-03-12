import { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
    // Logs para o painel do Netlify (Functions > Logs)
    console.log('--- Nova requisição recebida na function telegram ---');
    console.log('Método:', event.httpMethod);

    // Pegar o token e chat_id das variáveis privadas
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
        console.error('ERRO: Variáveis TELEGRAM_BOT_TOKEN ou TELEGRAM_CHAT_ID não encontradas.');
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Configuração ausente no Netlify.',
                details: 'Verifique se você cadastrou TELEGRAM_BOT_TOKEN e TELEGRAM_CHAT_ID (sem o VITE_).'
            }),
        };
    }

    // Suporte a um "Ping" rápido para teste via navegador
    if (event.httpMethod === 'GET') {
        return {
            statusCode: 200,
            body: JSON.stringify({
                status: 'ok',
                message: 'A API está online e pronta para receber POST.',
                bot_configured: !!BOT_TOKEN,
                chat_configured: !!CHAT_ID
            }),
        };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Somente POST é permitido' };
    }

    try {
        const payload = JSON.parse(event.body || '{}');
        console.log('Enviando para Telegram...');

        // No Node 18, o fetch é global. Mas vamos garantir o tratamento do erro.
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: payload.text,
                parse_mode: payload.parse_mode || 'Markdown',
            }),
        });

        const data = await response.json();
        if (!data.ok) {
            console.error('Erro na API do Telegram:', data.description);
        } else {
            console.log('Resposta do Telegram: Sucesso');
        }

        return {
            statusCode: response.status,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };
    } catch (error: any) {
        console.error('Erro interno na function:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};

export { handler };
