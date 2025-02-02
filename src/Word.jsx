import React, { useState, useRef } from "react";

/*
 * This Component will get called 5 times. Once with currentGuess. It will also get called with all 
 * previous guessses. The other calls will just return 5 emtpy div tags for a blank word.
 */
export default function Word({ guess, currentGuess }) {
    if (guess) {
        return (
            <div className="word past">
                {guess.map((entry, index) => (
                    <div key={index} className={entry.color}>
                        {entry.key}
                    </div>
                ))}
            </div>
        );
    }

    if (currentGuess) {
        let letters = currentGuess.split("");
        return (
            <div className="word current">
                {letters.map((letter, index) => (
                    <div key={index} className='filled'>
                        {letter}
                    </div>
                ))}
                {/* current guess has less than 5 characters so fill in with blans */}
                {[...Array(5 - letters.length)].map((_, i) => (
                    <div key={i}></div>
                ))}
            </div>
        );
    }

    // we have already handled the current guess and all previous guesses so now we need
    // to return a blank word of 5 empty div tag spaces for future word guesses
    return (
        <div className="word">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
}
