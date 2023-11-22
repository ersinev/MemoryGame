// Game.js

import React, { useState, useEffect } from "react";
import Card from "./Card";
import { cardsData } from "../cards";
import Timer from "./Timer";
import PlayerInput from "./PlayerInput";
import Players from "./Players";
import io from "socket.io-client";

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
  const [roomId, setRoomId] = useState("");
  const [currentPlayerName, setCurrentPlayerName] = useState("");
  const [gameId, setGameId] = useState(null);
  const [gameState, setGameState] = useState({
    turnedCards: [],
    matchedPairs: [],
  });

  useEffect(() => {
    const socket = io("http://localhost:5000");
    setSocket(socket);

    if (roomId && currentPlayerName) {
      socket.emit("join-room", roomId, currentPlayerName);
    }

    socket.on("player-joined", (playersInRoom) => {
      setPlayers(playersInRoom);
    });

    socket.on("player-left", (playersInRoom) => {
      setPlayers(playersInRoom);
    });

    socket.on("game-started", (gameId, cardsData) => {
      setGameId(gameId);
      setCardsState(cardsData);
    });

    socket.on("turn-change", (newTurn) => {
      setCurrentTurn(newTurn);
    });

    socket.on("update-game-state", (updatedGameState) => {
      setGameState(updatedGameState);
    });

    socket.on("flip-card", (playerName, cardId) => {
      // Update the game state to show the flipped card
      updateCardState(cardId, true);
    });

    socket.on("close-cards", (roomId, cardIds) => {
      // Broadcast to all clients in the room
      io.to(roomId).emit("close-cards", cardIds);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, currentPlayerName]);

  useEffect(() => {
    checkForMatch();
  }, [selectedCards]);

  const updateCardState = (cardId, isFlipped) => {
    setCardsState((prevState) =>
      prevState.map((card) =>
        card.id === cardId ? { ...card, isFlipped } : card
      )
    );
  };

  const closeCards = (cardIds) => {
    setCardsState((prevState) => {
      const updatedState = prevState.map((card) =>
        cardIds.includes(card.id) ? { ...card, isFlipped: false } : card
      );

      return updatedState;
    });
  };

  const handleClick = (clickedCard) => {
    if (
      clickedCard.isFlipped ||
      selectedCards.length >= 2 ||
      disableClick ||
      currentTurn !== socket.id
    ) {
      return;
    }

    socket.emit("flip-card", roomId, currentPlayerName, clickedCard.id);
    setSelectedCards([...selectedCards, clickedCard]);
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
          const closingCardIds = selectedCards.map((card) => card.id);
          closeCards(closingCardIds);

          setDisableClick(false);
          setClosingCards(false);

          rotateTurn();
        }, 1000);
      }

      setSelectedCards([]);
    }
  };

  const rotateTurn = () => {
    socket.emit("end-turn", roomId);
  };

  const isCardMatched = (card) => {
    return matchedPairs.includes(card.key);
  };

  const handleStartGame = (enteredRoomId, playerName) => {
    if (!enteredRoomId || !playerName) {
      alert("Please enter your name and room ID.");
      return;
    }

    setShowEntryPage(false);
    setShowContainer(true);

    if (enteredRoomId) {
      setCurrentPlayerName(playerName);
      setRoomId(enteredRoomId);
    }
  };

  return (
    <>
      <div className="container-fluid main">
        {showEntryPage && (
          <div className="entryPage" style={{ color: "white" }}>
            <PlayerInput onJoinGame={handleStartGame} setTheRoom={setRoomId} />
          </div>
        )}

        {showContainer && (
          <div className="container">
            <Timer />
            <Players
              players={players}
              currentTurn={currentTurn}
              points={points}
            />
            <div className="memory-game">
              {cardsState.map((card) => (
                <Card
                  key={card.id}
                  card={card}
                  onClick={() => handleClick(card)}
                  image={card.img}
                  isMatched={isCardMatched(card)}
                  isTurned={gameState.turnedCards.some(
                    (turn) => turn.cardId === card.id
                  )}
                  disableClick={disableClick || closingCards}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Game;
