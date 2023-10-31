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
  }); // Add gameState state variable

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

    // Add an event listener for updating the game state
    socket.on("update-game-state", (updatedGameState) => {
      setGameState(updatedGameState);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, currentPlayerName]);

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

    if (currentTurn === socket.id) {
      socket.emit("flip-card", roomId, currentPlayerName, clickedCard.id);
      flipCard(clickedCard.id, true);
      setSelectedCards([...selectedCards, clickedCard]);
    }
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
    const currentIndex = players.findIndex((player) => player === currentTurn);
    const nextIndex = (currentIndex + 1) % players.length;
    setCurrentTurn(players[nextIndex]);
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
      socket.emit("start-game", enteredRoomId, cardsData);
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
              onPlayerClick={setCurrentTurn}
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
