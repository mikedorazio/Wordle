import { useState, useEffect } from "react";
import useWordle from "./hooks/useWordle";
import WordGrid from "./WordGrid";
import KeyboardTop from "./KeyboardTop";
import KeyboardMiddle from "./KeyboardMiddle";
import KeyboardBottom from "./KeyboardBottom";
import { toast } from "react-toastify";
import ReactConfetti from "react-confetti";

export default function Wordle({ todaysWord, wordList, hints }) {
    const { currentGuess, guessedWords, handleKeyup, turn, isCorrect, preCorrect, usedKeys, handleMouseUp } = useWordle( todaysWord, wordList );
    // ID used to prevent multiple success toast messages
    const toastId = "success";

    useEffect(() => {
        window.addEventListener("keyup", handleKeyup);
        window.addEventListener("mouseup", handleMouseUp);

        if (isCorrect) {
            toast.success(`Congrats!!!! (${turn}) ✨🎉❤`, {autoClose: 2000, delay: 1000, toastId: toastId});
            window.removeEventListener("keyup", handleKeyup);
            window.removeEventListener("mouseup", handleMouseUp);
        }

        if (turn > 5 && !isCorrect) {
            toast.error(`LOSER!!! 😔 : The word was ${todaysWord}`, {autoClose: 6000, delay: 1000});
            window.removeEventListener("keyup", handleKeyup);
            window.removeEventListener("mouseup", handleMouseUp);  
        }

        return () => {
            window.removeEventListener("keyup", handleKeyup);
            window.removeEventListener("mouseup", handleMouseUp);
        }
    }, [handleKeyup, isCorrect, turn]);

    return (
        <>
        {isCorrect && <ReactConfetti  />}
        <div className="grid-container">
            <div className="wordGrid">
                <WordGrid guessedWords={guessedWords} currentGuess={currentGuess} turn={turn} />
            </div>

            <div className="keyboard-top">
                <KeyboardTop usedKeys={usedKeys} />
            </div>
            <div className="keyboard-middle">
                <KeyboardMiddle usedKeys={usedKeys} />
            </div>
            <div className="keyboard-bottom">
                <KeyboardBottom usedKeys={usedKeys} />
            </div>
        </div>
        </>
    );
}
