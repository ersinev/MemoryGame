import Table from 'react-bootstrap/Table';

function Result({ players, points }) {
  const winner = players.length > 0 ? players[0] : null;

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '100px' }}>
        <h2 style={{fontFamily:"Bungee Inline, Arial, sans-serif", color:"green", fontSize:"100px"}}>
          <span role="img" aria-label="crown">&#128081;</span> Winner <span role="img" aria-label="crown">&#128081;</span>
        </h2>
        {winner && (
          <h1 style={{fontSize:"50px"}}>
            {winner.name}: {points[winner.id] || 0} points
          </h1>
        )}
      </div>
          <hr/>
      <div style={{ textAlign: 'center' }}>
        
        <Table striped bordered hover style={{ width: '50%', margin: 'auto',backgroundColor: 'red' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Points</th>
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
