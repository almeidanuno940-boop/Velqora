export const CONTACT = {
  email: "nunoalmeida3000@gmail.com",
  phone: "+351 916 626 440",
  phoneHref: "tel:+351916626440",
  emailHref: "mailto:nunoalmeida3000@gmail.com",
};

export const NAV = [
  { label: "Início", href: "#inicio" },
  { label: "Serviços", href: "#servicos" },
  { label: "Soluções", href: "#solucoes" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Preços", href: "#precos" },
  { label: "Sobre", href: "#sobre" },
  { label: "FAQ", href: "#faq" },
  { label: "Contacto", href: "#contacto" },
];

export const HERO_FLOW = ["Novo lead", "IA", "Prioridade", "Automação", "Notificação", "Dashboard"];

export const PROBLEMS = [
  {
    title: "Leads perdidos",
    text: "Pedidos que ficam sem resposta ou chegam tarde à pessoa certa.",
  },
  {
    title: "Contactos espalhados por vários canais",
    text: "Email, telefone, formulários e redes sociais sem um registo único.",
  },
  {
    title: "Tarefas repetitivas",
    text: "Copiar dados, enviar emails iguais e atualizar folhas à mão.",
  },
  {
    title: "Dados difíceis de analisar",
    text: "Informação dispersa que não se transforma em decisões.",
  },
];

export const SERVICES = [
  {
    title: "Automação de Leads",
    desc: "Automatização da receção, organização, classificação e acompanhamento de novos contactos.",
    problem: "Pedidos dispersos ou respondidos tarde, com risco de perder oportunidades.",
    benefit: "Uma resposta mais consistente e uma visão clara dos contactos recebidos.",
    includes: [
      "Receção automática de leads",
      "Registo dos contactos",
      "Classificação",
      "Prioridade",
      "Resposta automática",
      "Notificações",
      "Acompanhamento",
    ],
    price: "Desde €149",
    cta: "Quero esta solução",
  },
  {
    title: "Automação de Processos",
    desc: "Tarefas repetitivas transformadas em workflows automáticos, com ligação às ferramentas que a empresa já utiliza.",
    problem: "Tarefas manuais repetidas entre aplicações e folhas de cálculo.",
    benefit: "Menos trabalho administrativo e informação sincronizada entre ferramentas.",
    includes: [
      "Automação de tarefas",
      "Integração entre ferramentas",
      "Google Sheets",
      "Excel",
      "Gmail",
      "Formulários",
      "Notificações",
      "Workflows personalizados",
    ],
    price: "Desde €150",
    cta: "Automatizar um processo",
  },
  {
    title: "Power BI & Data Analytics",
    desc: "Dados dispersos transformados em dashboards claros, profissionais e úteis para a tomada de decisão.",
    problem: "Dados difíceis de consolidar e indicadores demorados de consultar.",
    benefit: "Indicadores reunidos num dashboard para apoiar decisões do negócio.",
    includes: [
      "Dashboards Power BI",
      "KPIs",
      "Tratamento de dados",
      "Power Query",
      "Análise",
      "Relatórios",
      "Visualizações interativas",
    ],
    price: "Desde €199",
    cta: "Criar dashboard",
  },
  {
    title: "Automação + Power BI",
    desc: "Automação e análise de dados num sistema integrado de recolha, tratamento e visualização de informação.",
    problem: "Processos e relatórios dependentes de atualizações manuais.",
    benefit: "Dados recolhidos e apresentados num fluxo integrado de ponta a ponta.",
    includes: [
      "Automação",
      "Integração de dados",
      "Power BI",
      "Dashboards",
      "Atualização automática",
      "Indicadores",
      "Acompanhamento",
    ],
    price: "Desde €399",
    cta: "Quero a solução completa",
  },
  {
    title: "Lead Management & Automation System",
    desc: "Um sistema completo para receber, analisar, classificar e acompanhar leads automaticamente.",
    problem: "Falta de visibilidade sobre a prioridade, estado e próximo passo de cada lead.",
    benefit: "Um processo organizado de qualificação e acompanhamento de contactos.",
    includes: [
      "Recolha de leads",
      "Análise por IA",
      "Identificação do serviço",
      "Identificação do interesse",
      "Lead score",
      "Prioridade",
      "Pipeline",
      "Follow-up",
      "Notificações",
      "Power BI",
      "Relatórios",
    ],
    flow: [
      "Formulário",
      "Automação",
      "IA",
      "Base de dados",
      "Lead Score",
      "Prioridade",
      "Email automático",
      "Follow-up",
      "Dashboard",
    ],
    price: "Desde €399",
    note: "Preço final definido de acordo com a complexidade e necessidades da empresa.",
    cta: "Ver demonstração",
    featured: true,
  },
  {
    title: "Automação Personalizada",
    desc: "Automação à medida para processos empresariais que não encaixam numa solução standard.",
    problem: "Processos específicos que não são cobertos por soluções standard.",
    benefit: "Um workflow desenhado em função das ferramentas e necessidades do negócio.",
    includes: [
      "Integrações",
      "Processos administrativos",
      "Tratamento de dados",
      "Notificações",
      "Sistemas internos",
      "Workflows personalizados",
    ],
    price: "Orçamento personalizado",
    cta: "Falar sobre o meu processo",
  },
] as const;

export const SECTORS = [
  {
    title: "Imobiliárias",
    items: [
      "Automatizar novos leads",
      "Respostas iniciais",
      "Acompanhamento",
      "Organização de contactos",
    ],
  },
  {
    title: "Clínicas",
    items: ["Pedidos de informação", "Contactos", "Marcações", "Organização dos pedidos"],
  },
  {
    title: "Construção e Engenharia",
    items: [
      "Pedidos de orçamento",
      "Novos projetos",
      "Acompanhamento de clientes",
      "Organização de informação",
    ],
  },
  {
    title: "Arquitetura",
    items: ["Pedidos de projeto", "Contactos", "Acompanhamento", "Organização de oportunidades"],
  },
  { title: "Oficinas", items: ["Pedidos", "Orçamentos", "Contactos", "Notificações"] },
  {
    title: "Empresas de Serviços",
    items: ["Leads", "Processos administrativos", "Relatórios", "Dashboards"],
  },
];

export const DEMO_STEPS = [
  "Cliente preenche formulário",
  "Dados são registados automaticamente",
  "IA analisa o pedido",
  "Serviço é identificado",
  "Interesse é classificado",
  "Prioridade é definida",
  "Lead Score é calculado",
  "É enviada uma resposta automática",
  "A empresa recebe uma notificação",
  "O lead entra no pipeline",
  "É definido o próximo follow-up",
  "Os dados aparecem no Power BI",
];

export const STEPS = [
  { title: "Analisamos", text: "Percebemos como funciona atualmente o seu processo." },
  { title: "Identificamos", text: "Encontramos tarefas repetitivas e oportunidades de automação." },
  { title: "Construímos", text: "Desenvolvemos o workflow adequado ao seu negócio." },
  {
    title: "Implementamos",
    text: "Ligamos as ferramentas e colocamos a solução em funcionamento.",
  },
  { title: "Acompanhamos", text: "Ajustamos e melhoramos a solução conforme necessário." },
];

export const TOOLS = [
  "Make",
  "OpenAI",
  "Power BI",
  "Excel",
  "Power Query",
  "SQL",
  "Google Sheets",
  "Gmail",
  "Google Forms",
];

export const PLANS = [
  {
    name: "Automação de Leads",
    price: "Desde €149",
    ideal: "Empresas que querem automatizar a receção e resposta inicial aos novos contactos.",
    includes: [
      "Formulário",
      "Registo automático",
      "Email automático",
      "Notificação",
      "Configuração",
    ],
    service: "Automação de Leads",
  },
  {
    name: "Power BI",
    price: "Desde €199",
    ideal: "Empresas que querem transformar dados em dashboards profissionais.",
    includes: [
      "Tratamento de dados",
      "Power Query",
      "Dashboard",
      "KPIs",
      "Filtros",
      "Visualizações",
    ],
    service: "Power BI & Data Analytics",
  },
  {
    name: "Automação + Dashboard",
    price: "Desde €399",
    ideal: "Empresas que querem um sistema completo, da entrada do lead à análise.",
    includes: [
      "Automação",
      "IA",
      "Gestão de leads",
      "Base de dados",
      "Follow-up",
      "Power BI",
      "Notificações",
    ],
    service: "Automação + Power BI",
    featured: true,
  },
];

export const FAQS = [
  {
    q: "Trabalham apenas com empresas de uma região?",
    a: "Não. A Velqora tem base em Portugal e pode desenvolver e acompanhar soluções remotamente para empresas em diferentes regiões.",
  },
  {
    q: "Preciso de mudar os programas que já utilizo?",
    a: "Não necessariamente. O objetivo é aproveitar as ferramentas que a empresa já utiliza e automatizar o processo entre elas sempre que possível.",
  },
  {
    q: "Quanto custa uma automação?",
    a: "Os projetos começam em €149 para automações simples. O preço final depende da complexidade e integrações necessárias.",
  },
  {
    q: "Quanto tempo demora a implementação?",
    a: "O prazo depende da solução. Projetos simples podem ser implementados rapidamente, enquanto sistemas personalizados podem exigir mais trabalho.",
  },
  {
    q: "Podem integrar IA?",
    a: "Sim. A inteligência artificial pode ser utilizada para classificar informação, resumir pedidos, organizar leads e automatizar determinadas tarefas.",
  },
  {
    q: "Fazem dashboards Power BI?",
    a: "Sim. Criamos dashboards Power BI adaptados aos indicadores e necessidades da empresa.",
  },
  { q: "Existe manutenção?", a: "Sim. Pode ser contratado acompanhamento e manutenção mensal." },
];

export const SERVICE_OPTIONS = [
  "Automação de Leads",
  "Automação de Processos",
  "Power BI & Data Analytics",
  "Automação + Power BI",
  "Lead Management & Automation System",
  "Automação Personalizada",
  "Outro",
];
