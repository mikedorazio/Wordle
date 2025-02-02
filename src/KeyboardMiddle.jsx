export default function KeyboardTop( {usedKeys} ) {
    const letters = [
        { key: "a" },
        { key: "s" },
        { key: "d" },
        { key: "f" },
        { key: "g" },
        { key: "h" },
        { key: "j" },
        { key: "k" },
        { key: "l" },
    ];

    return (
        <div>
            {letters &&
                letters.map((l) => {
                    const color = usedKeys[l.key];
                    //console.log(color);
                    return (
                        <button key={l.key} id={l.key} className={color}> {l.key} </button>
                    );
                })}
        </div>
    );
}
