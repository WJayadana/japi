import Head from 'next/head';

export default function Store() {
  return (
    <>
      <Head>
        <title>Store - Xavier</title>
      </Head>
      <main style={{ padding: '40px', color: 'inherit', background: 'inherit' }}>
        <h1>Toko Digital Xavier</h1>
        <p>Selamat datang di store resmi Xavier. Di sini kamu bisa membeli:</p>
        <ul>
          <li>Akses Premium API</li>
          <li>Bot WhatsApp custom</li>
          <li>Template proyek source code</li>
          <li>Layanan deploy ke VPS/Vercel</li>
        </ul>
        <p>Hubungi admin melalui WhatsApp untuk pemesanan.</p>
      </main>
    </>
  );
}