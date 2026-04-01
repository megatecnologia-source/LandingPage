import React, { useState } from 'react';
import { useTracker } from './useTracker';
import {
  CheckCircle2,
  Clock,
  Users,
  BarChart3,
  ShieldCheck,
  Smartphone,
  MessageCircle,
  ChevronRight,
  Menu,
  X,
  Send,
  Activity,
  ShieldAlert,
  Ticket,
  Settings,
  Monitor,
  Megaphone,
  ClipboardList,
  ChevronDown,
  Headset,
  RefreshCw,
  Wrench,
  UserCheck,
  DollarSign,
  Calendar,
  FileText,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const { addEvent, sendProposal } = useTracker();

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const handleWhatsAppClick = () => {
    addEvent('cta_whatsapp_click');
  };

  const desafios = [
    { title: "Filas desorganizadas", desc: "Falta de controle e organização na formação de filas, gerando confusão e insatisfação.", icon: <Users className="w-8 h-8" /> },
    { title: "Longos tempos de espera", desc: "Cidadãos aguardam por períodos excessivos sem previsão de atendimento.", icon: <Clock className="w-8 h-8" /> },
    { title: "Dificuldade de controle do fluxo", desc: "Impossibilidade de monitorar e gerenciar o volume de atendimentos em tempo real.", icon: <Activity className="w-8 h-8" /> },
    { title: "Falta de priorização automática", desc: "Atendimento preferencial depende de identificação manual, sem automação.", icon: <ShieldAlert className="w-8 h-8" /> }
  ];

  const etapas = [
    { step: "01", title: "Emissão de Senha", desc: "Cidadão emite a senha pelo terminal", icon: <Ticket className="w-6 h-6" /> },
    { step: "02", title: "Organização Automática", desc: "Sistema organiza automaticamente a fila", icon: <Settings className="w-6 h-6" /> },
    { step: "03", title: "Exibição no Painel", desc: "Senha exibida no painel eletrônico", icon: <Monitor className="w-6 h-6" /> },
    { step: "04", title: "Chamada para Atendimento", desc: "Cidadão é chamado para atendimento", icon: <Megaphone className="w-6 h-6" /> },
    { step: "05", title: "Registro e Controle", desc: "Registro e controle do atendimento", icon: <ClipboardList className="w-6 h-6" /> }
  ];

  const escopo = [
    "Levantamento técnico e planejamento",
    "Projeto de implantação",
    "Instalação de equipamentos",
    "Configuração do sistema",
    "Parametrização do atendimento",
    "Testes operacionais",
    "Treinamento da equipe",
    "Implantação assistida"
  ];

  const equipamentos = [
    { item: "Computador Completo para Atendimento", desc: "Computador destinado aos guichês de atendimento para operação do sistema.", qtd: "03 unidades" },
    { item: "Servidor de computador", desc: "Equipamento responsável pelo gerenciamento central do sistema.", qtd: "01 unidade" },
    { item: "Impressora Térmica", desc: "Utilizada para emissão das senhas de atendimento.", qtd: "01 unidade" },
    { item: "Mini computador", desc: "Equipamento responsável pelo controle do painel de chamadas.", qtd: "01 unidade" },
    { item: "Smart TV", desc: "Tela utilizada para exibição das senhas de chamadas.", qtd: "01 unidade" },
    { item: "No-Break", desc: "Equipamento de proteção elétrica que garante o funcionamento em caso de queda de energia.", qtd: "01 unidade" }
  ];

  const suporte = [
    { title: "Monitoramento do sistema", icon: <Monitor className="w-6 h-6" /> },
    { title: "Suporte técnico remoto", icon: <Headset className="w-6 h-6" /> },
    { title: "Atualizações do sistema", icon: <RefreshCw className="w-6 h-6" /> },
    { title: "Manutenção preventiva", icon: <Wrench className="w-6 h-6" /> },
    { title: "Suporte operacional aos usuários", icon: <UserCheck className="w-6 h-6" /> }
  ];

  const beneficios = [
    { title: "Redução de filas", icon: <Users className="w-8 h-8 text-brand-light" /> },
    { title: "Atendimento mais rápido", icon: <Clock className="w-8 h-8 text-brand-light" /> },
    { title: "Cumprimento da legislação de prioridade", icon: <ShieldCheck className="w-8 h-8 text-brand-light" /> },
    { title: "Organização do atendimento", icon: <BarChart3 className="w-8 h-8 text-brand-light" /> },
    { title: "Melhor experiência para o cidadão", icon: <Smartphone className="w-8 h-8 text-brand-light" /> },
    { title: "Maior eficiência administrativa", icon: <Activity className="w-8 h-8 text-brand-light" /> }
  ];

  const investimento = [
    { title: "Fornecimento de Equipamentos", desc: "Hardware completo para o sistema (Opcional)", price: "R$ 12.098,75" },
    { title: "Serviço de Implantação", desc: "Implantação e configuração de todos os equipamentos", price: "R$ 3.800,00" },
    { title: "Contrato Mensal de Suporte", desc: "Manutenção, suporte e atualizações", price: "R$ 1.500,00", extra: "mensais" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[120px]">
            <div className="flex items-center gap-3">
              <img
                src="https://res.cloudinary.com/dplhygs4v/image/upload/v1772912453/1_oefzgj.png"
                alt="Logo da Mega Tecnologia"
                className="h-[100px] w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="https://wa.me/5598983444737"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
                className="px-5 py-2.5 bg-brand-primary text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/20"
              >
                Agendar Reunião
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="pt-[120px]">
        {/* 1️⃣ HERO SECTION */}
        <section className="py-12 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <h1 className="text-2xl lg:text-3xl font-black text-brand-dark leading-tight mb-6 uppercase tracking-tight">
                  Sistema Inteligente de Gerenciamento de Senhas para Modernizar o <span className="text-brand-primary">Atendimento ao Cidadão</span>
                </h1>
                <p className="text-base lg:text-lg text-slate-600 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Organize as filas, reduza o tempo de espera e garanta prioridade legal com um sistema completo, seguro e desenvolvido para ambientes que buscam agilizar o atendimento e melhorar a experiência do público.
                </p>
                <div className="flex flex-col items-center lg:items-start">
                  <ul className="space-y-3 mb-10 text-left">
                    {[
                      "Modernização imediata",
                      "Atendimento mais humano",
                      "Operação mais eficiente"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="https://wa.me/5598983444737"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleWhatsAppClick}
                    className="hidden lg:inline-flex items-center gap-3 px-8 py-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-dark transition-all shadow-xl shadow-brand-primary/20 group"
                  >
                    Agendar Reunião
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://res.cloudinary.com/dplhygs4v/image/upload/v1773162594/unnamed_1_xj2ka9.jpg"
                  alt="Sistema SGA Tuntun Mega"
                  className="rounded-2xl shadow-2xl object-cover aspect-[4/3] w-full"
                  referrerPolicy="no-referrer"
                />
                {/* Botão para Mobile - Abaixo da imagem */}
                <div className="mt-8 flex justify-center lg:hidden">
                  <a
                    href="https://wa.me/5598983444737"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleWhatsAppClick}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-dark transition-all shadow-xl shadow-brand-primary/20 group"
                  >
                    Agendar Reunião
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2️⃣ APRESENTAÇÃO DA PROPOSTA */}
        <section className="py-20 bg-slate-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="w-full">
                <h2 className="text-3xl font-bold text-brand-dark mb-8 break-words">Apresentação da Proposta</h2>
                <div className="space-y-6 text-slate-600 leading-relaxed">
                  <p>
                    Apresentamos a proposta para implantação de um <strong>Sistema de Gerenciamento de Senhas</strong> com objetivo de organizar, agilizar e modernizar o fluxo de atendimento da Secretaria de Ação Social.
                  </p>
                  <p>
                    A solução permitirá o controle eficiente do atendimento ao público, garantindo organização das filas, priorização automática conforme legislação vigente e maior transparência no processo de atendimento aos cidadãos.
                  </p>
                  <p>
                    Além da implantação tecnológica, a proposta inclui serviços especializados de instalação, configuração, treinamento e suporte contínuo.
                  </p>
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://res.cloudinary.com/dplhygs4v/image/upload/v1772912453/IMAGEM_3_tuwxjn.png"
                  alt="Apresentação da Proposta"
                  className="rounded-2xl shadow-xl object-cover w-full aspect-video"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 3️⃣ DESAFIOS COMUNS */}
        <section className="py-20 bg-brand-dark text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-16">Desafios comuns no atendimento ao público</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {desafios.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center">
                  <div className="mb-6 text-brand-light">{item.icon}</div>
                  <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                  <p className="text-sm text-white/80 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5️⃣ COMO O SISTEMA FUNCIONA */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-brand-dark mb-16">Como o Sistema Funciona</h2>
            <div className="flex flex-wrap justify-center gap-8 lg:gap-0 lg:justify-between items-start relative">
              {/* Connector line for desktop */}
              <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-slate-200 -z-10"></div>

              {etapas.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center w-48 relative">
                  <div className="w-12 h-12 bg-brand-primary text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-brand-primary/20">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest mb-2">Etapa {item.step}</span>
                  <h3 className="text-sm font-bold text-brand-dark mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6️⃣ ESCOPO TÉCNICO */}
        <section className="py-24 bg-white relative overflow-hidden">
          {/* Watermark Background - Refined for optimal coherence and alignment */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
            <img
              src="https://res.cloudinary.com/dplhygs4v/image/upload/v1772912453/5_x3ylrc.png"
              alt="Watermark"
              className="h-[70%] w-auto object-contain opacity-40"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h2 className="text-3xl font-bold text-brand-dark mb-12 text-center">Escopo Técnico da Implantação</h2>
            <div className="space-y-3">
              {escopo.map((item, idx) => (
                <div key={idx} className="border border-slate-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-6 h-6 bg-brand-primary/10 text-brand-primary text-xs font-bold rounded flex items-center justify-center">{idx + 1}</span>
                      <span className="text-sm font-bold text-slate-700">{item}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeAccordion === idx ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeAccordion === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-white p-5 border-t border-slate-100"
                      >
                        <p className="text-sm text-slate-500 leading-relaxed">
                          Detalhamento técnico da etapa de {item.toLowerCase()}, garantindo que todos os requisitos da secretaria sejam atendidos conforme o planejamento inicial.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7️⃣ SUPORTE TÉCNICO */}
        <section className="py-20 bg-brand-primary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Suporte Técnico e Manutenção Contínua</h2>
            <p className="text-white/80 mb-16 max-w-2xl mx-auto">O sistema possui contrato mensal para garantir estabilidade operacional e atendimento contínuo às necessidades da secretaria.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {suporte.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-xs font-bold leading-tight">{item.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8️⃣ BENEFÍCIOS DA IMPLANTAÇÃO */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-brand-dark mb-16">Benefícios da Implantação</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {beneficios.map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="p-8 bg-brand-dark rounded-2xl border border-white/10 shadow-xl shadow-brand-dark/20 group transition-all"
                >
                  <div className="flex justify-center mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">{item.title}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 9️⃣ EQUIPAMENTOS NECESSÁRIOS */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-brand-dark mb-4">Equipamentos Necessários</h2>
            <p className="text-slate-500 mb-12">A implantação do sistema requer os seguintes equipamentos para garantir o funcionamento completo da solução.</p>

            <div className="grid lg:grid-cols-3 gap-12 items-start">
              <div className="lg:col-span-2 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-brand-dark text-white">
                      <th className="p-4 text-xs font-bold uppercase tracking-wider rounded-tl-xl">Equipamento</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider">Descrição</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-center rounded-tr-xl">Quantidade</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {equipamentos.map((eq, idx) => (
                      <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="p-4 text-xs font-bold text-brand-dark">{eq.item}</td>
                        <td className="p-4 text-xs text-slate-500">{eq.desc}</td>
                        <td className="p-4 text-xs text-slate-700 text-center font-medium">{eq.qtd}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-slate-200 rounded-2xl aspect-square overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800"
                  alt="Equipamentos"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 🔟 INVESTIMENTO */}
        <section id="pricing-section" className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-brand-dark mb-4 text-center">Investimento</h2>
            <p className="text-slate-500 mb-16 text-center max-w-2xl mx-auto">Valores competitivos para a modernização completa do atendimento na secretaria.</p>
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {investimento.map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="p-10 rounded-[2.5rem] bg-brand-dark text-white border border-white/10 shadow-2xl shadow-brand-dark/30 flex flex-col items-center text-center transition-all relative group overflow-hidden"
                >
                  {/* Decorative element */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-primary/10 rounded-full blur-3xl group-hover:bg-brand-primary/20 transition-colors"></div>

                  <div className="w-16 h-16 rounded-2xl bg-white/10 text-brand-light flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <DollarSign className="w-8 h-8" />
                  </div>

                  <h3 className="text-xl font-bold mb-4 text-white tracking-tight">{item.title}</h3>
                  <p className="text-sm mb-10 leading-relaxed text-white/60 max-w-[200px]">{item.desc}</p>

                  <div className="mt-auto w-full pt-8 border-t border-white/10">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-light/60 block mb-2">Valor Estimado</span>
                    <p className="text-[28px] font-black text-brand-light tracking-tighter">{item.price}</p>
                    {item.extra && (
                      <p className="text-[10px] font-bold uppercase tracking-widest mt-3 text-white/40">
                        {item.extra}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 1️⃣1️⃣ PRAZO E GARANTIA */}
        <section className="py-24 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="flex items-start gap-6 p-8 bg-slate-50 rounded-2xl">
                <Calendar className="w-10 h-10 text-brand-primary shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-brand-dark mb-4">Prazo de Implantação</h3>
                  <p className="text-slate-600">Prazo estimado de <strong>20 dias</strong> após a entrega dos equipamentos.</p>
                </div>
              </div>
              <div className="flex items-start gap-6 p-8 bg-slate-50 rounded-2xl">
                <ShieldCheck className="w-10 h-10 text-brand-primary shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-brand-dark mb-4">Garantia</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-brand-primary rounded-full"></div> Equipamentos conforme fabricante</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-brand-primary rounded-full"></div> Serviços com garantia técnica</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-brand-primary rounded-full"></div> Suporte conforme contrato mensal</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 1️⃣2️⃣ ACEITANDO DA PROPOSTA */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-dark mb-4">Aceite da Proposta</h2>
              <p className="text-slate-500">Preencha os dados abaixo para formalizar o aceite.</p>
            </div>

            <form
              className="bg-white p-8 lg:p-12 rounded-3xl shadow-xl border border-slate-100 space-y-6"
              onSubmit={async (e) => {
                addEvent('cta_form_submit');
                e.preventDefault();
                const form = e.currentTarget;
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                const btn = form.querySelector('button');
                if (btn) btn.disabled = true;

                try {
                  console.log('[Form] Iniciando envio EXCLUSIVO de e-mail...');
                  
                  /* 
                  // 1. Notificar via Telegram (Desativado temporariamente para testes de E-mail)
                  try {
                    const telRes = await sendProposal(data);
                    console.log('[Form] Telegram: Ok');
                  } catch (e) {
                    console.warn('[Form] Notificação via Telegram ignorada nos testes.', e);
                  }
                  */

                  // 2. Enviar E-mail via PROXY INTERNO (Mais confiável e sem CORS)
                  console.log('[Form] Enviando e-mail pelo seu servidor Hostinger...');
                  const emailRes = await fetch("/api/send_email.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      _subject: "🚀 NOVA PROPOSTA ACEITA - SGA TUNTUM",
                      ...data
                    }),
                  });

                  const emailData = await emailRes.json();

                  if (!emailRes.ok) {
                    throw new Error(emailData.error || 'O servidor Hostinger recusou o envio.');
                  }

                  alert('Proposta enviada com sucesso! Recebemos seus dados e entraremos em contato em breve.');
                  form.reset();
                } catch (error: any) {
                  console.error('[Form] Erro crítico no envio:', error);
                  alert(`Ocorreu um erro no servidor: ${error.message}\n\nPor favor, tente novamente ou entre em contato via WhatsApp.`);
                } finally {
                  if (btn) btn.disabled = false;
                }
              }}
            >
              <p className="hidden">
                <label>Don't fill this out if you're human: <input name="bot-field" /></label>
              </p>
              <div className="space-y-6 overflow-hidden">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Empresa</label>
                  <input name="empresa" type="text" required placeholder="Nome da empresa" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Endereço</label>
                  <input name="endereco" type="text" placeholder="Endereço completo" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Cidade</label>
                    <input name="cidade" type="text" placeholder="Sua cidade" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Responsável</label>
                    <input name="responsavel" type="text" required placeholder="Nome completo" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Telefone</label>
                    <input name="telefone" type="tel" required placeholder="(00) 00000-0000" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
                    <input name="email" type="email" required placeholder="seu@email.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Observação</label>
                  <textarea name="observacao" rows={4} placeholder="Digite uma mensagem ou observação..." className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 resize-none"></textarea>
                </div>

                <button type="submit" className="w-full py-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/20 disabled:opacity-50 disabled:cursor-not-allowed">
                  Aprovar Proposta
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="page-footer" className="py-2 bg-brand-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex flex-col items-center gap-1">
              <img
                src="https://res.cloudinary.com/dplhygs4v/image/upload/v1772912787/Logo_branco_axcmhw.png"
                alt="Logo da Mega Tecnologia (Branco)"
                className="h-[180px] w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="mb-1 text-xl font-bold text-brand-light/90 flex items-center gap-2">
              <Phone className="w-5 h-5" /> (98) 9 8344-4737
            </div>
            <div className="pt-2 border-t border-white/5 w-full text-center text-[10px] text-white/40 uppercase tracking-widest">
              © 2026 Mega Tecnologia. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/5598983444737"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform group"
      >
        <MessageCircle className="w-7 h-7 fill-current" />
      </a>
    </div>
  );
};

export default App;
