import React, { useState, useEffect } from 'react';
import Card from './Card';
import { cardsData } from '../cards';
import Timer from './Timer';
import PlayerInput from './PlayerInput';
import { Button, Container } from 'react-bootstrap';
import Players from './Players';
import io from 'socket.io-client';

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
  const [closingCards, setClosingCards] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    checkForMatch();
  }, [selectedCards]);

  useEffect(() => {
    if (players.length > 0) {
      setCurrentTurn(players[0]);
    }
  }, [players]);

  useEffect(() => {
    // Connect to the Socket.io server
    const socket = io('http://localhost:5000'); // Replace with your server URL
    setSocket(socket);

    // Emit an event to join a room with a room ID and player name when the game starts
    const roomId = 'your-room-id'; // Replace with your room ID
    const playerName = 'Player1'; // Replace with the player's name
    socket.emit('join-room', roomId, playerName);

    socket.on('player-joined', (playersInRoom) => {
      setPlayers(playersInRoom);
      console.log(`${playersInRoom} joined the room`);
    });

    socket.on('player-left', (playersInRoom) => {
      setPlayers(playersInRoom);
      console.log(`${playersInRoom} left the room`);
    });

    // Handle game logic, card flips, and points here...

    return () => {
      socket.disconnect();
    };
  }, []);

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
        const updatedPoints = { ...points };
        updatedPoints[currentTurn] = (updatedPoints[currentTurn] || 0) + 1;
        setPoints(updatedPoints);

        setTimeout(() => {
          rotateTurn();
        }, 1000);
      } else {
        setDisableClick(true);
        setClosingCards(true);

        setTimeout(() => {
          flipCard(firstCard.id, false);
          flipCard(secondCard.id, false);
          setDisableClick(false);
          setClosingCards(false);

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
    const roomId = 'your-room-id'; // Replace with your room ID
    socket.emit('start-game', roomId);
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
                  disableClick={disableClick || closingCards}
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
