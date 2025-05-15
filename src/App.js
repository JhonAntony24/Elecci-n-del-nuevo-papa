import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [candidates, setCandidates] = useState(Array(10).fill(''));
  const [votes, setVotes] = useState(Array(10).fill(0));
  const [results, setResults] = useState(null);

  const handleNameChange = (index, value) => {
    const newCandidates = [...candidates];
    newCandidates[index] = value;
    setCandidates(newCandidates);
  };

  const generateVotes = async () => {
  const randomVotes = Array(10).fill(0);
  for (let i = 0; i < 30; i++) {
    const vote = Math.floor(Math.random() * 10);
    randomVotes[vote]++;
  }

  setVotes(randomVotes);

  const resultArray = candidates.map((name, index) => ({
    nombre: name,
    votos: randomVotes[index],
  }));

  resultArray.sort((a, b) => b.votos - a.votos);

  setResults({
    topThree: resultArray.slice(0, 3),
    winner: resultArray[0],
  });

  try {
    await fetch('http://localhost:5000/api/candidatos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resultArray),
    });
  } catch (err) {
    console.error('❌ Error al guardar candidatos:', err);
  }
};

  const reset = () => {
    setCandidates(Array(10).fill(''));
    setVotes(Array(10).fill(0));
    setResults(null);
  };

  return (
    <div className="app-container">
      <h1>🗳️Elección del Nuevo Papa</h1>

      <div className="form-section">
        {candidates.map((candidate, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Candidato ${index + 1}`}
            value={candidate}
            onChange={(e) => handleNameChange(index, e.target.value)}
            className="input-candidate"
          />
        ))}

        <div className="button-group">
          <button onClick={generateVotes} className="btn primary">Elegir Ganador</button>
          <button onClick={reset} className="btn secondary">Resetear</button>
        </div>
      </div>

      {results && (
        <div className="results-section">
          <h2>🏆 Ganador: <span className="highlight">{results.winner.name}</span> con {results.winner.votes} votos</h2>
          <h3>Top 3 Candidatos:</h3>
          <div className="cards">
            {results.topThree.map((candidate, index) => (
              <div key={index} className="card">
                <strong>{candidate.name}</strong>
                <p>{candidate.votes} votos</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
