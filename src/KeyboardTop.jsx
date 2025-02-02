export default function KeyboardTop( { usedKeys }) {
    const letters = [
        {"key": "q"},
        {"key": "w"},
        {"key": "e"},
        {"key": "r"},
        {"key": "t"},
        {"key": "y"},
        {"key": "u"},
        {"key": "i"},
        {"key": "o"},
        {"key": "p"},
    ];
    
    return (
        <div>
          {letters && letters.map(l => {
            const color = usedKeys[l.key]
            //console.log(color);
            return (
              <button key={l.key} id={l.key} className={color}>{l.key.toUpperCase()}</button>
            )
          })}
        </div>
      )
}
