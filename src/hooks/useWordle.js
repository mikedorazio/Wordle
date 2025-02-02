import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

/* the idea to use a div tag instead of an input tag for each character was "borrowed" from net ninja. After coding half the
 * application, I ran into a problem changing focus from one row to the next which could have been solved, but his approach
 * is much cleaner and I use that here.  
 */
const useWordle = (todaysWord, wordList) => {
    const [currentGuess, setCurrentGuess] = useState("");
    const [guessedWords, setGuessedWords] = useState([...Array(6)]); // [{letter: 'a', color: 'green'}, {letter: 'b', color: 'yellow'}]
    const [turn, setTurn] = useState(0); // what turn is the user on
    const [isCorrect, setIsCorrect] = useState(false); // have they solved the puzzle correctly
    const [preCorrect, setPreCorrect] = useState(false);
    const [history, setHistory] = useState([]); // strings of old guesses ['smile', 'charm', 'civil']
    const [usedKeys, setUsedKeys] = useState({}); // {a: 'green', b: 'yellow', c: 'green'}
    //const [shouldUpdate, setShouldUpdate] = useState(false);

    /* After the puzzle has been correctly guessed, we need to show the flip animation and then the
     * jump animation.  Since they both rely on delays we need to run flip first, then update the
     * CSS class for the DIVs from green to winner.  The winner class will trigger the jump animation.
     */
    function updateGreenClass() {
        const elements = document.getElementsByClassName("word past");
        const wordElement = elements[elements.length - 1];
        console.log(wordElement);
        for (const child of wordElement.children) {
            console.log(child.tagName);
            child.classList.remove("green");
            child.classList.add("winner");
        }
        //setShouldUpdate(true);
    }

    /* Format the new guess and put it into the guessedWords array. Create a letter/color object for each 
     * guessed letter. Start with all grey and then change to green and yellow for hits 
     */
    function formatGuess() {
        console.log("formatGuess() called");
        if (preCorrect) console.log(true);
        // create letter array for the answer
        let solutionArray = [...todaysWord];
        // for each letter in current guess, create a grey letter color object
        let formattedGuess = [...currentGuess].map((letter) => {
            return { key: letter, color: "grey" };
        });

        // find any green letters and update
        formattedGuess.forEach((letter, i) => {
            if (todaysWord[i] === letter.key) {
                formattedGuess[i].color = "green";
                solutionArray[i] = null;
            }
        });

        // find any yellow letters and update
        formattedGuess.forEach((letter, i) => {
            if (solutionArray.includes(letter.key) && letter.color !== "green") {
                formattedGuess[i].color = "yellow";
                solutionArray[solutionArray.indexOf(letter.key)] = null;
            }
        });
        if (preCorrect) {
            // Use setTimeout to simulate a delayed action before we update the green className
            setTimeout(() => {
                updateGreenClass();
           }, 2000);
        }
        return formattedGuess;
    }

    // is the guessed word a real word?? If not, return false, otherwise true
    function guessedWordInDictionary() {
        return wordList.includes(currentGuess);
    }

    // add the new guess to the guessedWord state, update the isCorrect state if the guess is correct, add the currentGuess
    // to the history of guesses, add one to turn and update used keys for keyboard
    const addNewGuess = (formattedGuess) => {
        if (currentGuess === todaysWord) {
            setIsCorrect(true);
        }
        setGuessedWords((prevGuesses) => {
            let newGuesses = [...prevGuesses];
            newGuesses[turn] = formattedGuess;
            return newGuesses;
        });
        setHistory((prevHistory) => {
            return [...prevHistory, currentGuess];
        });
        setTurn((prevTurn) => {
            return prevTurn + 1;
        });
        // update the keyboard based on the currentGuess and don't up the color hierarchy (yellow to green)
        setUsedKeys((prevUsedKeys) => {
            formattedGuess.forEach((l) => {
                const currentColor = prevUsedKeys[l.key];
                if (l.color === "green") {
                    prevUsedKeys[l.key] = "green";
                    return;
                }
                if (l.color === "yellow" && currentColor !== "green") {
                    prevUsedKeys[l.key] = "yellow";
                    return;
                }
                if (l.color === "grey" && currentColor !== ("green" || "yellow")) {
                    prevUsedKeys[l.key] = "grey";
                    return;
                }
            });
            return prevUsedKeys;
        });
        setCurrentGuess("");
    };

    /* shake the outer div of the current row */
    function shakeRow() {
        const currentRow = document.getElementsByClassName("word current")[0];
        console.log(currentRow);
        currentRow.classList.add("shaken");
        setTimeout(() => {
            currentRow.classList.remove("shaken");
        }, 1000);
    }

    /* has the current guess already been used?? */
    function repeatedGuess() {
        if (history.includes(currentGuess)) {
            console.log("guessed already");
            return true;
        }
        return false;
    }

    function handleKeyup({ key }) {
        console.log(key);
        if (key === "Backspace") {
            console.log("Backspace hit");
            setPreCorrect(false);
            setCurrentGuess(currentGuess.slice(0, -1));
        }
        if (key === "Enter") {
            console.log("Enter hit");
            if (currentGuess.length < 5) {
                shakeRow();
                toast.warning("Not Enough Letters 😆", { autoClose: 750 });
                return;
            }
            if (!guessedWordInDictionary()) {
                shakeRow();
                toast.warning(`Not In Dictionary 😢`, { autoClose: 1000 });
                return;
            }
            if (repeatedGuess()) {
                shakeRow();
                toast.warning("Guessed Already 🙄", { autoClose: 1000 });
                return;
            }
            const formatted = formatGuess();
            addNewGuess(formatted);
        }
        if (/^[a-zA-Z]$/.test(key)) {
            if (currentGuess.length == 5) {
                return;
            }
            // add letter to current guess
            setCurrentGuess((prevGuess) => prevGuess + key);
            console.log("currentGuess is " + currentGuess);
            if (currentGuess + key === todaysWord) setPreCorrect(true);
        }
    }

    /* Only process the event if one of the Keyboard keys was hit or
     * the svg part of the backspace was hit.
     */
    function handleMouseUp(e) {
        let buttonId = e.target.getAttribute("id");
        console.log(e.target.textContent);
        if (buttonId) {
            console.log("Button with and id was hit");
            let event = new KeyboardEvent("type", {
                key: buttonId,
            });
            handleKeyup(event);
        }
        if (e.target.tagName === "svg" || e.target.tagName === "path") {
            let event = new KeyboardEvent("type", {
                key: "Backspace",
            });
            handleKeyup(event);
        }
    }

    return {
        currentGuess,
        guessedWords,
        handleKeyup,
        turn,
        isCorrect,
        preCorrect,
        usedKeys,
        handleMouseUp,
    };
};

export default useWordle;
