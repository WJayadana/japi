import Head from 'next/head';

export default function ApiPage() {
  return (
    <>
      <Head>
        <title>API - Xavier</title>
      </Head>
      <main style={{ padding: '40px', color: 'inherit', background: 'inherit' }}>
        <h1>Dokumentasi API Xavier</h1>
        <p>API Xavier menyediakan berbagai fitur untuk digunakan publik:</p>
        <ul>
          <li>Random Quotes, Hadis, Doa</li>
          <li>Downloader YouTube, TikTok, Instagram</li>
          <li>Convert gambar ke teks dan sebaliknya</li>
          <li>AI Chat & Gambar (OpenAI based)</li>
        </ul>
        <p>Lihat dokumentasi lengkap di halaman utama.</p>
      </main>
    </>
  );
}