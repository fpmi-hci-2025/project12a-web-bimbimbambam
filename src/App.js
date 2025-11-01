import { useState, useEffect } from 'react';

function App() {
  const [message, setMessage] = useState('');

  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8080";

  useEffect(() => {
    fetch(`${apiUrl}/hello`)
      .then(res => res.text())
      .then(data => setMessage(data))
      .catch(err => console.error(err));
  }, [apiUrl]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>{message || "Loading..."}</h1>
    </div>
  );
}

export default App;
