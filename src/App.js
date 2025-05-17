import React, { useState } from 'react';
import './App.css';

function App() {
  const [candidates, setCandidates] = useState(Array(10).fill(''));
  const [votes, setVotes] = useState(Array(10).fill(0));
  const [voterName, setVoterName] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [results, setResults] = useState(null);

  const handleNameChange = (index, value) => {
    const newCandidates = [...candidates];
    newCandidates[index] = value;
    setCandidates(newCandidates);
  };

  const handleVote = () => {
    const candidateIndex = candidates.findIndex(name => name === selectedCandidate);
    if (voterName.trim() === '' || candidateIndex === -1) {
      alert('Por favor, ingrese su nombre y seleccione un candidato válido.');
      return;
    }

    const newVotes = [...votes];
    newVotes[candidateIndex]++;
    setVotes(newVotes);
    setVoterName('');
    setSelectedCandidate('');
  };

  const calculateResults = async () => {
    const resultArray = candidates.map((name, index) => ({
      nombre: name,
      votos: votes[index],
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
    setVoterName('');
    setSelectedCandidate('');
  };

  return (
    <div className="app-container">
      <h1>🗳️ Elección del Nuevo Papa</h1>

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

        <hr />

        <h2>Registrar Voto</h2>
        <input
          type="text"
          placeholder="Tu nombre"
          value={voterName}
          onChange={(e) => setVoterName(e.target.value)}
          className="input-candidate"
        />

        <select
          value={selectedCandidate}
          onChange={(e) => setSelectedCandidate(e.target.value)}
          className="input-candidate"
        >
          <option value="">Selecciona un candidato</option>
          {candidates.map((candidate, index) =>
            candidate ? (
              <option key={index} value={candidate}>
                {candidate}
              </option>
            ) : null
          )}
        </select>

        <div className="button-group">
          <button onClick={handleVote} className="btn primary">Votar</button>
          <button onClick={calculateResults} className="btn success">Ver Resultados</button>
          <button onClick={reset} className="btn secondary">Resetear</button>
        </div>
      </div>

      {results && (
        <div className="results-section">
          <h2>🏆 Ganador: <span className="highlight">{results.winner.nombre}</span> con {results.winner.votos} votos</h2>
          <h3>Top 3 Candidatos:</h3>
          <div className="cards">
            {results.topThree.map((candidate, index) => (
              <div key={index} className="card">
                <strong>{candidate.nombre}</strong>
                <p>{candidate.votos} votos</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;