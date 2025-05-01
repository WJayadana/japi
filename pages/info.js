import Head from 'next/head';

export default function Info() {
  return (
    <>
      <Head>
        <title>Pengertian - Xavier</title>
      </Head>
      <main style={{ padding: '40px', color: 'inherit', background: 'inherit' }}>
        <h1>Apa Itu Xavier?</h1>
        <p>Xavier adalah platform API publik gratis yang dibuat oleh Vendetta/Xavier.</p>
        <p>Tujuannya adalah untuk memberikan akses ke berbagai layanan digital dengan mudah, cepat, dan gratis untuk komunitas developer, pelajar, atau siapa saja yang butuh API.</p>
        <p>Kamu bisa menggunakan Xavier untuk belajar, testing bot, atau digunakan secara nyata (production) dengan tetap menjaga batas penggunaan.</p>
      </main>
    </>
  );
}
