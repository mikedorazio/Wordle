import React, { useState, useRef, isValidElement } from "react";
import Word from "./Word";

export default function WordGrid({ guessedWords, currentGuess, turn }) {
    return (
        <div>
            {/* guessedWords will always be of length 6 even if there have been no gueses */}
            {guessedWords.map((g, i) => {
                if (turn === i) {
                    return <Word key={i} currentGuess={currentGuess} />;
                }
                return <Word key={i} guess={g} />;
            })}
        </div>
    );
}