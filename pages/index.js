import Head from 'next/head';
import Script from 'next/script';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import swaggerConfig from './swagger-config.json';
import { Inter } from 'next/font/google';
import { useEffect } from 'react';
import KebabMenu from './menu';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const swaggerUIConfig = {
    defaultModelRendering: 'model',
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      body,
      .swagger-ui .info .title,
      .swagger-ui .scheme-container,
      .swagger-ui select,
      .swagger-ui textarea,
      .swagger-ui input[type="text"],
      .swagger-ui input[type="email"],
      .swagger-ui input[type="file"],
      .swagger-ui input[type="password"],
      .swagger-ui input[type="search"],
      .swagger-ui .topbar,
      .swagger-ui .dialog-ux .modal-ux {
        background-color: #f2f2f2 !important;
      }

      .swagger-ui .opblock .opblock-section-header,
      .swagger-ui input[type="email"].invalid,
      .swagger-ui input[type="file"].invalid,
      .swagger-ui input[type="password"].invalid,
      .swagger-ui input[type="search"].invalid,
      .swagger-ui input[type="text"].invalid,
      .swagger-ui textarea.invalid {
        background-color: transparent;
      }

      .swagger-ui .opblock .opblock-section-header,
      .swagger-ui table thead tr td,
      .swagger-ui table thead tr th,
      .swagger-ui .opblock-tag,
      .swagger-ui .dialog-ux .modal-ux,
      .swagger-ui section.models .model-container,
      .swagger-ui section.models.is-open h4,
      .swagger-ui section.models,
      .swagger-ui .dialog-ux .modal-ux-header,
      .swagger-ui .auth-container {
        border-color: #bfbfbf;
      }

      .swagger-ui .opblock:hover {
        border-color: #a6a6a6;
      }

      .swagger-ui,
      .swagger-ui .info .title,
      .swagger-ui .scheme-container,
      .swagger-ui .model-title,
      .swagger-ui .opblock-summary-method,
      .swagger-ui .opblock-summary-path,
      .swagger-ui .response-col_status,
      .swagger-ui label,
      .swagger-ui .opblock-tag {
        color: #333333 !important;
      }

      footer {
        background-color: #d9d9d9;
        padding: 20px;
        text-align: center;
        color: #333333;
        font-family: ${inter.className};
        position: fixed;
        width: 100%;
        bottom: 0;
      }

      .swagger-ui .info .title {
        font-size: 32px;
        font-weight: bold;
        display: inline-block;
      }

      .swagger-ui .info .title::before {
        content: "";
        background: linear-gradient(90deg, red, purple, blue);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: gradientMove 7s infinite linear;
        background-size: 200% 200%;
      }

      @keyframes gradientMove {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      .swagger-ui .info .title span {
        color: #333333 !important;
      }

      body.dark-mode {
        background-color: #121212 !important;
        color: #ffffff !important;
      }

      body.dark-mode .swagger-ui {
        background-color: #1e1e1e !important;
        color: #ffffff !important;
      }

      body.dark-mode .swagger-ui .topbar {
        background-color: #1a1a1a !important;
      }

      body.dark-mode .swagger-ui .info .title,
      body.dark-mode .swagger-ui .opblock,
      body.dark-mode .swagger-ui input,
      body.dark-mode .swagger-ui textarea {
        background-color: #2a2a2a !important;
        color: #fff !important;
      }

      body.dark-mode footer {
        background-color: #1a1a1a;
        color: #ffffff;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Xavier - API Documentation</title>
        <meta name="title" content="Xavier - REST API Documentation" />
        <meta name="description" content="Xavier is a free, simple REST API created by Xavier for the common good. Feel free to use it, but please avoid DDoS attacks." />
        <meta name="keywords" content="REST API, Vendetta, Siputzx, Qanypaw, Nawdev, Itzpire API, free API, API documentation, bot wa, free REST API" />
        <meta name="robots" content="index, follow" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English, Indonesian" />
        <meta property="og:title" content="Xavier - REST API Documentation" />
        <meta property="og:description" content="Xavier is a free, simple REST API created by Xavier for the common good. Feel free to use it, but please avoid DDoS attacks." />
        <meta property="og:url" content="https://www.Xavier.site" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://pomf2.lain.la/f/pr6222ot.png" />
        <meta name="twitter:title" content="Xavier - REST API Documentation" />
        <meta name="twitter:description" content="Xavier is a free, simple REST API created by Vendetta for the common good. Feel free to use it, but please avoid DDoS attacks." />
        <meta name="twitter:image" content="https://pomf2.lain.la/f/pr6222ot.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.png" />
      </Head>
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "http://schema.org",
            "@type": "WebSite",
            "name": "Xavier",
            "url": "https://www.Xavier.site",
            "description": "Xavier is a free, simple REST API created by Vendetta for the common good. Feel free to use it, but please avoid DDoS attacks.",
            "sameAs": [
              "https://www.facebook.com/yourprofile",
              "https://www.twitter.com/yourprofile",
              "https://www.linkedin.com/in/yourprofile"
            ]
          })
        }}
      />
      <main className={inter.className}>
        <Analytics />
        <SpeedInsights />
        <KebabMenu />
        <div
          style={{
            position: 'fixed',
            top: 20,
            right: 60,
            zIndex: 999,
            backgroundColor: '#eee',
            padding: '6px 12px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
          onClick={() => {
            document.body.classList.toggle('dark-mode');
          }}
        >
          Toggle Mode
        </div>
        <SwaggerUI spec={swaggerConfig} {...swaggerUIConfig} />
      </main>
    </>
  );
}
