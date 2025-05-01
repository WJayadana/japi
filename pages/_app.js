import { footer } from "../settings";
 
export default function App({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        @font-face {
          font-family: 'CustomFont';
          src: url('/fonts/hytam.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
      `}</style>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden'
      }}>
        <main style={{ flex: 1, width: '100%' }}>
          <Component {...pageProps} />
        </main>

        <footer style={{
          backgroundColor: 'rgba(0, 0, 0, 0)',
          padding: '20px 10px',
          textAlign: 'center',
          color: '#6a747d',
          width: '100%',
          fontSize: '15px',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          fontFamily: 'CustomFont, sans-serif'
        }}>
          Developed by <a href={footer.url} style={{
            color: '#62afff',
            textDecoration: 'none',
            marginLeft: '5px',
            fontFamily: 'CustomFont, sans-serif'
          }}>
            {footer.name}
          </a>
        </footer>
      </div>
    </>
  );
}
