import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const KebabMenu = () => {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      setDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: 20,
      right: 20,
      zIndex: 9999
    }}>
      <div style={{ fontSize: '24px', cursor: 'pointer' }} onClick={() => setOpen(!open)}>
        &#8942;
      </div>
      {open && (
        <div style={{
          marginTop: '10px',
          backgroundColor: darkMode ? '#333' : '#fff',
          color: darkMode ? '#fff' : '#000',
          border: '1px solid #ccc',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          borderRadius: '6px',
          overflow: 'hidden',
        }}>
          <Link href="/store"><div style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Store</div></Link>
          <Link href="/news"><div style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Berita</div></Link>
          <Link href="/api"><div style={{ padding: '10px', borderBottom: '1px solid #eee' }}>API</div></Link>
          <Link href="/info"><div style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Pengertian</div></Link>
          <div onClick={toggleTheme} style={{ padding: '10px', cursor: 'pointer', backgroundColor: darkMode ? '#222' : '#f5f5f5' }}>
            Mode: {darkMode ? 'Gelap' : 'Terang'}
          </div>
        </div>
      )}
    </div>
  );
};

export default KebabMenu;