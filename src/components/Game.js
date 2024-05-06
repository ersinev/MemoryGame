import React, { useState, useEffect } from "react";
import Card from "./Card";
import { cardsData } from "../cards";
import Timer from "./Timer";
import PlayerInput from "./PlayerInput";
import Players from "./Players";
import io from "socket.io-client";
import Result from "./Result";
import Modal from "./Modal";

function Game() {
  const [cardsState, setCardsState] = useState(cardsData);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [disableClick, setDisableClick] = useState(false);
  const [showEntryPage, setShowEntryPage] = useState(true);
  const [showContainer, setShowContainer] = useState(false);
  const [showResultPage, setShowResultpage] = useState(false);
  const [players, setPlayers] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [points, setPoints] = useState({});
  const [socket, setSocket] = useState(null);
  const [roomId, setRoomId] = useState("");
  const [currentPlayerName, setCurrentPlayerName] = useState("");
  const [gameStartTime, setGameStartTime] = useState(null);
  const [remainingTime, setRemainingTime] = useState(30 * 60 * 1000); // 30 minutes 
  const [gameState, setGameState] = useState({
    turnedCards: [],
    matchedPairs: [],
  });

  const [lastMatchedPairs, setlastMatchedPairs] = useState([])
  const [ModalOpen, setModalOpen] = useState(false)

  //"http://localhost:5000"
  //"https://memorygame-we7d.onrender.com"
  const url = "https://memorygame-we7d.onrender.com"

  useEffect(() => {
    // Function to establish socket connection and join room
    const initializeSocketAndJoinRoom = () => {
      console.log("server triggered")
      
      const socket = io(url);
      setSocket(socket);
      
      
      

      // Join room if both roomId and currentPlayerName are available
      if (roomId && currentPlayerName) {
        socket.emit("join-room", roomId, currentPlayerName);
      }

      // Set up event listeners
      socket.on("player-joined", (playersInRoom) => {
        setPlayers(playersInRoom);
      });

      socket.on("player-left", (playersInRoom) => {
        setPlayers(playersInRoom);
      });

      socket.on("game-started", (gameId, cardsData, startTime) => {
        setCardsState(cardsData);
        setGameStartTime(startTime);
      });

      socket.on("turn-change", (newTurn) => {
        setCurrentTurn(newTurn);
      });

      socket.on("update-game-state", (updatedGameState) => {
        setGameState(updatedGameState);
      });

      socket.on("close-cards", (closedCardIds) => {
        closeCards(closedCardIds);
      });

      socket.on("flip-card", (playerName, cardId) => {
        updateCardState(cardId, true);
      });

      socket.on("update-points", (updatedPoints) => {
        setPoints(updatedPoints);
      });

      // Return cleanup function
      return () => {
        socket.disconnect();
      };
    };

    // Call the function to initialize socket and join room
    initializeSocketAndJoinRoom();

    // Call the function again when roomId or currentPlayerName changes
  }, [roomId, currentPlayerName]);


  useEffect(() => {
    checkForMatch();
    // eslint-disable-next-line
  }, [selectedCards]);


  useEffect(() => {
    if (gameStartTime) {
      const timerInterval = setInterval(() => {
        setRemainingTime((prevRemainingTime) => {
          const currentTime = Date.now();
          const elapsedTime = currentTime - gameStartTime;
          let newRemainingTime = Math.max(0, 30 * 60 * 1000 - elapsedTime);

          // testing miliseconds 1790000
          if (newRemainingTime === 0) {
            setShowContainer(false)
            setShowResultpage(true)
          }
          // If the new remaining time is the same, clear the interval
          if (newRemainingTime === prevRemainingTime) {
            clearInterval(timerInterval);
          }

          return newRemainingTime;
        });
      }, 1000);

      // Cleanup interval on component unmount or when game ends//
      return () => clearInterval(timerInterval);
    }
  }, [gameStartTime, remainingTime]);

  useEffect(() => {
    if (allCardsFlipped()) {
      setShowContainer(false);
      setShowResultpage(true);
    }
    // eslint-disable-next-line
  }, [gameState.matchedPairs]);


  useEffect(() => {
    setlastMatchedPairs(matchedPairs[matchedPairs.length - 1]);
    if (matchedPairs.length > 0) {
      setModalOpen(true);
    }
  }, [matchedPairs]);

  useEffect(() => {
    // Check if socket is available before setting up the event listener
    if (socket) {
      // Listen for the "matched-pairs" event and update the state
      socket.on("matched-pairs", (matchedPairsFromServer) => {
        // Update the matchedPairs state with the data from the server
        setMatchedPairs(matchedPairsFromServer);
        // Open the modal when there are matched pairs
        setModalOpen(true);
      });

      // Clean up the event listener when the component unmounts
      return () => {
        socket.off("matched-pairs");
      };
    }
  }, [socket]);

  const allCardsFlipped = () => {
    return cardsState.every((card) => card.isFlipped);
  };

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
        // Cards match logic
        const newMatchedPair = firstCard.key;

        if (!matchedPairs.includes(newMatchedPair)) {
          // Update the matchedPairs array with the new matched pair
          setMatchedPairs([...matchedPairs, newMatchedPair]);

          // Update points for the current player and emit to the server
          const currentPlayerId = currentTurn;
          const updatedPoints = {
            ...points,
            [currentPlayerId]: (points[currentPlayerId] || 0) + 1,
          };
          setPoints(updatedPoints);
          socket.emit("update-points", roomId, updatedPoints);
          socket.emit("update-game-state", roomId, currentPlayerName, firstCard.id);
        }

        // Keep the matched pairs open
        updateCardState(firstCard.id, true);
        updateCardState(secondCard.id, true);

        // Rotate turn after a delay
        setTimeout(() => {
          rotateTurn(selectedCards);
        }, 1000);
      } else {
        // Cards do not match logic
        setDisableClick(true);

        // Close the unmatched cards after a delay
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
    socket.emit("end-turn", roomId, selectedCards);
  };

  const isCardMatched = (card) => {
    return matchedPairs.includes(card.key);
  };

  const handleStartGame = async (enteredRoomId, playerName) => {
    setShowEntryPage(false);
    setShowContainer(true);
    setCurrentPlayerName(playerName);
    setRoomId(enteredRoomId);
    console.log(socket.id);
  
    try {
      const response = await fetch(`${url}/player/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: playerName,
          roomId: roomId,
          startTime: Date.now(),
        }),
      });
  
      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }
  
      const data = await response.json();
      console.log('Başlangıç zamanı ve socket ID kaydedildi:', data);
    } catch (error) {
      console.error('Hata:', error);
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
          <div className="container" data-testid="game-container">
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
                  disableClick={disableClick}
                />
              ))}
            </div>
          </div>
        )}


        {showResultPage && (
          <div style={{ "color": "white" }}>
            <Result players={players} points={points} />
          </div>
        )}

        <Modal modalOpen={ModalOpen} closeModal={() => setModalOpen(false)} lastMatchedPairs={lastMatchedPairs} cardsState={cardsState} />

      </div>
    </>
  );
}

export default Game;