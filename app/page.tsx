"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  clearSession,
  fetchFromSupabaseAsUser,
  fetchFromSupabase,
  fetchProfile,
  getSavedSession,
  readSessionFromHash,
  signInWithPassword,
  signUpWithPassword,
  supabaseConfig,
  SupabaseSession,
  uploadToStorage,
  writeToSupabase,
} from "../src/lib/supabaseRest";

type Article = {
  id: number | string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  author: string;
  date: string;
  updated: string;
  read: string;
  views: number;
  level?: "Pemula" | "Menengah" | "Lanjutan";
  featured?: boolean;
  editor?: boolean;
  image: string;
  tags: string[];
};

type EventItem = {
  id: number | string;
  title: string;
  date: string;
  time: string;
  place: string;
  status: "Dibuka" | "Selesai";
  price: string;
  quota: string;
  speaker: string;
  registrationUrl?: string;
};

const categories = [
  "Semua",
  "Regulasi",
  "Hukum",
  "Crypto",
  "Blockchain",
  "Web3",
  "Ekonomi",
  "Investasi",
  "Keamanan Digital",
  "Pajak",
  "Analisis",
];

const communityWhatsAppUrl =
  "https://chat.whatsapp.com/BQOBBC4E5z72r7iv0vzYik?s=cl&p=i&mlu=0&ilr=0&amv=1";

const articles: Article[] = [
  {
    id: 1,
    slug: "ojk-terbitkan-regulasi-aset-kripto-terbaru",
    title: "OJK Perkuat Kerangka Pengawasan Aset Kripto di Indonesia",
    subtitle:
      "Arah pengawasan baru menekankan perlindungan konsumen, tata kelola exchange, dan transparansi risiko aset digital.",
    category: "Regulasi",
    author: "Redaksi CLC",
    date: "22 Juli 2026",
    updated: "22 Juli 2026",
    read: "6 menit",
    views: 18240,
    featured: true,
    editor: true,
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
    tags: ["OJK", "aset kripto", "perlindungan konsumen"],
  },
  {
    id: 2,
    slug: "pajak-crypto-yang-perlu-dipahami-investor",
    title: "Pajak Crypto yang Perlu Dipahami Investor Ritel",
    subtitle:
      "Ringkasan kewajiban pajak aset digital, pencatatan transaksi, dan kesalahan umum yang perlu dihindari.",
    category: "Pajak",
    author: "Nadia Putri",
    date: "21 Juli 2026",
    updated: "21 Juli 2026",
    read: "5 menit",
    views: 14300,
    editor: true,
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1000&q=80",
    tags: ["pajak", "investor", "laporan"],
  },
  {
    id: 3,
    slug: "panduan-keamanan-wallet-untuk-pemula",
    title: "Panduan Mengamankan Wallet Crypto untuk Pemula",
    subtitle:
      "Cara menjaga seed phrase, mengenali phishing, dan membangun kebiasaan keamanan aset digital.",
    category: "Keamanan Digital",
    author: "Raka Mahendra",
    date: "20 Juli 2026",
    updated: "20 Juli 2026",
    read: "7 menit",
    views: 21450,
    level: "Pemula",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1000&q=80",
    tags: ["wallet", "phishing", "keamanan"],
  },
  {
    id: 4,
    slug: "cara-membaca-whitepaper-proyek-web3",
    title: "Cara Membaca Whitepaper Proyek Web3 Secara Kritis",
    subtitle:
      "Kerangka sederhana untuk menilai tokenomics, utilitas, risiko hukum, dan kelayakan produk.",
    category: "Web3",
    author: "Dimas Arya",
    date: "19 Juli 2026",
    updated: "19 Juli 2026",
    read: "8 menit",
    views: 11290,
    level: "Menengah",
    image:
      "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?auto=format&fit=crop&w=1000&q=80",
    tags: ["whitepaper", "tokenomics", "Web3"],
  },
  {
    id: 5,
    slug: "analisis-fundamental-aset-kripto",
    title: "Analisis Fundamental Aset Kripto: Dari Narasi ke Data",
    subtitle:
      "Menghubungkan aktivitas jaringan, distribusi token, adopsi pengguna, dan risiko regulasi.",
    category: "Analisis",
    author: "Fajar Nugroho",
    date: "18 Juli 2026",
    updated: "18 Juli 2026",
    read: "9 menit",
    views: 16580,
    level: "Lanjutan",
    image:
      "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?auto=format&fit=crop&w=1000&q=80",
    tags: ["analisis", "fundamental", "data on-chain"],
  },
  {
    id: 6,
    slug: "perlindungan-konsumen-dalam-ekonomi-digital",
    title: "Perlindungan Konsumen dalam Ekonomi Digital",
    subtitle:
      "Mengapa literasi hukum menjadi pondasi penting bagi pengguna layanan keuangan digital.",
    category: "Hukum",
    author: "Ayu Larasati",
    date: "17 Juli 2026",
    updated: "18 Juli 2026",
    read: "6 menit",
    views: 9760,
    image:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1000&q=80",
    tags: ["hukum", "konsumen", "ekonomi digital"],
  },
];

const events: EventItem[] = [
  {
    id: 1,
    title: "Webinar Regulasi Crypto 2026",
    date: "2 Agustus 2026",
    time: "19.30 WIB",
    place: "Zoom Meeting",
    status: "Dibuka",
    price: "Gratis",
    quota: "300 peserta",
    speaker: "Praktisi hukum aset digital",
    registrationUrl: "https://wa.me/6280000000000",
  },
  {
    id: 2,
    title: "Kelas Keamanan Wallet dan Anti Scam",
    date: "10 Agustus 2026",
    time: "20.00 WIB",
    place: "Google Meet",
    status: "Dibuka",
    price: "Rp49.000",
    quota: "100 peserta",
    speaker: "Tim Edukasi CLC",
    registrationUrl: "https://wa.me/6280000000000",
  },
  {
    id: 3,
    title: "Diskusi Pajak Aset Digital",
    date: "14 Juni 2026",
    time: "19.00 WIB",
    place: "Online",
    status: "Selesai",
    price: "Gratis",
    quota: "250 peserta",
    speaker: "Konsultan pajak digital",
    registrationUrl: "https://wa.me/6280000000000",
  },
];

type SupabaseArticleRow = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  excerpt: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  reading_minutes: number | null;
  view_count: number | null;
  published_at: string | null;
  updated_at: string | null;
  categories: { name: string } | null;
  authors: { name: string } | null;
};

type SupabaseEventRow = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  poster_url: string | null;
  speaker: string | null;
  starts_at: string;
  location: string | null;
  registration_url: string | null;
  status: string;
  ticket_price: number | null;
  quota: number | null;
};

type SupabaseCategoryRow = {
  id: string;
  name: string;
  slug: string;
};

type AdminArticleRow = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  excerpt: string | null;
  status: "draft" | "scheduled" | "published" | "archived";
  cover_image_url: string | null;
  reading_minutes: number;
  view_count: number;
  published_at: string | null;
  created_at: string;
  categories: { name: string } | null;
};

type AdminEventRow = {
  id: string;
  title: string;
  status: string;
  starts_at: string;
  location: string | null;
};

type AdminLessonRow = {
  id: string;
  title: string;
  level: string;
  status: string;
  created_at: string;
};

function formatDate(value?: string | null) {
  if (!value) return "Belum dipublikasikan";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function formatTime(value?: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(value));
}

function mapArticle(row: SupabaseArticleRow): Article {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle || row.excerpt || "Artikel Crypto Legal Community.",
    category: row.categories?.name || "Berita",
    author: row.authors?.name || "Redaksi CLC",
    date: formatDate(row.published_at),
    updated: formatDate(row.updated_at),
    read: `${row.reading_minutes || 3} menit`,
    views: row.view_count || 0,
    image:
      row.cover_image_url ||
      "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?auto=format&fit=crop&w=1000&q=80",
    tags: [],
  };
}

function mapEvent(row: SupabaseEventRow): EventItem {
  return {
    id: row.id,
    title: row.title,
    date: formatDate(row.starts_at),
    time: formatTime(row.starts_at),
    place: row.location || "Online",
    status: row.status === "completed" ? "Selesai" : "Dibuka",
    price: row.ticket_price ? `Rp${row.ticket_price.toLocaleString("id-ID")}` : "Gratis",
    quota: row.quota ? `${row.quota} peserta` : "Kuota terbatas",
    speaker: row.speaker || row.description || "Tim Crypto Legal Community",
    registrationUrl: row.registration_url || undefined,
  };
}

function navigate(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function shareArticle(article: Article) {
  const url = `${window.location.origin}/berita/${article.slug}`;
  if (navigator.share) {
    navigator.share({ title: article.title, text: article.subtitle, url }).catch(() => null);
    return;
  }
  navigator.clipboard.writeText(url);
  alert("Link artikel disalin.");
}

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export default function Home() {
  const [path, setPath] = useState("/");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [dark, setDark] = useState(false);
  const [menu, setMenu] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [admin, setAdmin] = useState(false);
  const [drafts, setDrafts] = useState<Article[]>([]);
  const [remoteArticles, setRemoteArticles] = useState<Article[]>([]);
  const [remoteEvents, setRemoteEvents] = useState<EventItem[]>([]);
  const [dataStatus, setDataStatus] = useState(
    supabaseConfig.isConfigured ? "Menghubungkan Supabase..." : "Mode demo: env Supabase belum diisi."
  );
  const [session, setSession] = useState<SupabaseSession | null>(null);
  const [profile, setProfile] = useState<{ display_name: string; role: string } | null>(null);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);

  useEffect(() => {
    const sync = () => setPath(window.location.pathname);
    sync();
    window.addEventListener("popstate", sync);
    setDark(localStorage.getItem("clc-theme") === "dark");
    setBookmarks(JSON.parse(localStorage.getItem("clc-bookmarks") || "[]"));
    if (supabaseConfig.isConfigured) {
      localStorage.removeItem("clc-admin");
      setAdmin(false);
    } else {
      setAdmin(false);
    }
    setDrafts(JSON.parse(localStorage.getItem("clc-drafts") || "[]"));
    try {
      setSession(readSessionFromHash() || getSavedSession());
    } catch (error) {
      setSession(null);
      console.error(error);
    }
    return () => window.removeEventListener("popstate", sync);
  }, []);

  useEffect(() => {
    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("clc-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    if (!supabaseConfig.isConfigured) return;

    const controller = new AbortController();
    const loadRemoteContent = async () => {
      try {
        const [articleRows, eventRows] = await Promise.all([
          fetchFromSupabase<SupabaseArticleRow[]>(
            "articles?select=id,title,slug,subtitle,excerpt,cover_image_url,cover_image_alt,reading_minutes,view_count,published_at,updated_at,categories(name),authors(name)&status=eq.published&order=published_at.desc",
            { signal: controller.signal }
          ),
          fetchFromSupabase<SupabaseEventRow[]>(
            "events?select=id,title,slug,description,poster_url,speaker,starts_at,location,registration_url,status,ticket_price,quota&status=in.(upcoming,open,closed,completed)&order=starts_at.asc",
            { signal: controller.signal }
          ),
        ]);

        setRemoteArticles(articleRows.map(mapArticle));
        setRemoteEvents(eventRows.map(mapEvent));
        setDataStatus(
          articleRows.length || eventRows.length
            ? "Terhubung ke Supabase."
            : "Terhubung ke Supabase, tetapi belum ada konten published."
        );
      } catch {
        if (!controller.signal.aborted) {
          setDataStatus("Supabase belum bisa dibaca. Situs memakai data demo.");
        }
      }
    };

    loadRemoteContent();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!session) {
      setProfile(null);
      return;
    }

    fetchProfile(session)
      .then((nextProfile) => setProfile(nextProfile))
      .catch(() => setProfile(null));
  }, [session]);

  const liveArticles = remoteArticles.length ? remoteArticles : articles;
  const liveEvents = remoteEvents.length ? remoteEvents : events;
  const allArticles = [...drafts, ...liveArticles];
  const filtered = allArticles.filter((article) => {
    const matchCategory = category === "Semua" || article.category === category;
    const haystack = `${article.title} ${article.subtitle} ${article.category}`.toLowerCase();
    return matchCategory && haystack.includes(query.toLowerCase());
  });
  const articleSlug = path.startsWith("/berita/") ? path.split("/").pop() : "";
  const selectedArticle = allArticles.find((article) => article.slug === articleSlug);

  const saveDraft = (article: Article) => {
    const next = [article, ...drafts.filter((item) => item.slug !== article.slug)];
    setDrafts(next);
    localStorage.setItem("clc-drafts", JSON.stringify(next));
  };

  const toggleBookmark = (slug: string) => {
    const next = bookmarks.includes(slug)
      ? bookmarks.filter((item) => item !== slug)
      : [...bookmarks, slug];
    setBookmarks(next);
    localStorage.setItem("clc-bookmarks", JSON.stringify(next));
  };

  const commonProps = {
    query,
    setQuery,
    category,
    setCategory,
    filtered,
    bookmarks,
    toggleBookmark,
    articles: liveArticles,
    events: liveEvents,
  };

  if (path === "/admin") {
    return (
      <AdminPage
        admin={admin}
        setAdmin={setAdmin}
        drafts={drafts}
        saveDraft={saveDraft}
        dataStatus={dataStatus}
        remoteArticles={remoteArticles}
        remoteEvents={remoteEvents}
        session={session}
        setSession={setSession}
        profile={profile}
        setProfile={setProfile}
        installPrompt={installPrompt}
        setInstallPrompt={setInstallPrompt}
      />
    );
  }

  return (
    <>
      <ProgressBar />
      <Header
        dark={dark}
        setDark={setDark}
        menu={menu}
        setMenu={setMenu}
        query={query}
        setQuery={setQuery}
      />
      <main>
        {path === "/" && <HomePage {...commonProps} />}
        {path === "/berita" && <NewsPage {...commonProps} />}
        {selectedArticle && (
          <ArticlePage
            article={selectedArticle}
            related={allArticles.filter((item) => item.slug !== selectedArticle.slug).slice(0, 3)}
            bookmarked={bookmarks.includes(selectedArticle.slug)}
            toggleBookmark={toggleBookmark}
          />
        )}
        {path === "/edukasi" && <EducationPage />}
        {path === "/event" && <EventPage events={liveEvents} />}
        {path === "/tentang-clc" && <AboutPage />}
      </main>
      <Footer />
      <button className="back-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        Top
      </button>
    </>
  );
}

function Header({ dark, setDark, menu, setMenu, query, setQuery }: any) {
  const links = [
    ["/", "Beranda"],
    ["/berita", "Berita"],
    ["/edukasi", "Edukasi"],
    ["/event", "Event"],
    ["/tentang-clc", "Tentang CLC"],
  ];
  return (
    <header className="site-header">
      <a className="brand" onClick={() => navigate("/")}>
        <img src="/clc-logo.png" alt="Logo Crypto Legal Community" />
        <span>Media Hukum, Crypto, dan Ekonomi Digital</span>
      </a>
      <nav className={menu ? "open" : ""}>
        {links.map(([href, label]) => (
          <button key={href} onClick={() => { navigate(href); setMenu(false); }}>
            {label}
          </button>
        ))}
      </nav>
      <div className="header-actions">
        <label className="search">
          <span>Search</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari artikel" />
        </label>
        <button className="icon-btn" onClick={() => setDark(!dark)} aria-label="Ganti mode">
          {dark ? "Light" : "Dark"}
        </button>
        <a className="join" href={communityWhatsAppUrl} target="_blank">Gabung Komunitas</a>
        <button className="hamburger" onClick={() => setMenu(!menu)} aria-label="Menu">Menu</button>
      </div>
    </header>
  );
}

function HomePage(props: any) {
  const homeArticles = props.articles as Article[];
  const featured = homeArticles[0] || articles[0];
  return (
    <>
      <section className="ticker"><b>Breaking:</b> CLC membuka kelas literasi aset digital dan perlindungan konsumen bulan Agustus.</section>
      <section className="hero-grid">
        <article className="hero-card" onClick={() => navigate(`/berita/${featured.slug}`)}>
          <img src={featured.image} alt={featured.title} />
          <div>
            <span className="pill">{featured.category}</span>
            <h1>{featured.title}</h1>
            <p>{featured.subtitle}</p>
            <Meta article={featured} />
            <button className="primary">Baca Selengkapnya</button>
          </div>
        </article>
        <aside className="choice-list">
          <h2>Berita Pilihan</h2>
          {homeArticles.slice(1, 4).map((article) => <SmallArticle key={article.slug} article={article} />)}
        </aside>
      </section>
      <ArticleSection title="Berita Terbaru" articles={props.filtered.slice(0, 6)} {...props} />
      <PopularSection />
      <ArticleSection title="Fokus Regulasi dan Hukum" articles={homeArticles.filter((a) => ["Regulasi", "Hukum", "Pajak"].includes(a.category))} {...props} />
      <EducationStrip />
      <EventPreview events={props.events} />
      <CommunitySection />
    </>
  );
}

function NewsPage(props: any) {
  const [visible, setVisible] = useState(6);
  return (
    <section className="page-shell">
      <h1>Berita Crypto Legal Community</h1>
      <p>Arsip berita, analisis, dan edukasi hukum ekonomi digital yang dapat difilter berdasarkan kategori dan popularitas.</p>
      <div className="toolbar">
        <label className="search wide"><span>Search</span><input value={props.query} onChange={(e) => props.setQuery(e.target.value)} placeholder="Cari regulasi, pajak, blockchain..." /></label>
        <select onChange={(e) => props.setCategory(e.target.value)} value={props.category}>{categories.map((cat) => <option key={cat}>{cat}</option>)}</select>
        <select><option>Terbaru</option><option>Terpopuler</option></select>
        <input type="date" />
      </div>
      <CategoryFilters category={props.category} setCategory={props.setCategory} />
      <div className="article-grid">
        {props.filtered.slice(0, visible).map((article: Article) => <ArticleCard key={article.slug} article={article} {...props} />)}
      </div>
      <button className="secondary center" onClick={() => setVisible(visible + 3)}>Muat Lebih Banyak</button>
    </section>
  );
}

function ArticlePage({ article, related, bookmarked, toggleBookmark }: any) {
  return (
    <article className="article-layout">
      <aside className="toc">
        <b>Daftar Isi</b>
        <a href="#ringkasan">Ringkasan</a><a href="#analisis">Analisis</a><a href="#referensi">Referensi</a>
      </aside>
      <div className="article-main">
        <span className="pill">{article.category}</span>
        <h1>{article.title}</h1>
        <p className="lead">{article.subtitle}</p>
        <div className="author-row"><div className="avatar">CLC</div><Meta article={article} /> <span>{article.views.toLocaleString("id-ID")} pembaca</span></div>
        <img className="cover" src={article.image} alt={article.title} />
        <section id="ringkasan">
          <h2>Ringkasan Utama</h2>
          <p>Artikel ini membahas konteks terbaru dari {article.category.toLowerCase()} dengan bahasa yang mudah dipahami oleh pembaca Indonesia. Fokus CLC adalah membantu pembaca memahami peluang, risiko, dan konsekuensi hukum sebelum mengambil keputusan.</p>
          <blockquote>Literasi hukum dan literasi finansial harus berjalan bersama dalam ekosistem aset digital.</blockquote>
        </section>
        <section id="analisis">
          <h2>Poin yang Perlu Diperhatikan</h2>
          <ul><li>Periksa legalitas platform dan pihak yang menawarkan produk.</li><li>Pahami risiko volatilitas, keamanan wallet, dan kewajiban pajak.</li><li>Simpan catatan transaksi untuk kebutuhan audit pribadi.</li></ul>
          <table><tbody><tr><th>Aspek</th><th>Yang Dicek</th></tr><tr><td>Regulasi</td><td>Izin, kepatuhan, perlindungan konsumen</td></tr><tr><td>Investasi</td><td>Risiko, likuiditas, tujuan keuangan</td></tr></tbody></table>
        </section>
        <section id="referensi">
          <h2>Sumber dan Tag</h2>
          <p>Referensi: OJK, Bappebti, publikasi industri, dan riset internal CLC. Tag: {article.tags.join(", ")}.</p>
          <div className="share"><button onClick={() => navigator.clipboard.writeText(location.href)}>Salin Link</button><a href={`https://wa.me/?text=${encodeURIComponent(article.title)}`}>WhatsApp</a><a>Facebook</a><a>X</a><a>Telegram</a><a>LinkedIn</a><button onClick={() => toggleBookmark(article.slug)}>{bookmarked ? "Tersimpan" : "Simpan Artikel"}</button></div>
        </section>
        <h2>Artikel Terkait</h2>
        <div className="article-grid compact">{related.map((item: Article) => <ArticleCard key={item.slug} article={item} bookmarks={[]} toggleBookmark={() => null} />)}</div>
      </div>
    </article>
  );
}

function EducationPage() {
  const steps = ["Mengenal cryptocurrency", "Mengenal blockchain", "Membuat dan mengamankan wallet", "Memahami exchange", "Mengenal risiko investasi", "Memahami regulasi", "Memahami pajak crypto", "Analisis fundamental", "Analisis teknikal", "Keamanan dan pencegahan penipuan"];
  return <section className="page-shell"><h1>Jalur Edukasi Crypto</h1><p>Materi dipisahkan untuk Pemula, Menengah, dan Lanjutan agar pembaca bisa belajar bertahap.</p><div className="level-grid">{["Pemula", "Menengah", "Lanjutan"].map((level, i) => <div className="level" key={level}><h2>{level}</h2><div className="progress"><span style={{ width: `${(i + 1) * 28}%` }} /></div>{steps.slice(i * 3, i * 3 + 4).map((step, idx) => <button key={step}>{idx + 1}. {step}</button>)}</div>)}</div><EducationStrip /></section>;
}

function EventPage({ events: items = events }: { events?: EventItem[] }) {
  return <section className="page-shell"><h1>Event dan Course CLC</h1><div className="event-columns"><EventList title="Event Mendatang" items={items.filter((e) => e.status === "Dibuka")} /><EventList title="Event Selesai" items={items.filter((e) => e.status === "Selesai")} /></div></section>;
}

function AboutPage() {
  return <section className="page-shell about"><h1>Tentang CLC</h1><p>Crypto Legal Community (CLC) adalah media dan komunitas edukasi yang berfokus pada perkembangan aset kripto, Web3, teknologi blockchain, regulasi, serta ekonomi digital. CLC hadir untuk menyajikan informasi yang akurat, mudah dipahami, dan relevan bagi masyarakat, pelaku industri, investor, maupun generasi muda yang ingin memahami dunia kripto dari sisi teknologi, ekonomi, dan hukum.</p><h2>Visi</h2><p>Menjadi media dan platform edukasi crypto legal yang terpercaya, independen, dan berkontribusi dalam membangun ekosistem aset digital yang aman, transparan, serta bertanggung jawab di Indonesia.</p><h2>Misi</h2><ol><li>Menyajikan berita dan informasi terkini seputar kripto, blockchain, Web3, regulasi, dan ekonomi digital.</li><li>Meningkatkan literasi masyarakat melalui konten edukasi yang objektif, praktis, dan mudah dipahami.</li><li>Menjadi ruang diskusi dan kolaborasi bagi komunitas, akademisi, praktisi hukum, investor, serta pelaku industri aset digital.</li><li>Mendorong terciptanya ekosistem kripto yang lebih aman, patuh hukum, transparan, dan berkelanjutan.</li><li>Menghubungkan perkembangan teknologi dengan pemahaman hukum serta perlindungan bagi masyarakat dan investor.</li></ol><h2>Kontak</h2><p>Email: cryptolegalcommunity@gmail.com | WhatsApp: 085720384852</p></section>;
}

function AdminPage({ admin, setAdmin, drafts, saveDraft, dataStatus, remoteArticles, remoteEvents, session, setSession, profile, setProfile, installPrompt, setInstallPrompt }: any) {
  const [tab, setTab] = useState("Artikel");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [loginStatus, setLoginStatus] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [installStatus, setInstallStatus] = useState("");
  const [dbCategories, setDbCategories] = useState<SupabaseCategoryRow[]>([]);
  const [adminArticles, setAdminArticles] = useState<AdminArticleRow[]>([]);
  const [adminEvents, setAdminEvents] = useState<AdminEventRow[]>([]);
  const [adminLessons, setAdminLessons] = useState<AdminLessonRow[]>([]);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [uploadedImage, setUploadedImage] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartsAt, setEventStartsAt] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventLink, setEventLink] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonLevel, setLessonLevel] = useState("Pemula");
  const [lessonSummary, setLessonSummary] = useState("");
  const [lessonUrl, setLessonUrl] = useState("");
  const isStaff = profile && ["admin", "editor", "author"].includes(profile.role);

  const login = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabaseConfig.isConfigured) {
      setLoginStatus("Supabase belum dikonfigurasi. Isi env Netlify/local agar admin bisa login.");
      return;
    }
    try {
      const nextSession = await signInWithPassword(email, password);
      setSession(nextSession);
      setLoginStatus("Login berhasil. Memeriksa role admin...");
    } catch (error) {
      setLoginStatus(error instanceof Error ? error.message : "Login gagal.");
    }
  };

  const register = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabaseConfig.isConfigured) {
      setLoginStatus("Supabase belum dikonfigurasi. Isi env Netlify/local agar pendaftaran bisa dipakai.");
      return;
    }
    try {
      const result = await signUpWithPassword(email, password);
      setLoginStatus(
        result.needsConfirmation
          ? "Pendaftaran berhasil. Cek email untuk konfirmasi, lalu minta owner memberi role admin/editor/author."
          : "Pendaftaran berhasil. Akun dibuat sebagai member; minta owner memberi role admin/editor/author."
      );
      setAuthMode("login");
    } catch (error) {
      setLoginStatus(error instanceof Error ? error.message : "Pendaftaran gagal.");
    }
  };

  const loadAdminData = async () => {
    if (!session) return;
    const [categoryRows, articleRows, eventRows, lessonRows] = await Promise.all([
      fetchFromSupabaseAsUser<SupabaseCategoryRow[]>("categories?select=id,name,slug&order=sort_order.asc", session),
      fetchFromSupabaseAsUser<AdminArticleRow[]>("articles?select=id,title,slug,subtitle,excerpt,status,cover_image_url,reading_minutes,view_count,published_at,created_at,categories(name)&order=created_at.desc", session),
      fetchFromSupabaseAsUser<AdminEventRow[]>("events?select=id,title,status,starts_at,location&order=starts_at.desc", session),
      fetchFromSupabaseAsUser<AdminLessonRow[]>("lessons?select=id,title,level,status,created_at&order=created_at.desc", session),
    ]);
    setDbCategories(categoryRows);
    setSelectedCategory((current) => current || categoryRows[0]?.id || "");
    setAdminArticles(articleRows);
    setAdminEvents(eventRows);
    setAdminLessons(lessonRows);
  };

  useEffect(() => {
    if (!session || !isStaff) return;
    loadAdminData().catch((error) => setSaveStatus(error instanceof Error ? error.message : "Gagal memuat data admin."));
  }, [session, isStaff]);

  const resetArticleForm = () => {
    setEditingArticleId(null);
    setTitle("");
    setExcerpt("");
    setBody("");
    setUploadedImage("");
  };

  const handleImageUpload = async (file?: File) => {
    if (!file || !session) return;
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
    const path = `articles/${Date.now()}-${safeName}`;
    try {
      setUploadedImage(await uploadToStorage(session, "media", path, file));
    } catch (error) {
      setUploadedImage(error instanceof Error ? error.message : "Upload gagal.");
    }
  };

  const articlePayload = (status: "draft" | "published") => {
    const slugBase = title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
    return {
      title,
      slug: editingArticleId ? undefined : `${slugBase}-${Date.now()}`,
      subtitle: excerpt,
      excerpt,
      category_id: selectedCategory || null,
      cover_image_url: uploadedImage || null,
      cover_image_alt: title,
      content: { type: "doc", blocks: body.split("\n").filter(Boolean).map((text) => ({ type: "paragraph", text })) },
      status,
      reading_minutes: Math.max(1, Math.ceil(body.split(/\s+/).filter(Boolean).length / 200)),
      published_at: status === "published" ? new Date().toISOString() : null,
    };
  };

  const saveArticle = async (status: "draft" | "published") => {
    if (!session) throw new Error("Session admin tidak ditemukan.");
    const payload = articlePayload(status);
    if (editingArticleId) {
      await writeToSupabase<any[]>(`articles?id=eq.${editingArticleId}`, "PATCH", session, payload);
    } else {
      await writeToSupabase<any[]>("articles", "POST", session, payload);
    }
    resetArticleForm();
    await loadAdminData();
  };

  const editArticle = (article: AdminArticleRow) => {
    setEditingArticleId(article.id);
    setTitle(article.title);
    setExcerpt(article.excerpt || article.subtitle || "");
    setBody(article.excerpt || article.subtitle || "");
    setUploadedImage(article.cover_image_url || "");
    setTab("Artikel");
  };

  const deleteArticle = async (id: string) => {
    if (!session || !confirm("Hapus artikel ini dari Supabase?")) return;
    await writeToSupabase<null>(`articles?id=eq.${id}`, "DELETE", session);
    await loadAdminData();
  };

  const saveEvent = async () => {
    if (!session) return;
    await writeToSupabase<any[]>("events", "POST", session, {
      title: eventTitle,
      slug: `${eventTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
      starts_at: eventStartsAt ? new Date(eventStartsAt).toISOString() : new Date().toISOString(),
      location: eventLocation || "Online",
      registration_url: eventLink || null,
      status: "open",
    });
    setEventTitle("");
    setEventStartsAt("");
    setEventLocation("");
    setEventLink("");
    await loadAdminData();
  };

  const deleteEvent = async (id: string) => {
    if (!session || !confirm("Hapus event ini?")) return;
    await writeToSupabase<null>(`events?id=eq.${id}`, "DELETE", session);
    await loadAdminData();
  };

  const saveLesson = async () => {
    if (!session) return;
    await writeToSupabase<any[]>("lessons", "POST", session, {
      title: lessonTitle,
      slug: `${lessonTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
      level: lessonLevel,
      summary: lessonSummary,
      external_url: lessonUrl || null,
      content: { type: "doc", blocks: [{ type: "paragraph", text: lessonSummary }] },
      status: "published",
      published_at: new Date().toISOString(),
    });
    setLessonTitle("");
    setLessonSummary("");
    setLessonUrl("");
    await loadAdminData();
  };

  const deleteLesson = async (id: string) => {
    if (!session || !confirm("Hapus materi ini?")) return;
    await writeToSupabase<null>(`lessons?id=eq.${id}`, "DELETE", session);
    await loadAdminData();
  };

  if (supabaseConfig.isConfigured && !session) return <main className="admin-login"><form onSubmit={authMode === "login" ? login : register}><img src="/clc-logo.png" alt="CLC" /><h1>{authMode === "login" ? "Login Admin CLC" : "Daftar Akun Admin"}</h1><div className="auth-switch"><button type="button" className={authMode === "login" ? "active" : ""} onClick={() => setAuthMode("login")}>Login</button><button type="button" className={authMode === "register" ? "active" : ""} onClick={() => setAuthMode("register")}>Daftar</button></div><label>Email Admin</label><input required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@email.com" type="email" autoComplete="username" /><label>Password</label><div className="password-field"><input required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Masukkan password" type={showPassword ? "text" : "password"} autoComplete={authMode === "login" ? "current-password" : "new-password"} minLength={6} /><button type="button" onClick={() => setShowPassword((current) => !current)}>{showPassword ? "Sembunyikan" : "Tampilkan"}</button></div><button className="primary">{authMode === "login" ? "Masuk dengan Email dan Password" : "Daftar dengan Email dan Password"}</button><p>{loginStatus || (authMode === "login" ? "Login memakai akun Supabase Auth yang punya role admin/editor/author di tabel profiles." : "Daftar membuat akun Supabase. Akses dashboard aktif setelah owner memberi role admin/editor/author.")}</p></form></main>;
  if (supabaseConfig.isConfigured && session && !isStaff) return <main className="admin-login"><form><img src="/clc-logo.png" alt="CLC" /><h1>Akses Ditolak</h1><p>Akun ini belum memiliki role admin, editor, atau author di tabel profiles.</p><button type="button" className="primary" onClick={() => { clearSession(); setSession(null); setProfile(null); }}>Keluar</button></form></main>;
  if (!supabaseConfig.isConfigured) return <main className="admin-login"><form onSubmit={authMode === "login" ? login : register}><img src="/clc-logo.png" alt="CLC" /><h1>{authMode === "login" ? "Login Admin CLC" : "Daftar Akun Admin"}</h1><div className="auth-switch"><button type="button" className={authMode === "login" ? "active" : ""} onClick={() => { setAuthMode("login"); setLoginStatus(""); }}>Login</button><button type="button" className={authMode === "register" ? "active" : ""} onClick={() => { setAuthMode("register"); setLoginStatus("Daftar belum bisa dipakai karena Supabase belum dikonfigurasi di build ini."); }}>Daftar</button></div><label>Email Admin</label><input required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@email.com" type="email" autoComplete="username" /><label>Password</label><div className="password-field"><input required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Masukkan password" type={showPassword ? "text" : "password"} autoComplete={authMode === "login" ? "current-password" : "new-password"} /><button type="button" onClick={() => setShowPassword((current) => !current)}>{showPassword ? "Sembunyikan" : "Tampilkan"}</button></div><button className="primary">{authMode === "login" ? "Masuk dengan Email dan Password" : "Daftar dengan Email dan Password"}</button><p>{loginStatus || "Supabase belum dikonfigurasi di build ini. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY di Netlify/local, lalu redeploy atau restart dev server."}</p></form></main>;

  const tabs = ["Artikel", "Event", "Course", "Kategori", "Penulis", "Statistik"];
  const publishedCount = adminArticles.filter((item) => item.status === "published").length;
  const draftCount = adminArticles.filter((item) => item.status === "draft").length;
  const totalViews = adminArticles.reduce((sum, item) => sum + (item.view_count || 0), 0);
  const installDashboard = async () => {
    if (!installPrompt) {
      setInstallStatus("Jika tombol install browser belum muncul, buka menu browser lalu pilih Install app atau Add to Home screen.");
      return;
    }
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice.catch(() => null);
    setInstallStatus(choice?.outcome === "accepted" ? "Dashboard admin berhasil dipasang." : "Instalasi dibatalkan. Kamu tetap bisa install dari menu browser.");
    setInstallPrompt(null);
  };

  return (
    <main className="admin">
      <aside>
        <img src="/clc-logo.png" alt="CLC" />
        {tabs.map((item) => <button className={tab === item ? "active" : ""} key={item} onClick={() => setTab(item)}>{item}</button>)}
        <button onClick={() => { clearSession(); setSession(null); setProfile(null); setAdmin(false); localStorage.removeItem("clc-admin"); }}>Keluar</button>
      </aside>
      <section>
        <h1>Dashboard Admin</h1>
        <div className="admin-toolbar">
          <p className="admin-status">{dataStatus} {profile ? `Login sebagai ${profile.display_name} (${profile.role}).` : ""}</p>
          <button className="secondary" onClick={installDashboard}>Install Dashboard</button>
        </div>
        {installStatus && <p className="admin-install-note">{installStatus}</p>}
        <div className="admin-stats"><b>{adminArticles.length} Artikel</b><b>{draftCount} Draft</b><b>{totalViews.toLocaleString("id-ID")} Pembaca</b><b>{adminEvents.length} Event</b></div>

        {tab === "Artikel" && <div className="admin-panel"><form className="editor" onSubmit={async (e) => { e.preventDefault(); try { setSaveStatus("Menyimpan artikel..."); await saveArticle("published"); setSaveStatus("Artikel berhasil dipublikasikan."); } catch (error) { setSaveStatus(error instanceof Error ? error.message : "Gagal menyimpan artikel."); } }}><h2>{editingArticleId ? "Edit Artikel" : "Manajemen Artikel"}</h2><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul artikel" required /><input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Ringkasan artikel" required /><select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>{dbCategories.map((cat) => <option value={cat.id} key={cat.id}>{cat.name}</option>)}</select><input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => handleImageUpload(event.target.files?.[0])} /><small>{uploadedImage || "Upload gambar utama artikel"}</small><textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Tulis isi artikel di sini." required /><p className="admin-status">{saveStatus || "Siap menyimpan ke Supabase."}</p><div className="editor-actions"><button>Publikasikan</button><button type="button" onClick={async () => { try { await saveArticle("draft"); setSaveStatus("Draft berhasil disimpan."); } catch (error) { setSaveStatus(error instanceof Error ? error.message : "Gagal menyimpan draft."); } }}>Simpan Draft</button>{editingArticleId && <button type="button" onClick={resetArticleForm}>Batal Edit</button>}</div></form><h2>Daftar Artikel</h2><div className="admin-list">{adminArticles.map((article) => <div key={article.id} className="admin-row"><span><b>{article.title}</b><small>{article.status} - {article.categories?.name || "Tanpa kategori"} - {formatDate(article.published_at || article.created_at)}</small></span><div><button onClick={() => editArticle(article)}>Edit</button><button onClick={() => deleteArticle(article.id)}>Hapus</button></div></div>)}</div></div>}

        {tab === "Event" && <div className="admin-panel"><h2>Manajemen Event</h2><input value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} placeholder="Nama event" /><input value={eventStartsAt} onChange={(e) => setEventStartsAt(e.target.value)} type="datetime-local" /><input value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} placeholder="Lokasi atau platform" /><input value={eventLink} onChange={(e) => setEventLink(e.target.value)} placeholder="Link pendaftaran" /><button className="primary" onClick={saveEvent}>Simpan Event</button><div className="admin-list">{adminEvents.map((event) => <div key={event.id} className="admin-row"><span><b>{event.title}</b><small>{event.status} - {formatDate(event.starts_at)} - {event.location || "Online"}</small></span><button onClick={() => deleteEvent(event.id)}>Hapus</button></div>)}</div></div>}

        {tab === "Course" && <div className="admin-panel"><h2>Manajemen Course dan Edukasi</h2><input value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} placeholder="Judul materi" /><select value={lessonLevel} onChange={(e) => setLessonLevel(e.target.value)}><option>Pemula</option><option>Menengah</option><option>Lanjutan</option></select><input value={lessonUrl} onChange={(e) => setLessonUrl(e.target.value)} placeholder="Link video atau referensi eksternal" /><textarea value={lessonSummary} onChange={(e) => setLessonSummary(e.target.value)} placeholder="Deskripsi materi edukasi" /><button className="primary" onClick={saveLesson}>Simpan Materi</button><div className="admin-list">{adminLessons.map((lesson) => <div key={lesson.id} className="admin-row"><span><b>{lesson.title}</b><small>{lesson.level} - {lesson.status}</small></span><button onClick={() => deleteLesson(lesson.id)}>Hapus</button></div>)}</div></div>}

        {tab === "Kategori" && <div className="admin-panel"><h2>Kategori</h2><div className="chips">{dbCategories.map((cat) => <button key={cat.id}>{cat.name}</button>)}</div></div>}
        {tab === "Penulis" && <div className="admin-panel"><h2>Penulis</h2><p>Data penulis sudah tersedia di schema Supabase. Form detail penulis bisa ditambahkan setelah workflow artikel stabil.</p></div>}
        {tab === "Statistik" && <div className="admin-panel"><h2>Statistik Real</h2><div className="stats"><b>{adminArticles.length} total artikel</b><b>{publishedCount} artikel published</b><b>{draftCount} draft</b></div><div className="stats"><b>{adminEvents.length} event</b><b>{adminLessons.length} materi edukasi</b><b>{totalViews.toLocaleString("id-ID")} total pembaca</b></div><h2>Artikel Paling Populer</h2><div className="admin-list">{adminArticles.slice().sort((a, b) => b.view_count - a.view_count).slice(0, 5).map((article) => <div key={article.id} className="admin-row"><span><b>{article.title}</b><small>{article.view_count.toLocaleString("id-ID")} pembaca</small></span></div>)}</div></div>}
      </section>
    </main>
  );
}

function ArticleSection({ title, articles: items, category, setCategory, bookmarks, toggleBookmark }: any) {
  return <section className="content-section"><div className="section-head"><h2>{title}</h2><button onClick={() => navigate("/berita")}>Lihat Semua Berita</button></div><CategoryFilters category={category} setCategory={setCategory} /><div className="article-grid">{items.map((article: Article) => <ArticleCard key={article.slug} article={article} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />)}</div></section>;
}

function ArticleCard({ article, bookmarks = [], toggleBookmark = () => null }: any) {
  return <article className="article-card"><img loading="lazy" src={article.image} alt={article.title} /><div><span className="pill">{article.category}</span><h3 onClick={() => navigate(`/berita/${article.slug}`)}>{article.title}</h3><p>{article.subtitle}</p><Meta article={article} /><button onClick={() => shareArticle(article)}>Share</button></div></article>;
}

function SmallArticle({ article }: { article: Article }) {
  return <button className="small-article" onClick={() => navigate(`/berita/${article.slug}`)}><img src={article.image} alt={article.title} /><span><b>{article.title}</b><small>{article.category} - {article.read}</small></span></button>;
}

function Meta({ article }: { article: Article }) {
  return <small className="meta">{article.author} - {article.date} - {article.read}</small>;
}

function CategoryFilters({ category, setCategory }: any) {
  return <div className="chips">{categories.map((cat) => <button className={category === cat ? "active" : ""} key={cat} onClick={() => setCategory(cat)}>{cat}</button>)}</div>;
}

function PopularSection() {
  return <section className="popular"><h2>Berita Populer</h2>{articles.slice().sort((a, b) => b.views - a.views).slice(0, 5).map((article, index) => <button key={article.slug} onClick={() => navigate(`/berita/${article.slug}`)}><b>{String(index + 1).padStart(2, "0")}</b><span>{article.title}<small>{article.views.toLocaleString("id-ID")} pembaca</small></span></button>)}</section>;
}

function EducationStrip() {
  return <section className="education-strip"><h2>Edukasi Crypto</h2><p>Mulai dari wallet, exchange, risiko investasi, regulasi, pajak, analisis fundamental, sampai pencegahan penipuan digital.</p><button onClick={() => navigate("/edukasi")}>Mulai Belajar</button></section>;
}

function EventPreview({ events: items = events }: { events?: EventItem[] }) {
  return <section className="content-section"><div className="section-head"><h2>Event dan Course</h2><button onClick={() => navigate("/event")}>Lihat Event</button></div><div className="event-grid">{items.slice(0, 2).map((event) => <EventCard key={event.id} event={event} />)}</div></section>;
}

function EventList({ title, items }: any) {
  return <div><h2>{title}</h2>{items.map((event: EventItem) => <EventCard key={event.id} event={event} />)}</div>;
}

function EventCard({ event }: { event: EventItem }) {
  const registrationUrl = event.registrationUrl || "#";
  return <article className="event-card"><div className="poster">{event.date.split(" ")[0]}<span>{event.status}</span></div><h3>{event.title}</h3><p>{event.speaker}</p><small>{event.date} - {event.time} - {event.place}</small><small>{event.price} - {event.quota}</small><a href={registrationUrl} target="_blank" aria-disabled={!event.registrationUrl}>{event.registrationUrl ? "Daftar" : "Belum Dibuka"}</a></article>;
  return <article className="event-card"><div className="poster">{event.date.split(" ")[0]}<span>{event.status}</span></div><h3>{event.title}</h3><p>{event.speaker}</p><small>{event.date} - {event.time} - {event.place}</small><small>{event.price} - {event.quota}</small><a href="https://wa.me/6280000000000" target="_blank">Daftar</a></article>;
}

function CommunitySection() {
  return <section className="community"><h2>Bergabung dengan Komunitas Crypto Legal</h2><p>Dapatkan informasi terbaru, diskusi regulasi, edukasi crypto, webinar, dan kesempatan berkolaborasi bersama komunitas.</p><a href={communityWhatsAppUrl} target="_blank">Gabung WhatsApp</a><a href="https://instagram.com/">Ikuti Instagram</a></section>;
}

function Footer() {
  return <footer><div><img src="/clc-logo.png" alt="Logo CLC" /><p>Crypto Legal Community adalah media dan komunitas edukasi hukum, crypto, blockchain, Web3, investasi, dan ekonomi digital.</p></div><div><b>Navigasi</b><button onClick={() => navigate("/berita")}>Berita</button><button onClick={() => navigate("/edukasi")}>Edukasi</button><button onClick={() => navigate("/event")}>Event</button></div><div><b>Kontak</b><span>Email: cryptolegalcommunity@gmail.com</span><span>TikTok: cryptolegalcommunity</span><span>Instagram: cryptolegalcommunity_</span><span>WhatsApp: 085720384852</span></div><p className="disclaimer">Informasi yang disajikan di Crypto Legal Community bertujuan untuk edukasi dan informasi, bukan merupakan nasihat hukum, keuangan, maupun rekomendasi investasi. Disclaimer - Kebijakan Privasi - Syarat dan Ketentuan</p></footer>;
}

function ProgressBar() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const onScroll = () => setWidth((scrollY / (document.body.scrollHeight - innerHeight)) * 100);
    addEventListener("scroll", onScroll);
    return () => removeEventListener("scroll", onScroll);
  }, []);
  return <span className="progress-bar" style={{ width: `${width}%` }} />;
}


