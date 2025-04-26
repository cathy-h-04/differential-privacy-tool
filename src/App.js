import React, { useState } from 'react';
import PrivacyForm from './PrivacyForm';
import DataVisualization from './DataVisualization';
import './App.css';

function App() {
  const [privatizedData, setPrivatizedData] = useState(null);
  const [epsilon, setEpsilon] = useState(1.0);

  const handleDataSubmit = (data, eps) => {
    setPrivatizedData(data);
    setEpsilon(eps);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Privacy-Preserving Data Visualization</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <PrivacyForm onDataSubmit={handleDataSubmit} />
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <DataVisualization privatizedData={privatizedData} epsilon={epsilon} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;



// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
