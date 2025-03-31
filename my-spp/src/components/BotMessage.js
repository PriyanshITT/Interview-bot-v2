import React, { useState, useEffect } from "react";

const BotMessage = ({ text, delay = 0.01 }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText(""); // Reset when text changes
    let currentIndex = 0;
    let animationFrameId;

    const typeCharacter = () => {
      if (currentIndex < text.length) {
        setDisplayedText(text.substring(0, currentIndex + 1));
        currentIndex++;
        animationFrameId = requestAnimationFrame(() => setTimeout(typeCharacter, delay));
      }
    };

    animationFrameId = requestAnimationFrame(() => setTimeout(typeCharacter, delay));

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [text, delay]);

  return <span>{displayedText}</span>;
};

export default BotMessage;
