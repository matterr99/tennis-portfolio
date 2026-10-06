import React, { useState } from 'react';
import {
  ARTICLES,
  ArticleData,
  BIG4_IMG,
  Language,
  MIAMI_OPEN_IMG,
  UI_TEXT
} from './data/articlesData';
import { ResilientImage } from './components/ResilientImage';
import { ArticleReader } from './components/ArticleReader';
import { ScorekeeperTool } from './components/ScorekeeperTool';
import { SimpleScorekeeper } from './components/SimpleScorekeeper';
import { GalleryPage } from './components/GalleryPage';
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Construction,
  ExternalLink,
  Globe,
  Image as ImageIcon,
  Layers,
  Trophy,
  UserCheck,
  Wrench
} from 'lucide-react';

type ActivePage =
  | 'home'
  | 'blog'
  | 'article'
  | 'tools'
  | 'gallery'
  | 'scorekeeper-simple'
  | 'scorekeeper-complex';

const LINKEDIN_URL =
  'https://www.linkedin.com/in/gabriel-vasquez-herrera-8b7b9614a?utm_source=share_via&utm_content=profile&utm_medium=member_ios';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedArticle, setSelectedArticle] = useState<ArticleData>(ARTICLES[0]);

  const t = UI_TEXT[lang];
  const isEs = lang === 'es';

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'es' : 'en'));
  };

  const handleOpenArticle = (article: ArticleData) => {
    setSelectedArticle(article);
    setActivePage('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenArticleById = (id: string) => {
    const found = ARTICLES.find((a) => a.id === id || a.slug === id);
    if (found) {
      handleOpenArticle(found);
    }
  };

  const handleNavigate = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F4F0] text-[#111315] selection:bg-[#0051FF] selection:text-white">
      {/* Top Navigation Bar — Responsive across all screen sizes, especially mobile */}
      <header className="sticky top-0 z-40 bg-[#F4F4F0]/95 backdrop-blur-md border-b border-[#E2E2DC]">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 h-13 sm:h-16 flex items-center justify-between gap-1 sm:gap-3">
          {/* Brand Identity */}
          <button
            onClick={() => handleNavigate('home')}
            className="text-left group flex items-center gap-1 sm:gap-2 focus:outline-none shrink-0 cursor-pointer"
          >
            <span className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 bg-[#0051FF] inline-block transition-transform group-hover:scale-125 shrink-0" />
            <span className="font-serif text-xs xs:text-sm sm:text-xl md:text-2xl tracking-tight text-[#111315] font-normal whitespace-nowrap">
              {t.brandName}
            </span>
          </button>

          {/* Navigation Links & Language Toggle */}
          <div className="flex items-center gap-0.5 sm:gap-2 shrink-0">
            <nav className="flex items-center gap-0.5 sm:gap-1">
              <button
                onClick={() => handleNavigate('home')}
                className={`px-1.5 sm:px-3 py-1 sm:py-1.5 text-[10px] xs:text-[11px] sm:text-xs md:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  activePage === 'home'
                    ? 'bg-[#111315] text-white'
                    : 'text-[#5A6065] hover:text-[#111315] hover:bg-[#E2E2DC]/50'
                }`}
              >
                {t.navHome}
              </button>
              <button
                onClick={() => handleNavigate('blog')}
                className={`px-1.5 sm:px-3 py-1 sm:py-1.5 text-[10px] xs:text-[11px] sm:text-xs md:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  activePage === 'blog' || activePage === 'article'
                    ? 'bg-[#111315] text-white'
                    : 'text-[#5A6065] hover:text-[#111315] hover:bg-[#E2E2DC]/50'
                }`}
              >
                {t.navBlog}
              </button>
              <button
                onClick={() => handleNavigate('tools')}
                className={`px-1.5 sm:px-3 py-1 sm:py-1.5 text-[10px] xs:text-[11px] sm:text-xs md:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  activePage === 'tools' ||
                  activePage === 'scorekeeper-simple' ||
                  activePage === 'scorekeeper-complex'
                    ? 'bg-[#111315] text-white'
                    : 'text-[#5A6065] hover:text-[#111315] hover:bg-[#E2E2DC]/50'
                }`}
              >
                {t.navTools}
              </button>
              <button
                onClick={() => handleNavigate('gallery')}
                className={`px-1.5 sm:px-3 py-1 sm:py-1.5 text-[10px] xs:text-[11px] sm:text-xs md:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  activePage === 'gallery'
                    ? 'bg-[#111315] text-white'
                    : 'text-[#5A6065] hover:text-[#111315] hover:bg-[#E2E2DC]/50'
                }`}
              >
                {t.navGallery}
              </button>
            </nav>

            <div className="h-3 sm:h-4 w-[1px] bg-[#D5D5CE] mx-0.5" />

            {/* Language Switch Button */}
            <button
              onClick={toggleLanguage}
              aria-label="Toggle language between English and Spanish"
              className="inline-flex items-center gap-1 px-1.5 sm:px-2.5 py-1 text-[10px] sm:text-xs font-mono uppercase tracking-wider border border-[#111315] bg-white hover:bg-[#0051FF] hover:text-white hover:border-[#0051FF] text-[#111315] transition-colors cursor-pointer shrink-0"
            >
              <Globe className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#0051FF]" />
              <span className="sm:hidden">{lang === 'en' ? 'ES' : 'EN'}</span>
              <span className="hidden sm:inline">{lang === 'en' ? 'ES · Español' : 'EN · English'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* ================= HOME PAGE (Clear Miami Open background, translucent buttons, LinkedIn About Me) ================= */}
        {activePage === 'home' && (
          <section className="relative flex-1 flex flex-col justify-between min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] overflow-hidden">
            {/* Original Miami Open Main Picture Background — clearly visible */}
            <div className="absolute inset-0 z-0">
              <ResilientImage
                src={MIAMI_OPEN_IMG}
                alt="Miami Open Stadium Court"
                className="w-full h-full object-cover object-center"
                fallbackLabel="Miami Open Court"
              />
              {/* Light, balanced vignette so the stadium court photo shines through clearly while keeping text legible */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-black/45" />
            </div>

            {/* Hero Center Content — Directly over the Miami Open background with no blur box */}
            <div className="relative z-10 max-w-4xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-20 my-auto text-center">
              <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.25em] text-[#D2F800] font-semibold mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                {t.brandName}
              </p>

              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-white font-extrabold tracking-tight leading-[1.06] mb-5 drop-shadow-[0_4px_18px_rgba(0,0,0,0.85)]">
                {t.heroTitlePrefix}
                <span className="font-cursive italic font-normal text-[#80B8FF]">{t.heroTitleAccent}</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-white max-w-2xl mx-auto font-medium leading-relaxed mb-8 sm:mb-10 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                {t.heroSubtitle}
              </p>

              {/* Primary 4 Action Buttons — Distinct individual colors with frosted glass blur */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 max-w-2xl mx-auto">
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-3 bg-black/30 hover:bg-black/50 backdrop-blur-xl text-white border border-white/40 font-semibold text-xs sm:text-sm transition-all shadow-lg cursor-pointer"
                >
                  <span>{t.aboutMeBtn}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-85 shrink-0" />
                </a>

                <button
                  onClick={() => handleNavigate('blog')}
                  className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-3 bg-[#0051FF]/45 hover:bg-[#0051FF]/65 backdrop-blur-xl text-white border border-[#80B8FF]/55 font-semibold text-xs sm:text-sm transition-all shadow-lg cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.readBlogBtn}</span>
                </button>

                <button
                  onClick={() => handleNavigate('tools')}
                  className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-3 bg-[#D2F800]/50 hover:bg-[#D2F800]/75 backdrop-blur-xl text-[#111315] border border-[#D2F800]/70 font-bold text-xs sm:text-sm transition-all shadow-lg cursor-pointer"
                >
                  <Wrench className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.tennisToolsBtn}</span>
                </button>

                <button
                  onClick={() => handleNavigate('gallery')}
                  className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-3 bg-white/20 hover:bg-white/35 backdrop-blur-xl text-white border border-white/40 font-semibold text-xs sm:text-sm transition-all shadow-lg cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.galleryBtn}</span>
                </button>
              </div>
            </div>

            {/* Bottom Quick Preview Bar */}
            <div className="relative z-10 bg-[#111315]/75 backdrop-blur-md border-t border-white/15">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/85">
                <div className="flex items-center gap-2.5 max-w-full">
                  <span className="font-mono uppercase tracking-wider text-[#D2F800] shrink-0">
                    {isEs ? 'Último Artículo:' : 'Latest Article:'}
                  </span>
                  <button
                    onClick={() => handleOpenArticle(ARTICLES[0])}
                    className="text-white hover:text-[#75AFFF] underline underline-offset-4 text-left truncate cursor-pointer"
                  >
                    {ARTICLES[0].title[lang]}
                  </button>
                </div>
                <div className="font-mono text-[11px] text-white/65 shrink-0">
                  {t.copyright}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= BLOG PAGE (Big Four Hero Banner edge-to-edge with zero black margins on mobile & desktop) ================= */}
        {activePage === 'blog' && (
          <div className="flex-1 pb-16">
            {/* Big Four Hero Banner — Full width, edge-to-edge, zero black bars on mobile */}
            <section className="relative w-full border-b border-[#111315] overflow-hidden">
              <div className="relative w-full">
                {/* Image scales naturally edge-to-edge on mobile (zero black margins) and fills banner on desktop */}
                <ResilientImage
                  src={BIG4_IMG}
                  alt="The Big Four — Roger Federer, Rafael Nadal, Novak Djokovic, Andy Murray"
                  className="w-full h-auto sm:h-[340px] md:h-[400px] object-cover object-center block"
                  fallbackLabel="The Big Four — Tennis Articles"
                />
                {/* Subtle gradient for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/25" />

                <div className="absolute inset-0 z-10 max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 flex flex-col justify-end py-3 sm:py-7">
                  <div>
                    <p className="font-mono text-[9px] sm:text-xs uppercase tracking-[0.2em] text-[#D2F800] mb-0.5 sm:mb-1 drop-shadow-xs">
                      {isEs ? 'PUBLICACIONES Y ANÁLISIS' : 'PUBLICATIONS & RESEARCH'}
                    </p>
                    <h1 className="font-serif text-2xl sm:text-5xl md:text-6xl text-white font-extrabold tracking-tight leading-none drop-shadow-md">
                      {t.blogBannerTitle}
                    </h1>
                  </div>
                </div>
              </div>
            </section>

            {/* Articles List Container */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14">
              <div className="space-y-5 sm:space-y-6">
                {ARTICLES.map((article, index) => (
                  <article
                    key={article.id}
                    onClick={() => handleOpenArticle(article)}
                    className="group bg-white border border-[#E2E2DC] hover:border-[#0051FF] p-5 sm:p-8 transition-all shadow-xs hover:shadow-md cursor-pointer"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                      <span className="font-mono text-xs uppercase tracking-widest text-[#0051FF] font-semibold">
                        {article.date[lang]}
                      </span>
                      <span className="font-mono text-xs text-[#5A6065]">
                        0{index + 1} / 0{ARTICLES.length}
                      </span>
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl text-[#111315] group-hover:text-[#0051FF] transition-colors leading-snug mb-3">
                      {article.title[lang]}
                    </h2>

                    <p className="text-[#3A3F44] text-sm sm:text-base leading-relaxed mb-5">
                      {article.excerpt[lang]}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-[#F0F0EC]">
                      <span className="text-xs font-mono text-[#5A6065]">
                        {article.authorLine[lang]}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider font-semibold text-[#0051FF] group-hover:translate-x-1 transition-transform">
                        <span>{isEs ? 'Leer Artículo' : 'Read Article'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </article>
                ))}
              </div>

              {/* Bottom Return Button */}
              <div className="mt-10 sm:mt-12 text-center">
                <button
                  onClick={() => handleNavigate('home')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#111315] hover:bg-[#0051FF] text-white text-xs sm:text-sm font-mono uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t.returnToPortfolio}</span>
                </button>
              </div>
            </section>
          </div>
        )}

        {/* ================= INDIVIDUAL ARTICLE VIEW ================= */}
        {activePage === 'article' && (
          <ArticleReader
            article={selectedArticle}
            lang={lang}
            onBack={() => handleNavigate('blog')}
            onSelectArticle={handleOpenArticleById}
          />
        )}

        {/* ================= TENNIS TOOLS HUB ================= */}
        {activePage === 'tools' && (
          <div className="flex-1 py-8 sm:py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Header */}
              <div className="border-b border-[#E2E2DC] pb-6 sm:pb-8 mb-8 sm:mb-10">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#0051FF] mb-2">
                  {isEs ? 'SUITE INTERACTIVA DE CANCHA' : 'ON-COURT INTERACTIVE SUITE'}
                </p>
                <h1 className="font-serif text-3xl sm:text-5xl text-[#111315] tracking-tight mb-3">
                  {t.toolsTitle}
                </h1>
                <p className="text-[#5A6065] text-sm sm:text-lg max-w-2xl leading-relaxed">
                  {t.toolsSubtitle}
                </p>
              </div>

              {/* 3-Card Grid:
                  1. Scorekeeper Pro (Simple MVP vs Advanced Stats)
                  2. League Organizer (Under Construction)
                  3. Academy Manager (Under Construction) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                {/* Card 1: Scorekeeper Pro */}
                <div className="bg-white border-2 border-[#111315] p-6 sm:p-8 flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-5">
                      <div className="w-11 h-11 bg-[#0051FF] text-white flex items-center justify-center">
                        <Layers className="w-5 h-5" />
                      </div>
                      <span className="px-2.5 py-1 bg-[#D2F800] text-[#111315] font-mono text-[11px] uppercase tracking-wider font-semibold">
                        {isEs ? 'Activo · 2 Modos' : 'Live · 2 Modes'}
                      </span>
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl text-[#111315] mb-3">
                      {t.scorekeeperTitle}
                    </h2>

                    <p className="text-[#5A6065] text-sm sm:text-base leading-relaxed mb-5">
                      {t.scorekeeperDesc}
                    </p>

                    <div className="bg-[#F4F4F0] border border-[#E2E2DC] p-3.5 mb-6 space-y-2 text-xs text-[#3A3F44]">
                      <div className="flex items-start gap-2">
                        <span className="font-mono font-bold text-[#0051FF]">01.</span>
                        <span>
                          <strong>{t.simpleMvpBtn}:</strong>{' '}
                          {isEs
                            ? 'Botones directos de Winner y Error por jugador y barras de progreso en vivo.'
                            : 'Direct 1-tap Winner & Error buttons per player with live progress bars.'}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-mono font-bold text-[#0051FF]">02.</span>
                        <span>
                          <strong>{t.advancedStatsBtn}:</strong>{' '}
                          {isEs
                            ? 'Control de 1er/2do saque, contador de rally, menú emergente de golpes (FH/BH, dirección) y pestañas detalladas.'
                            : '1st/2nd serve tracking, live rally counter, guided shot modal (FH/BH, stroke type, placement), and 3 stat tabs.'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => handleNavigate('scorekeeper-simple')}
                      className="w-full py-3 px-4 bg-[#111315] hover:bg-[#2A2E33] text-white font-mono text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer text-center"
                    >
                      {t.simpleMvpBtn}
                    </button>
                    <button
                      onClick={() => handleNavigate('scorekeeper-complex')}
                      className="w-full py-3 px-4 bg-[#0051FF] hover:bg-[#0040CC] text-white font-mono text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer text-center"
                    >
                      {t.advancedStatsBtn}
                    </button>
                  </div>
                </div>

                {/* Card 2: League Organizer (Under Development) */}
                <div className="bg-white/80 border border-[#E2E2DC] p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-5">
                      <div className="w-11 h-11 bg-[#F4F4F0] border border-[#E2E2DC] text-[#5A6065] flex items-center justify-center">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F4F4F0] border border-[#E2E2DC] text-[#5A6065] font-mono text-[11px] uppercase tracking-wider">
                        <Construction className="w-3.5 h-3.5 text-[#D97706]" />
                        <span>{t.underDevelopmentBtn}</span>
                      </span>
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl text-[#111315] mb-3">
                      {t.leagueOrganizerTitle}
                    </h2>

                    <p className="text-[#5A6065] text-sm sm:text-base leading-relaxed mb-6">
                      {t.leagueOrganizerDesc}
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      disabled
                      className="w-full py-3 px-4 bg-[#E2E2DC] text-[#5A6065] font-mono text-xs uppercase tracking-wider font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Construction className="w-4 h-4" />
                      <span>{t.underDevelopmentBtn}</span>
                    </button>
                  </div>
                </div>

                {/* Card 3: Academy Manager (Under Development) */}
                <div className="bg-white/80 border border-[#E2E2DC] p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-5">
                      <div className="w-11 h-11 bg-[#F4F4F0] border border-[#E2E2DC] text-[#5A6065] flex items-center justify-center">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F4F4F0] border border-[#E2E2DC] text-[#5A6065] font-mono text-[11px] uppercase tracking-wider">
                        <Construction className="w-3.5 h-3.5 text-[#D97706]" />
                        <span>{t.underDevelopmentBtn}</span>
                      </span>
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl text-[#111315] mb-3">
                      {t.academyManagerTitle}
                    </h2>

                    <p className="text-[#5A6065] text-sm sm:text-base leading-relaxed mb-6">
                      {t.academyManagerDesc}
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      disabled
                      className="w-full py-3 px-4 bg-[#E2E2DC] text-[#5A6065] font-mono text-xs uppercase tracking-wider font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Construction className="w-4 h-4" />
                      <span>{t.underDevelopmentBtn}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Return Button */}
              <div className="mt-10 sm:mt-12 text-center">
                <button
                  onClick={() => handleNavigate('home')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#111315] hover:bg-[#0051FF] text-white text-xs sm:text-sm font-mono uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t.returnToPortfolio}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= GALLERY PAGE ================= */}
        {activePage === 'gallery' && (
          <GalleryPage
            lang={lang}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {/* ================= SCOREKEEPER SIMPLE MVP (Original Direct Winner/Error Tracker) ================= */}
        {activePage === 'scorekeeper-simple' && (
          <div className="flex-1 py-4 sm:py-10 px-2.5 sm:px-6">
            <SimpleScorekeeper
              lang={lang}
              onBack={() => handleNavigate('tools')}
            />
          </div>
        )}

        {/* ================= SCOREKEEPER ADVANCED STATS (Original Complex Modal + Serve/Rally Tracker) ================= */}
        {activePage === 'scorekeeper-complex' && (
          <div className="flex-1 py-4 sm:py-10 px-2.5 sm:px-6">
            <ScorekeeperTool
              mode="complex"
              lang={lang}
              onBack={() => handleNavigate('tools')}
            />
          </div>
        )}
      </main>

      {/* Footer (Shown on non-home pages) */}
      {activePage !== 'home' && (
        <footer className="bg-white border-t border-[#E2E2DC] py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5A6065] font-mono">
            <div>{t.copyright}</div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleNavigate('home')}
                className="hover:text-[#0051FF] transition-colors cursor-pointer"
              >
                {t.navHome}
              </button>
              <button
                onClick={() => handleNavigate('blog')}
                className="hover:text-[#0051FF] transition-colors cursor-pointer"
              >
                {t.navBlog}
              </button>
              <button
                onClick={() => handleNavigate('tools')}
                className="hover:text-[#0051FF] transition-colors cursor-pointer"
              >
                {t.navTools}
              </button>
              <button
                onClick={() => handleNavigate('gallery')}
                className="hover:text-[#0051FF] transition-colors cursor-pointer"
              >
                {t.navGallery}
              </button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
