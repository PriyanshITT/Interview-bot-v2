import React, { useState, useEffect } from "react";

const BotMessage = ({ text, delay = 300 }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    // Reset the displayed text each time text changes.
    setDisplayedText("");
    const words = text.split(" ");
    let index = 0;
    const interval = setInterval(() => {
      // Check to ensure we're not accessing an undefined word.
      if (index < words.length-1) {
        setDisplayedText((prev) => (prev ? prev + " " : "") + words[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, delay);

    return () => clearInterval(interval);
  }, [text, delay]);

  return <span>{displayedText}</span>;
};

export default BotMessage;
