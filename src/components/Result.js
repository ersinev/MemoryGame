import React from "react";

const Result = ({ players, points }) => {
  return (
    <div>
      <h2>Game Over</h2>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            {player.name}: {points[player.id] || 0} points
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Result;
