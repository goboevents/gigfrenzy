'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [backendMessage, setBackendMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/')
      .then((response) => response.text())
      .then((data) => setBackendMessage(data))
      .catch((error) => console.error('Error fetching from backend:', error));
  }, []);

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Welcome to the Event Vendor App</h1>
      <p style={{ color: 'red' }}>Message from backend: {backendMessage}</p>
    </main>
  );
}
