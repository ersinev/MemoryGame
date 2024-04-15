import React from "react";
function Card({ card, onClick, image, isMatched }) {
  return (
    <div
    className={`memory-card${card.isFlipped ? " flip" : ""}${isMatched ? " matched" : ""}`}
      onClick={onClick}
      style={{ order: card.order }}
      data-testid={card.id}
    >
      <img
        className="front-face"
        src={require(`../assets/images/${image}`)}
        alt="Card"
      />
      <img className="back-face" src={require("./logo.png")} alt="JS Badge" />
    </div>
  );
}

export default Card;
