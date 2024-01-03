import React from 'react';
import Table from 'react-bootstrap/Table';

function Result({ players, points }) {
  // Find the highest points
  const highestPoints = Math.max(...players.map(player => points[player.id] || 0));

  // Find all players with the highest points
  const winners = players.filter(player => (points[player.id] || 0) === highestPoints);

  return (
    <div className='container-fluid'>
      <div style={{ textAlign: 'center', marginBottom: '100px'}}>
        <h2 style={{ marginBottom: '50px',alignItems:"center", fontFamily: "Bungee Inline, Arial, sans-serif", color: "green", fontSize: "100px" }}>
        <span role="img"  aria-label="crown">&#128081;</span> {winners.length === 1 ? 'Winner' : 'Winners'} <span role="img" aria-label="crown">&#128081;</span>
        </h2>
        {winners.length > 0 && (
          <div>
            {winners.map(winner => (
              <h1 key={winner.id} style={{ fontSize: "50px" }}>
                {winner.name}: {points[winner.id] || 0} punten
              </h1>
            ))}
          </div>
        )}
      </div>
      <hr />
      <div style={{ textAlign: 'center' }}>
        <Table striped bordered hover style={{ width: '60%', margin: 'auto'}}>
          <thead>
            <tr>
              <th>#</th>
              <th>Naam</th>
              <th>Punten</th>
            </tr>
          </thead>
          <tbody>
            {players
              .sort((a, b) => (points[b.id] || 0) - (points[a.id] || 0))
              .map((player, index) => (
                <tr key={player.id}>
                  <td>{index + 1}</td>
                  <td>{player.name}</td>
                  <td>{points[player.id] || 0}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default Result;
