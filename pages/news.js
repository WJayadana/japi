import Head from 'next/head';

export default function News() {
  return (
    <>
      <Head>
        <title>Berita - Xavier</title>
      </Head>
      <main style={{ padding: '40px', color: 'inherit', background: 'inherit' }}>
        <h1>Berita & Update Terbaru</h1>
        <ul>
          <li>Update 1.2.0: Penambahan lebih dari 20 endpoint API baru!</li>
          <li>Xavier sekarang mendukung upload media via API</li>
          <li>Fitur dark mode telah ditambahkan</li>
          <li>Server diperbarui untuk kecepatan yang lebih tinggi</li>
        </ul>
      </main>
    </>
  );
}