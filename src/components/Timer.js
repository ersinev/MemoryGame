import React, { useState, useEffect } from "react";

function Timer() {
  const countDownDate = new Date("Oct 4, 2024 15:37:25").getTime();
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const x = setInterval(() => {
      const now = new Date().getTime();
      const distance = countDownDate - now;

      if (distance < 0) {
        clearInterval(x);
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeRemaining({
          days,
          hours,
          minutes,
          seconds,
        });
      }
    }, 1000);

    return () => {
      clearInterval(x);
    };
  }, [countDownDate]);

  return (
    <div style={{ backgroundColor: "white" }}>
      {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m{" "}
      {timeRemaining.seconds}s
    </div>
  );
}

export default Timer;
