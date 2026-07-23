"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Article = {
  id: number;
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
  id: number;
  title: string;
  date: string;
  time: string;
  place: string;
  status: "Dibuka" | "Selesai";
  price: string;
  quota: string;
  speaker: string;
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
  },
];

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

export default function Home() {
  const [path, setPath] = useState("/");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [dark, setDark] = useState(false);
  const [menu, setMenu] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [admin, setAdmin] = useState(false);
  const [drafts, setDrafts] = useState<Article[]>([]);

  useEffect(() => {
    const sync = () => setPath(window.location.pathname);
    sync();
    window.addEventListener("popstate", sync);
    setDark(localStorage.getItem("clc-theme") === "dark");
    setBookmarks(JSON.parse(localStorage.getItem("clc-bookmarks") || "[]"));
    setAdmin(localStorage.getItem("clc-admin") === "true");
    setDrafts(JSON.parse(localStorage.getItem("clc-drafts") || "[]"));
    return () => window.removeEventListener("popstate", sync);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("clc-theme", dark ? "dark" : "light");
  }, [dark]);

  const allArticles = [...drafts, ...articles];
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
  };

  if (path === "/admin") {
    return (
      <AdminPage
        admin={admin}
        setAdmin={setAdmin}
        drafts={drafts}
        saveDraft={saveDraft}
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
        {path === "/event" && <EventPage />}
        {path === "/tentang-clc" && <AboutPage />}
      </main>
      <Footer />
      <button className="back-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        ↑
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
          <span>⌕</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari artikel" />
        </label>
        <button className="icon-btn" onClick={() => setDark(!dark)} aria-label="Ganti mode">
          {dark ? "☀" : "☾"}
        </button>
        <a className="join" href="https://wa.me/6280000000000" target="_blank">Gabung Komunitas</a>
        <button className="hamburger" onClick={() => setMenu(!menu)} aria-label="Menu">☰</button>
      </div>
    </header>
  );
}

function HomePage(props: any) {
  const featured = articles[0];
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
          {articles.slice(1, 4).map((article) => <SmallArticle key={article.slug} article={article} />)}
        </aside>
      </section>
      <ArticleSection title="Berita Terbaru" articles={props.filtered.slice(0, 6)} {...props} />
      <PopularSection />
      <ArticleSection title="Fokus Regulasi dan Hukum" articles={articles.filter((a) => ["Regulasi", "Hukum", "Pajak"].includes(a.category))} {...props} />
      <EducationStrip />
      <EventPreview />
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
        <label className="search wide"><span>⌕</span><input value={props.query} onChange={(e) => props.setQuery(e.target.value)} placeholder="Cari regulasi, pajak, blockchain..." /></label>
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

function EventPage() {
  return <section className="page-shell"><h1>Event dan Course CLC</h1><div className="event-columns"><EventList title="Event Mendatang" items={events.filter((e) => e.status === "Dibuka")} /><EventList title="Event Selesai" items={events.filter((e) => e.status === "Selesai")} /></div></section>;
}

function AboutPage() {
  return <section className="page-shell about"><h1>Tentang Crypto Legal Community</h1><p>Crypto Legal Community merupakan media dan komunitas edukasi yang berfokus pada hukum, cryptocurrency, blockchain, Web3, investasi, serta ekonomi digital.</p><div className="stats"><b>200+ anggota</b><b>Ratusan artikel</b><b>Kolaborasi event literasi digital</b></div><h2>Visi</h2><p>Menjadi rujukan nasional untuk literasi hukum, crypto, dan ekonomi digital yang akurat, mudah dipahami, dan bertanggung jawab.</p><h2>Misi</h2><p>Menyediakan artikel edukatif, membuka ruang diskusi, memperkuat keamanan aset digital, dan membangun kolaborasi lintas komunitas.</p><h2>Kontak Kerja Sama</h2><p>Email: halo@cryptolegal.community | WhatsApp: +62 800 0000 0000</p></section>;
}

function AdminPage({ admin, setAdmin, drafts, saveDraft }: any) {
  const [title, setTitle] = useState("");
  const [tab, setTab] = useState("Artikel");
  const login = (e: FormEvent) => { e.preventDefault(); setAdmin(true); localStorage.setItem("clc-admin", "true"); };
  if (!admin) return <main className="admin-login"><form onSubmit={login}><img src="/clc-logo.png" alt="CLC" /><h1>Login Admin CLC</h1><input required placeholder="Email admin" type="email" /><input required placeholder="Password" type="password" /><button className="primary">Masuk Dashboard</button><p>Prototype: gunakan email dan password apa saja.</p></form></main>;
  const tabs = ["Artikel", "Event", "Course", "Kategori", "Penulis", "Statistik"];
  return (
    <main className="admin">
      <aside>
        <img src="/clc-logo.png" alt="CLC" />
        {tabs.map((item) => (
          <button className={tab === item ? "active" : ""} key={item} onClick={() => setTab(item)}>
            {item}
          </button>
        ))}
        <button onClick={() => { setAdmin(false); localStorage.removeItem("clc-admin"); }}>Keluar</button>
      </aside>
      <section>
        <h1>Dashboard Admin</h1>
        <div className="admin-stats"><b>{articles.length + drafts.length} Artikel</b><b>{drafts.length} Draft</b><b>81.620 Pembaca</b><b>2 Event Aktif</b></div>
        {tab === "Artikel" && <form className="editor" onSubmit={(e) => { e.preventDefault(); saveDraft({ ...articles[0], id: Date.now(), title, slug: title.toLowerCase().replaceAll(" ", "-"), date: "Draft", updated: "Draft", views: 0 }); setTitle(""); }}><h2>Manajemen Artikel</h2><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul artikel" required /><select>{categories.slice(1).map((cat) => <option key={cat}>{cat}</option>)}</select><textarea placeholder="Editor: heading, paragraf, bold, italic, link, gambar, kutipan, daftar, dan tabel." /><div className="editor-actions"><button>Publikasikan / Simpan Draft</button><button type="button" onClick={() => alert("Preview artikel tersedia di mode prototype.")}>Preview</button><button type="button" onClick={() => alert("Publikasi terjadwal tersimpan sebagai simulasi.")}>Jadwalkan</button></div></form>}
        {tab === "Event" && <div className="admin-panel"><h2>Manajemen Event</h2><input placeholder="Nama event" /><input type="datetime-local" /><input placeholder="Link pendaftaran" /><select><option>Dibuka</option><option>Selesai</option></select><button className="primary">Simpan Event</button>{events.map((event) => <EventCard key={event.id} event={event} />)}</div>}
        {tab === "Course" && <div className="admin-panel"><h2>Manajemen Course dan Edukasi</h2><input placeholder="Judul materi" /><select><option>Pemula</option><option>Menengah</option><option>Lanjutan</option></select><input placeholder="Link video atau referensi eksternal" /><textarea placeholder="Deskripsi materi edukasi" /><button className="primary">Simpan Materi</button></div>}
        {tab === "Kategori" && <div className="admin-panel"><h2>Manajemen Kategori</h2><input placeholder="Nama kategori baru" /><input type="color" defaultValue="#1262d6" /><button className="primary">Tambah Kategori</button><div className="chips">{categories.slice(1).map((cat) => <button key={cat}>{cat}</button>)}</div></div>}
        {tab === "Penulis" && <div className="admin-panel"><h2>Manajemen Penulis</h2><input placeholder="Nama penulis" /><input placeholder="Email atau media sosial" /><textarea placeholder="Bio penulis" /><button className="primary">Simpan Penulis</button><SmallArticle article={articles[0]} /></div>}
        {tab === "Statistik" && <div className="admin-panel"><h2>Statistik</h2><div className="stats"><b>Regulasi kategori teratas</b><b>21.450 pembaca artikel keamanan</b><b>Pertumbuhan pembaca 18%</b></div><h2>Artikel Paling Populer</h2>{articles.slice().sort((a, b) => b.views - a.views).slice(0, 3).map((a) => <SmallArticle key={a.slug} article={a} />)}</div>}
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
  return <button className="small-article" onClick={() => navigate(`/berita/${article.slug}`)}><img src={article.image} alt={article.title} /><span><b>{article.title}</b><small>{article.category} · {article.read}</small></span></button>;
}

function Meta({ article }: { article: Article }) {
  return <small className="meta">{article.author} · {article.date} · {article.read}</small>;
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

function EventPreview() {
  return <section className="content-section"><div className="section-head"><h2>Event dan Course</h2><button onClick={() => navigate("/event")}>Lihat Event</button></div><div className="event-grid">{events.slice(0, 2).map((event) => <EventCard key={event.id} event={event} />)}</div></section>;
}

function EventList({ title, items }: any) {
  return <div><h2>{title}</h2>{items.map((event: EventItem) => <EventCard key={event.id} event={event} />)}</div>;
}

function EventCard({ event }: { event: EventItem }) {
  return <article className="event-card"><div className="poster">{event.date.split(" ")[0]}<span>{event.status}</span></div><h3>{event.title}</h3><p>{event.speaker}</p><small>{event.date} · {event.time} · {event.place}</small><small>{event.price} · {event.quota}</small><a href="https://wa.me/6280000000000" target="_blank">Daftar</a></article>;
}

function CommunitySection() {
  return <section className="community"><h2>Bergabung dengan Komunitas Crypto Legal</h2><p>Dapatkan informasi terbaru, diskusi regulasi, edukasi crypto, webinar, dan kesempatan berkolaborasi bersama komunitas.</p><a href="https://wa.me/6280000000000">Gabung WhatsApp</a><a href="https://instagram.com/">Ikuti Instagram</a></section>;
}

function Footer() {
  return <footer><div><img src="/clc-logo.png" alt="Logo CLC" /><p>Crypto Legal Community adalah media dan komunitas edukasi hukum, crypto, blockchain, Web3, investasi, dan ekonomi digital.</p></div><div><b>Navigasi</b><button onClick={() => navigate("/berita")}>Berita</button><button onClick={() => navigate("/edukasi")}>Edukasi</button><button onClick={() => navigate("/event")}>Event</button></div><div><b>Kontak</b><span>halo@cryptolegal.community</span><span>Instagram · TikTok · LinkedIn · WhatsApp</span></div><p className="disclaimer">Informasi yang disajikan di Crypto Legal Community bertujuan untuk edukasi dan informasi, bukan merupakan nasihat hukum, keuangan, maupun rekomendasi investasi. Disclaimer · Kebijakan Privasi · Syarat dan Ketentuan</p></footer>;
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
