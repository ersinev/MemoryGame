import React, { useState, useEffect } from "react";
import Card from "./Card";
import { cardsData } from "../cards";
import Timer from "./Timer";
import PlayerInput from "./PlayerInput";
import { Button, Col, Container } from "react-bootstrap";



function Game() {
  const [cardsState, setCardsState] = useState(cardsData);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [disableClick, setDisableClick] = useState(false);
  const [showEntryPage, setShowEntryPage] = useState(true); // State to control entry page visibility
  const [showContainer, setShowContainer] = useState(false); // State to control container visibility

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

  // Function to handle starting the game and showing the container
  const handleStartGame = () => {
    setShowEntryPage(false); // Hide the entry page
    setShowContainer(true); // Show the container
  };

  return (
    <>
      <Container fluid >
        
        {showEntryPage && (
          <div className="entryPage" style={{ color: "white" }}>
            <PlayerInput/>
            
            <Button onClick={handleStartGame}>Start Game</Button>
            
          </div>
        )}

        {/* Conditionally render the container based on showContainer */}
        {showContainer && (
          <Container className="container-fluid">
            <Timer />
            <div className="memory-game">
              {cardsState.map((card) => (
                <Card
                  key={card.id}
                  card={card}
                  onClick={() => handleClick(card)}
                  image={card.img}
                  isMatched={isCardMatched(card)}
                />
              ))}
            </div>
          </Container>
        )}
      </Container>
    </>
  );
}

export default Game;
