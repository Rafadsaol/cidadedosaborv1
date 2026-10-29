import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown, ArrowRight, ArrowUpRight, Check, Code2, Flame,
  Layers3, LayoutDashboard, MousePointer2, ShieldCheck, Smartphone,
} from "lucide-react";
import { Logo } from "@/components/layout/header";
import styles from "./case-study.module.css";

export const metadata: Metadata = {
  title: "Case study — Cidade do Sabor",
  description: "Da identidade gastronômica à operação demonstrativa: conheça o design, as telas reais e o desenvolvimento frontend da Cidade do Sabor V3.",
};

const sections = [
  ["visao-geral", "Visão geral"], ["identidade", "Identidade"],
  ["telas", "Telas"], ["recursos", "Recursos"],
  ["tecnologias", "Tecnologias"], ["experiencia", "Experiência"],
  ["demonstracao", "Demonstração"],
];
const screens = [
  { file: "cardapio-desktop", title: "Um cardápio para explorar.", description: "Busca, categorias e ordenação colocam os sabores no centro da experiência.", alt: "Cardápio real com busca, categorias e cards de hambúrgueres", route: "/cardapio", label: "Cardápio" },
  { file: "personalizacao-desktop", title: "Cada escolha tem seu espaço.", description: "O diálogo de personalização reúne ingredientes, adicionais e cálculo de preço.", alt: "Diálogo real de Cidade Original com os ingredientes e a personalização do produto", route: "/cardapio", label: "Personalização" },
  { file: "checkout-desktop", title: "Um caminho até a confirmação.", description: "Delivery ou retirada, validação de campos e resumo dos valores de teste.", alt: "Checkout real com dados demonstrativos, opções de recebimento e resumo do pedido", route: "/checkout", label: "Checkout local" },
  { file: "pedidos-desktop", title: "O outro lado do pedido.", description: "Pedidos de exemplo, etapas, filtros e ações de gestão no painel administrativo.", alt: "Gestão real de pedidos demonstrativos com filtros, status e ações para o administrador", route: "/admin/pedidos", label: "Gestão de pedidos" },
  { file: "painel-desktop", title: "A operação ganha uma visão completa.", description: "Dashboard com indicadores e gráficos derivados dos pedidos locais. Os números desta captura são dados fictícios de exemplo.", alt: "Dashboard real do administrador com indicadores e gráficos de pedidos fictícios", route: "/admin", label: "Painel demonstrativo" },
];
const features = [
  { Icon: MousePointer2, title: "Escolher e personalizar", text: "Pesquisa sem acentos, filtros, ordenação, retirada de ingredientes, adicionais e montagem de combos." },
  { Icon: Layers3, title: "Montar e acompanhar", text: "Carrinho persistido, preços em centavos, checkout local, histórico de pedidos e atualização de status entre abas da mesma origem." },
  { Icon: LayoutDashboard, title: "Explorar a operação", text: "Gestão local de produtos, disponibilidade, pedidos e reservas. Relatórios calculados a partir dos dados de demonstração." },
];
const technologies = [
  ["Next.js · App Router", "Rotas, layouts compartilhados, metadados e otimização de imagens."],
  ["React + TypeScript", "Componentes, tipos de domínio e estado compartilhado com Context."],
  ["Tailwind CSS 4 + CSS", "Identidade visual, composição das telas e adaptação aos diferentes tamanhos."],
  ["Lucide React + Fontsource", "Ícones e fontes Poppins e Inter distribuídas localmente."],
  ["localStorage + sessionStorage", "Dados de teste no navegador e preferência de animação por sessão."],
  ["SVG + Web Animations API", "Gráficos locais com tabelas acessíveis e transições da vitrine."],
  ["Playwright + axe-core", "Verificações de fluxos, responsividade e acessibilidade automatizada."],
  ["ESLint + npm", "Análise de código, dependências e scripts de desenvolvimento e build."],
];
const demos = [
  { href: "/", number: "01", title: "Conheça a loja", text: "Comece pela vitrine e explore a identidade da marca.", label: "Abrir o site" },
  { href: "/cardapio", number: "02", title: "Monte sua combinação", text: "Personalize um produto, adicione ao carrinho e experimente o checkout.", label: "Explorar cardápio" },
  { href: "/login", number: "03", title: "Escolha seu perfil", text: "Cliente Teste ou Administrador Demo. Dois acessos prontos, sem senha.", label: "Escolher perfil demo" },
  { href: "/admin", number: "04", title: "Assuma o balcão", text: "Se necessário, selecione o perfil Administrador Demo na tela de acesso.", label: "Abrir painel demo" },
];

function SectionLabel({ number, children }: { number: string; children: React.ReactNode }) {
  return <p className={styles.sectionLabel}><span>{number}</span>{children}</p>;
}

export default function CaseStudyPage() {
  return (
    <div className={styles.caseStudy} id="case-top">
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Logo />
          <nav className={styles.navigation} aria-label="Seções do case study">
            {sections.map(([id, label]) => <a href={`#${id}`} key={id}>{label}</a>)}
          </nav>
          <Link href="/" className={styles.headerAction}>Abrir site <ArrowUpRight size={15} /></Link>
        </div>
      </header>

      <section className={`${styles.container} ${styles.hero}`} aria-labelledby="case-title">
        <div className={styles.heroTopline}><span><span className={styles.dot} /> PORTFÓLIO / CASE STUDY</span><span>DESIGN & DESENVOLVIMENTO FRONTEND</span></div>
        <div className={styles.heroIntro}>
          <div>
            <p className={styles.eyebrow}>GASTRONOMIA · EXPERIÊNCIA DIGITAL</p>
            <h1 id="case-title">Cidade<br />do Sabor<span>.</span></h1>
            <p className={styles.heroDescription}>Uma identidade que abre o apetite.<br />Uma experiência que vai além do cardápio.</p>
            <div className={styles.heroActions}>
              <Link href="/" className={styles.primaryButton}>Explorar o projeto <ArrowUpRight size={18} /></Link>
              <a href="#telas" className={styles.textLink}>Ver as telas <ArrowDown size={16} /></a>
            </div>
          </div>
          <div className={styles.projectSummary}>
            <span className={styles.projectMark} aria-hidden="true"><Flame size={36} /></span>
            <p>Da primeira impressão à gestão do pedido: um projeto de frontend para uma hamburgueria fictícia com personalidade própria.</p>
            <dl>
              <div><dt>Projeto</dt><dd>Loja + painel administrativo</dd></div>
              <div><dt>Entregas</dt><dd>Interface, interação e desenvolvimento</dd></div>
              <div><dt>Versão apresentada</dt><dd>V3 · demonstração local</dd></div>
            </dl>
          </div>
        </div>
        <figure className={styles.heroFigure}>
          <div className={styles.screenToolbar}><span aria-hidden="true"><i /><i /><i /></span><span>CIDADE DO SABOR / INÍCIO</span><span>DESKTOP</span></div>
          <Image src="/images/case-study/inicio-desktop.webp" alt="Página inicial real da Cidade do Sabor com hambúrguer em camadas, vitrine interativa e cabeçalho da marca" width={1440} height={1000} sizes="(max-width: 760px) 94vw, 1240px" quality={90} preload />
          <figcaption><span>O primeiro contato com a cidade.</span><span>Captura real da interface · V3</span></figcaption>
        </figure>
      </section>

      <section className={`${styles.container} ${styles.section}`} id="visao-geral" aria-labelledby="overview-title">
        <SectionLabel number="01">VISÃO GERAL</SectionLabel>
        <div className={styles.editorialGrid}>
          <h2 id="overview-title">Da vontade de provar<br />à experiência de <em>explorar.</em></h2>
          <div className={styles.prose}>
            <p>A Cidade do Sabor traduz uma hamburgueria artesanal fictícia em uma experiência digital: presença de marca, descoberta do cardápio e uma jornada de pedido que pode ser testada no navegador.</p>
            <p>O desenvolvimento evoluiu da apresentação da marca para a personalização de produtos e, na V3, para uma operação demonstrativa com perfis de cliente e administrador, pedidos, reservas e relatórios.</p>
            <p>O objetivo é demonstrar como design e regras de interface trabalham juntos em um produto consistente, com estados, validações e respostas às ações de quem navega.</p>
          </div>
        </div>
        <div className={styles.projectPillars}>
          {[ ["01", "Presença de marca", "Uma linguagem gastronômica expressiva, do primeiro título ao detalhe de cada card."], ["02", "Jornada do cliente", "Escolher, personalizar, revisar e acompanhar um pedido de teste."], ["03", "Visão da operação", "Explorar a rotina de uma hamburgueria por meio de um painel local." ] ].map(([n, title, text]) => <article key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className={styles.brandSection} id="identidade" aria-labelledby="identity-title">
        <div className={styles.container}>
          <SectionLabel number="02">IDENTIDADE VISUAL</SectionLabel>
          <div className={styles.sectionHeading}><h2 id="identity-title">Calor, contraste<br />e <em>personalidade.</em></h2><p>O preto e o grafite dão profundidade às imagens. O vermelho conduz as ações e o laranja traz o calor da chapa para os detalhes da marca.</p></div>
          <div className={styles.brandGrid}>
            <div className={styles.logoPanel}><span className={styles.eyebrow}>A ASSINATURA DA CASA</span><Logo /><p>Uma chama, um nome e a presença de uma marca feita para dar fome.</p></div>
            <div className={styles.typePanel}>
              <div><span className={styles.eyebrow}>TÍTULOS / POPPINS</span><strong className={styles.poppinsSample}>Sabor em<br />cada detalhe.</strong></div>
              <div><span className={styles.eyebrow}>LEITURA / INTER</span><p className={styles.interSample}>Clareza para explorar.<br />Ritmo para continuar.</p><p className={styles.typeNote}>Na vitrine inicial, o acento serifado em Georgia adiciona um contraste editorial.</p></div>
            </div>
          </div>
          <div className={styles.palette} aria-label="Paleta de cores do projeto">
            {[ ["Preto", "#181818", styles.swatchBlack], ["Vermelho", "#E34B35", styles.swatchRed], ["Laranja", "#FFB347", styles.swatchOrange], ["Branco", "#FFFFFF", styles.swatchWhite], ["Grafite", "#242424", styles.swatchGraphite] ].map(([label, hex, colorClass]) => <div className={`${styles.swatch} ${colorClass}`} key={hex}><span>{label}</span><strong>{hex}</strong></div>)}
          </div>
          <p className={styles.caption}>Imagens gastronômicas geradas por IA para a marca fictícia. As telas apresentadas a seguir são capturas reais do projeto implementado.</p>
        </div>
      </section>

      <section className={`${styles.container} ${styles.section}`} id="telas" aria-labelledby="screens-title">
        <SectionLabel number="03">GALERIA DE TELAS</SectionLabel>
        <div className={styles.sectionHeading}><h2 id="screens-title">O projeto,<br /><em>como ele é.</em></h2><p>Interfaces capturadas na aplicação em execução, com os produtos e dados fictícios da demonstração. Abra uma captura para observar os detalhes.</p></div>
        <div className={styles.gallery}>
          {screens.map((screen, index) => <figure className={`${styles.galleryCard} ${index === screens.length - 1 ? styles.galleryWide : ""}`} key={screen.file}>
            <a className={styles.captureLink} href={`/images/case-study/${screen.file}.webp`} target="_blank" rel="noopener noreferrer" aria-label={`Ampliar captura de ${screen.label} em nova aba`}>
              <Image src={`/images/case-study/${screen.file}.webp`} alt={screen.alt} width={1440} height={1000} quality={90} sizes={index === screens.length - 1 ? "(max-width: 760px) 94vw, 1240px" : "(max-width: 760px) 94vw, 600px"} />
              <span className={styles.expandCapture}>Ampliar captura <ArrowUpRight size={15} /></span>
            </a>
            <figcaption><span className={styles.eyebrow}>{String(index + 1).padStart(2, "0")} / {screen.label}</span><div><h3>{screen.title}</h3><p>{screen.description}</p></div><Link href={screen.route} aria-label={`Experimentar ${screen.label}`} className={styles.roundLink}><ArrowUpRight size={21} /></Link></figcaption>
          </figure>)}
        </div>
      </section>

      <section className={styles.featuresSection} id="recursos" aria-labelledby="features-title">
        <div className={styles.container}>
          <SectionLabel number="04">FUNCIONALIDADES</SectionLabel>
          <div className={styles.sectionHeading}><h2 id="features-title">Mais que telas.<br /><em>Uma jornada interativa.</em></h2><p>As interações abaixo estão implementadas. A operação comercial é simulada inteiramente no navegador.</p></div>
          <div className={styles.featureGrid}>{features.map(({ Icon, title, text }) => <article key={title}><Icon size={27} strokeWidth={1.5} /><h3>{title}</h3><p>{text}</p></article>)}</div>
          <div className={styles.scopePanel}><div><ShieldCheck size={24} /><h3>O alcance desta demonstração</h3></div><p>Os perfis não têm autenticação real. Pedidos, reservas, faturamento e pagamentos são fictícios. Não há backend, cobrança, envio ao restaurante ou reserva de mesa real. Os dados ficam no navegador e não são compartilhados entre computador e celular.</p><Link href="/login" className={styles.textLink}>Conhecer os perfis demo <ArrowRight size={16} /></Link></div>
          <div className={styles.secondaryFeatures}>{["Validação de formulários", "Confirmação antes de excluir", "Estados vazios e avisos", "Restauração dos exemplos"].map(item => <span key={item}><Check size={15} />{item}</span>)}</div>
        </div>
      </section>

      <section className={`${styles.container} ${styles.section}`} id="tecnologias" aria-labelledby="tech-title">
        <SectionLabel number="05">TECNOLOGIAS</SectionLabel>
        <div className={styles.editorialGrid}><div><Code2 className={styles.sectionIcon} size={33} strokeWidth={1.5} /><h2 id="tech-title">Uma base clara.<br />Detalhes <em>bem construídos.</em></h2><p className={styles.sectionLead}>Ferramentas e recursos confirmados no código, aplicados às necessidades da experiência.</p></div><dl className={styles.technologyList}>{technologies.map(([title, text], index) => <div key={title}><dt><span>{String(index + 1).padStart(2, "0")}</span>{title}</dt><dd>{text}</dd></div>)}</dl></div>
      </section>

      <section className={styles.experienceSection} id="experiencia" aria-labelledby="experience-title">
        <div className={`${styles.container} ${styles.experienceGrid}`}>
          <div className={styles.experienceCopy}>
            <SectionLabel number="06">EXPERIÊNCIA</SectionLabel>
            <Smartphone size={32} className={styles.sectionIcon} strokeWidth={1.5} />
            <h2 id="experience-title">Pensado para<br /><em>acompanhar você.</em></h2>
            <p className={styles.sectionLead}>A mesma identidade, com composição adaptada ao espaço disponível.</p>
            <ul className={styles.experienceList}>
              <li><strong>Uma navegação que se adapta.</strong><p>Menu lateral na loja e navegação recolhível no painel, com controles para toque e teclado.</p></li>
              <li><strong>Imagens com espaço para respirar.</strong><p>Produtos inteiros nos cards e dois favoritos por linha no celular, preservando a leitura e as ações.</p></li>
              <li><strong>Movimento com intenção.</strong><p>Trocas suaves na vitrine e respeito à preferência de movimento reduzido, com escolha explícita para ativar a animação.</p></li>
              <li><strong>Respostas a cada escolha.</strong><p>Foco visível, diálogos nativos, mensagens de estado e feedback nas ações da loja e do painel.</p></li>
            </ul>
          </div>
          <div className={styles.mobileGallery}>
            <figure><Image src="/images/case-study/inicio-mobile.webp" alt="Captura real da página inicial em tela de 390 pixels, com título, botões e hambúrguer adaptados ao celular" width={780} height={2000} sizes="(max-width: 760px) 44vw, 260px" quality={90} /><figcaption>Vitrine · celular</figcaption></figure>
            <figure><Image src="/images/case-study/favoritos-mobile.webp" alt="Captura real da seção de favoritos com dois cards de hambúrgueres por linha no celular" width={708} height={2056} sizes="(max-width: 760px) 44vw, 260px" quality={90} /><figcaption>Favoritos · celular</figcaption></figure>
          </div>
        </div>
      </section>

      <section className={`${styles.container} ${styles.section}`} id="demonstracao" aria-labelledby="demo-title">
        <SectionLabel number="07">DEMONSTRAÇÃO</SectionLabel>
        <div className={styles.sectionHeading}><h2 id="demo-title">Agora, a experiência<br /><em>é sua.</em></h2><p>Explore os fluxos implementados. Para testar pedidos e reservas, use somente informações fictícias.</p></div>
        <div className={styles.demoGrid}>{demos.map(demo => <Link href={demo.href} key={demo.number} className={styles.demoCard}><span className={styles.demoNumber}>{demo.number}<ArrowUpRight size={24} /></span><h3>{demo.title}</h3><p>{demo.text}</p><span className={styles.demoLink}>{demo.label} <ArrowRight size={16} /></span></Link>)}</div>
        <div className={styles.moreDemos}><span>Continue explorando</span><Link href="/meus-pedidos">Histórico de pedidos <ArrowUpRight size={14} /></Link><Link href="/reservas">Reservas de teste <ArrowUpRight size={14} /></Link><Link href="/carrinho">Carrinho <ArrowUpRight size={14} /></Link></div>
      </section>

      <section className={`${styles.container} ${styles.conclusion}`} aria-labelledby="conclusion-title">
        <SectionLabel number="08">CONCLUSÃO</SectionLabel>
        <Flame size={35} className={styles.sectionIcon} />
        <h2 id="conclusion-title">Design que dá vontade.<br />Código que dá <em>continuidade.</em></h2>
        <p>A Cidade do Sabor reúne direção visual, componentes reutilizáveis e regras de interface em uma experiência explorável. Um projeto de portfólio que demonstra atenção à apresentação, à interação e à consistência de uma aplicação frontend.</p>
        <div className={styles.conclusionBottom}><span>CIDADE DO SABOR / V3 DEMONSTRATIVA</span><a href="#case-top" className={styles.textLink}>Voltar ao topo <ArrowUpRight size={16} /></a></div>
      </section>
    </div>
  );
}
