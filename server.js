// Example for React.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

function App() {
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      const ganacheUrl = 'http://127.0.0.1:7545'; // Ganache local blockchain URL
      const newWeb3 = new Web3(ganacheUrl);
      setWeb3(newWeb3);
    };

    initWeb3();
  }, []);

  return (
    <div className="App">
      <h1>Your DApp</h1>
      {/* Your DApp content */}
    </div>
  );
}

export default App;
