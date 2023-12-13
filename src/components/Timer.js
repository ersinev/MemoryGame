// Timer.js

import React, { useState, useEffect } from "react";

function Timer({ remainingTime }) {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateRemainingTime = () => {
      const calculatedRemainingTime = calculateRemainingTime();
      setTimeRemaining(calculatedRemainingTime);
    };

    const intervalId = setInterval(updateRemainingTime, 1000);

    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line
  }, [remainingTime]);

  const calculateRemainingTime = () => {
    if (remainingTime <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    return {
      days,
      hours,
      minutes,
      seconds,
    };
  };

  return (
    <div style={{ backgroundColor: "white" }}>
       {timeRemaining.minutes}m {timeRemaining.seconds}s
    </div>
  );
}

export default Timer;
