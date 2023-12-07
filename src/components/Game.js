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
  const [gameStartTime, setGameStartTime] = useState(null);
  const [remainingTime, setRemainingTime] = useState(30 * 60 * 1000); // 30 minutes in milliseconds
  const [gameState, setGameState] = useState({
    turnedCards: [],
    matchedPairs: [],
  });

  useEffect(() => {
    const socket = io("http://localhost:5000");
    setSocket(socket);

    if (roomId && currentPlayerName) {
      socket.emit("join-room", roomId, currentPlayerName);
      console.log("this workeda")
    }

    socket.on("player-joined", (playersInRoom) => {
      setPlayers(playersInRoom);
      console.log("this workedb")
    });

    socket.on("player-left", (playersInRoom) => {
      setPlayers(playersInRoom);
      console.log("this workedc")
    });

    socket.on("game-started", (gameId, cardsData, startTime) => {
      setGameId(gameId);
      setCardsState(cardsData);
      setGameStartTime(startTime);
      
    });

    socket.on("turn-change", (newTurn) => {
      setCurrentTurn(newTurn);
      
    });


    socket.on("update-game-state", (updatedGameState) => {
      setGameState(updatedGameState);
      console.log(updatedGameState)
    });

    socket.on("close-cards", (closedCardIds) => {
      closeCards(closedCardIds);
    });

    socket.on("flip-card", (playerName, cardId) => {

      updateCardState(cardId, true);
    });

    socket.on("update-points",(updatedPoints)=>{
      setPoints(updatedPoints);
    })

    return () => {
      socket.disconnect();
    };
  }, [roomId, currentPlayerName]);

  useEffect(() => {
    checkForMatch();
  }, [selectedCards]);
 

  useEffect(() => {
    if (gameStartTime) {
      const timerInterval = setInterval(() => {
        setRemainingTime((prevRemainingTime) => {
          const currentTime = Date.now();
          const elapsedTime = currentTime - gameStartTime;
          const newRemainingTime = Math.max(0, 30 * 60 * 1000 - elapsedTime);

          // If the new remaining time is the same, clear the interval
          if (newRemainingTime === prevRemainingTime) {
            clearInterval(timerInterval);
          }

          return newRemainingTime;
        });
      }, 1000);

      // Cleanup interval on component unmount or when game ends
      return () => clearInterval(timerInterval);
    }
  }, [gameStartTime, remainingTime]);

  const updateCardState = (cardId, isFlipped) => {
    setCardsState((prevState) =>
      prevState.map((card) =>
        card.id === cardId ? { ...card, isFlipped } : card
      )
    );
  };

  const closeCards = (closedCardIds) => {
    setCardsState((prevState) => {
      const updatedState = prevState.map((card) =>
        closedCardIds.includes(card.id) ? { ...card, isFlipped: false } : card
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
  
    // Use the callback function to get the latest state
    setSelectedCards((prevSelectedCards) => {
      const newSelectedCards = [...prevSelectedCards, clickedCard];
  
      // Emit the "flip-card" event with the newSelectedCards
      socket.emit("flip-card", roomId, currentPlayerName, clickedCard.id, newSelectedCards);
  
      return newSelectedCards;
    });
  };

  const checkForMatch = () => {
    if (
      selectedCards.length === 2 &&
      !selectedCards.some((card) => card.isFlipped) &&
      !disableClick &&
      currentTurn === socket.id
    ) {
      const [firstCard, secondCard] = selectedCards;
  
      if (firstCard.key === secondCard.key) {
        setMatchedPairs([...matchedPairs, firstCard.key]);
  
        // Update points for the current player and emit to the server
        const currentPlayerId = currentTurn;
        const updatedPoints = {
          ...points,
          [currentPlayerId]: (points[currentPlayerId] || 0) + 1,
        };
        setPoints(updatedPoints);
        socket.emit("update-points", roomId, updatedPoints);
        socket.emit("update-game-state", roomId, currentPlayerName, firstCard.id);
        setTimeout(() => {
          rotateTurn(selectedCards);
        }, 1000);
      } else {
        setDisableClick(true);
  
        setTimeout(() => {
          const closingCardIds = selectedCards.map((card) => card.id);
          closeCards(closingCardIds);
  
          setDisableClick(false);
          rotateTurn(selectedCards);
        }, 1000);
      }
  
      setSelectedCards([]);
    }
  };
  
  
  



  const rotateTurn = (selectedCards) => {
    socket.emit("end-turn", roomId ,selectedCards);
  };

  const isCardMatched = (card) => {
    return matchedPairs.includes(card.key);
  };

  const handleStartGame = (enteredRoomId, playerName) => {
    setShowEntryPage(false);
    setShowContainer(true);
    setCurrentPlayerName(playerName);
    setRoomId(enteredRoomId);
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
            <Timer remainingTime={remainingTime} />
            <Players
              players={players}
              currentTurn={currentTurn}
              points={points}
              setPoints={setPoints}
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