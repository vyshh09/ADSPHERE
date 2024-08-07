import React, { useEffect } from 'react';
// import ReactDOM from 'react-dom/client';
import { useNavigate } from 'react-router-dom';
import './index.css';

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/dashboard")
  }, [])

  return (
    <div className="App">
      Hello!
    </div>
  );
}

export default App;