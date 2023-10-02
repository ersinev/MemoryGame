import React, { useState } from "react";
import Card from "./Card";
import { cardsData } from "../cards";

function Game() {
  const [cardsState, setCardsState] = useState(cardsData);
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);

  const handleClick = (clickedCard) => {
    if (clickedCard === firstCard || clickedCard === secondCard) {
      // Avoid clicking on the same card twice
      return;
    }

    if (firstCard === null) {
      // First card click
      setFirstCard(clickedCard);
    } else if (secondCard === null) {
      // Second card click
      setSecondCard(clickedCard);
    }

    // If both firstCard and secondCard are set, check for a match
    if (firstCard !== null && secondCard !== null) {
      if (firstCard.id === secondCard.id) {
        // Matching pair found
        markAsMatched(firstCard.id);
      }
      // Reset the first and second cards for the next turn
      setFirstCard(null);
      setSecondCard(null);
    }
  };

  const markAsMatched = (id) => {
    const updatedCardsState = cardsState.map((card) => {
      if (card.id === id) {
        card.matched = true;
      }
      return card;
    });
    setCardsState(updatedCardsState);
  };

  return (
    <section className="memory-game">
      {cardsState.map((card) => (
        <Card
          key={card.id}
          card={card}
          onClick={() => handleClick(card)}
          image={card.img}
        />
      ))}
    </section>
  );
}

export default Game;
