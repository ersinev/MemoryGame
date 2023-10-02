import React, { useState, useEffect } from "react";
import Card from "./Card";
import { cardsData } from "../cards";

function Game() {
  const [cardsState, setCardsState] = useState(cardsData);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [disableClick, setDisableClick] = useState(false);

  useEffect(() => {
    checkForMatch();
  }, [selectedCards]);

  const handleClick = (clickedCard) => {
    if (clickedCard.isFlipped || selectedCards.length >= 2 || disableClick) {
      return; // Ignore clicks on flipped cards, when two cards are already selected, or when waiting for cards to close
    }

    flipCard(clickedCard.id, true);
    setSelectedCards([...selectedCards, clickedCard]);
  };

  const flipCard = (id, isFlipped) => {
    const updatedCardsState = cardsState.map((card) => {
      if (card.id === id) {
        card.isFlipped = isFlipped;
      }
      return card;
    });
    setCardsState(updatedCardsState);
  };

  const checkForMatch = () => {
    if (selectedCards.length === 2) {
      const [firstCard, secondCard] = selectedCards;

      if (firstCard.key === secondCard.key) {
        // Matching pair found, mark them as matched
        setMatchedPairs([...matchedPairs, firstCard.key]);
      } else {
        // Keys don't match, close both cards after a delay
        setDisableClick(true); // Disable clicks temporarily
        setTimeout(() => {
          flipCard(firstCard.id, false);
          flipCard(secondCard.id, false);
          setDisableClick(false); // Enable clicks after cards are closed
        }, 1000); // Delay for 1 second
      }

      setSelectedCards([]);
    }
  };

  const isCardMatched = (card) => {
    return matchedPairs.includes(card.key);
  };

  return (
    <>
    

    <section className="memory-game">
      {cardsState.map((card) => (
        <Card
          key={card.id}
          card={card}
          onClick={() => handleClick(card)}
          image={card.img}
          isMatched={isCardMatched(card)}
        />
      ))}
    </section>
    </>
  );
}

export default Game;
