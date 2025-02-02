import { useState, useEffect } from "react";
import Wordle from "./Wordle";
import KeyboardTop from "./KeyboardTop";
import KeyboardMiddle from './KeyboardMiddle';
import KeyboardBottom from "./KeyboardBottom";
import { Flip, ToastContainer, toast } from "react-toastify";
import words from "../data/clues_five.json"

function App() {
    const [wordList, setWordList] = useState();
    const [todaysWord, setTodaysWord] = useState('');
    const [hints, setHints] = useState([]);
    let randomNumber;

    useEffect(() => {
        fetch('./data/clues_five.json')
            .then((response) => response.json())
            .then((data) => {
                randomNumber = Math.floor(Math.random() * Object.keys(words["data"]).length);
                console.log("randomNumber is", randomNumber);
                setWordList(Object.keys(words["data"]));
                setTodaysWord(Object.keys(words["data"])[randomNumber]);
                setHints(Object.values(words["data"])[randomNumber]);
            });
    }, [])

    function showWordOfTheDay() {
        console.log(todaysWord);
    }
    function showHints() {
        //toast.info(todaysWord, {autoClose: 500});
        let numberOfHints = hints.length;
        randomNumber = Math.floor(Math.random() * numberOfHints);
        toast.info(hints[randomNumber], {autoClose: 5000});
    }

    return (
        <div className="container">
            <div>
                Click <span className="wotd" onClick={showHints}> here</span> for hints.
                <Wordle todaysWord={todaysWord} wordList={wordList} hints={hints} />
            </div>
            <ToastContainer position="top-left" hideProgressBar transition={Flip} icon={false} theme="colored" />
        </div>
    );
}

export default App;