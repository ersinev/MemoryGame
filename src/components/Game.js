import React, { useState, useEffect } from 'react';
import Card from './Card';
import { cardsData } from '../cards';
import Timer from './Timer';
import PlayerInput from './PlayerInput';
import { Button, Container } from 'react-bootstrap';
import Players from './Players';

function Game() {
  const [cardsState, setCardsState] = useState(cardsData);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [disableClick, setDisableClick] = useState(false);
  const [showEntryPage, setShowEntryPage] = useState(true);
  const [showContainer, setShowContainer] = useState(false);
  const [players, setPlayers] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [points, setPoints] = useState({});
  const [closingCards, setClosingCards] = useState(false); // New state for card closing animation

  useEffect(() => {
    checkForMatch();
  }, [selectedCards]);

  useEffect(() => {
    if (players.length > 0) {
      setCurrentTurn(players[0]);
    }
  }, [players]);

  const handleClick = (clickedCard) => {
    if (clickedCard.isFlipped || selectedCards.length >= 2 || disableClick) {
      return;
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
        setMatchedPairs([...matchedPairs, firstCard.key]);
  
        // Award a point to the current player
        const updatedPoints = { ...points };
        updatedPoints[currentTurn] = (updatedPoints[currentTurn] || 0) + 1;
        setPoints(updatedPoints);
  
        // Wait for a bit (e.g., 1 second) before proceeding with the next turn
        setTimeout(() => {
          // Continue with the next player's turn
          rotateTurn();
        }, 1000);
      } else {
        setDisableClick(true);
        setClosingCards(true); // Cards are in the process of closing
  
        setTimeout(() => {
          flipCard(firstCard.id, false);
          flipCard(secondCard.id, false);
          setDisableClick(false);
          setClosingCards(false); // Cards have closed, enable the next player's turn
  
          // Continue with the next player's turn
          rotateTurn();
        }, 1000);
      }
  
      setSelectedCards([]);
    }
  };

  const rotateTurn = () => {
    const currentIndex = players.indexOf(currentTurn);
    const nextIndex = (currentIndex + 1) % players.length;
    setCurrentTurn(players[nextIndex]);
  };

  const isCardMatched = (card) => {
    return matchedPairs.includes(card.key);
  };

  const handleStartGame = () => {
    setShowEntryPage(false);
    setShowContainer(true);
    setPlayers(['Player1', 'Player2', 'Player3', 'Player4']);
  };

  return (
    <>
      <Container fluid>
        {showEntryPage && (
          <div className='entryPage' style={{ color: 'white' }}>
            <PlayerInput />
            <Button onClick={handleStartGame}>Start Game</Button>
          </div>
        )}

        {showContainer && (
          <Container className='container-fluid'>
            <Timer />
            <Players
              players={players}
              currentTurn={currentTurn}
              onPlayerClick={setCurrentTurn}
              points={points}
            />
            <div className='memory-game'>
              {cardsState.map((card) => (
                <Card
                  key={card.id}
                  card={card}
                  onClick={() => handleClick(card)}
                  image={card.img}
                  isMatched={isCardMatched(card)}
                  disableClick={disableClick || closingCards} // Disable clicks during card closing animation
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
