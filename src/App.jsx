import { useState } from 'react';

// Componente Square: representa un cuadrado en el tablero
function Square({ value, onSquareClick, isWinnerSquare }) {
  // Clases y estilos dinámicos basados en el valor del cuadrado (X, O)
  let squareClass = "square";
  let squareStyle = {};

  if (isWinnerSquare) {
    squareClass += " winner";
  }

  // Si el valor es "X", agrega la clase y establece el color a rojo
  if (value === "X") {
    squareClass += " X";
    squareStyle.color = "red";
  } else if (value === "O") {
    // Si el valor es "O", agrega la clase y establece el color a verde
    squareClass += " O";
    squareStyle.color = "green";
  }
  // Renderiza un botón con el valor del cuadrado y estilos dinámicos
  return (
    <button className={squareClass} style={squareStyle} onClick={() => {onSquareClick(); onHighlightSquare(position);}}>
      {value}
    </button>
  );
}

// Componente Board: representa el tablero del juego
function Board({ xIsNext, squares, onPlay }) {
  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const winningLine = winnerInfo ? winnerInfo.line : null;

  // Maneja el clic en un cuadrado y actualiza el estado del juego
  function handleClick(i) {
    // Verifica si hay un ganador o si el cuadrado ya está ocupado
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // Crea una copia del arreglo de cuadrados
    const nextSquares = squares.slice();
    // Establece el valor del cuadrado en función de quién juega
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    // Llama a la función proporcionada para manejar el estado del juego
    onPlay(nextSquares);
  }

  // Calcula al ganador y muestra el estado actual del juego
  let status;
  // Si hay un ganador, muestra el mensaje de ganador
  if (winner) {
    status = 'Ganador: ' + winner;
  } else {
    // Si no hay ganador, muestra el siguiente jugador
    status = 'Siguiente jugador: ' + (xIsNext ? 'X' : 'O');
  }

  // Función para renderizar cada cuadrado con la información de la línea ganadora
  function renderSquare(i) {
    const isWinnerSquare = winningLine && winningLine.includes(i);
    return (
      <Square
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        isWinnerSquare={isWinnerSquare}
        //position={i} // Pasa la posición del cuadrado
        //onHighlightSquare={(position) => highlightSquare(position)}
        key={i}
      />
    );
  }

  // Renderiza el tablero con sus cuadrados
  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </>
  );
}

// Componente Game: representa el juego completo con historial de movimientos
export default function Game() {
  // Estado para el historial de movimientos y el movimiento actual
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [resetCounter, setResetCounter] = useState(0); // Contador de restablecimientos
  //const [highlightedSquare, setHighlightedSquare] = useState(null); // Cuadrado resaltado
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  // Maneja el clic en un cuadrado y actualiza el historial de movimientos
  function handlePlay(nextSquares) {
    // Crea una copia del historial hasta el movimiento actual
    const nextHistory = history.slice(0, currentMove + 1);
    // Agrega el nuevo estado al historial y actualiza el movimiento actual
    setHistory([...nextHistory, nextSquares]);
    setCurrentMove(nextHistory.length);
    // Resetea el cuadrado resaltado al realizar un nuevo movimiento
    //setHighlightedSquare(null);
  }

  // Cambia al estado de juego de un movimiento específico
  function jumpTo(nextMove) {
    // Establece el movimiento actual y corta el historial hasta ese punto
    setCurrentMove(nextMove);
    setHistory(history.slice(0, nextMove + 1));
    // Resetea el cuadrado resaltado al retroceder a un movimiento anterior
    //setHighlightedSquare(null);
  }

  // Función para restablecer el juego
  function handleReset() {
    // Incrementa el contador de restablecimiento
    setResetCounter(resetCounter + 1);
    // Restablece el historial y el movimiento actual al estado inicial
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    // Resetea el cuadrado resaltado al reiniciar el juego
    //setHighlightedSquare(null);
  }

  // Función para resaltar el cuadrado correspondiente a la jugada
  // function highlightSquare(index) {
  //   setHighlightedSquare(index);
  // }

  // Genera la lista de movimientos anteriores y botones para resaltar cuadrados
  const moves = history.map((squares, move) => {
    let description;
    // Define la descripción del movimiento actual
    if (move > 0) {
      description = 'Ir hacia la jugada #' + move;
      return (
        <li key={move}>
          {move === currentMove ? (
            <span>Movimiento actual # {move}</span>
          ) : (
            <>
              <button onClick={() => jumpTo(move)}>{description}</button>
              {/* <button onClick={() => highlightSquare(move)}>Mostrar ubicación</button> */}
            </>
          )}
        </li>
      );
    } else {
      return null;
    }
  });

  // Mostrar mensaje solo para el movimiento actual
  let statusMessage = '';
  if (currentMove > 0) {
    statusMessage = `Estás en el movimiento #${currentMove}`;
  } else {
    statusMessage = 'Siguiente jugador: ' + (xIsNext ? 'X' : 'O');
  }

  // Renderiza el juego con el tablero y el historial de movimientos
  return (
    <div className="game">
      <div className="game-board">
        <h1>TA-TE-TI</h1>
        <button className='reset' onClick={handleReset}>Restablecer</button>
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          // onHighlightSquare={highlightedSquare}
        />
      </div>
      <div className="game-info">
        <div>{statusMessage}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// ---------------- FUNCTIONS -----------------------
// Función calculateWinner: determina al ganador del juego
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  // Comprueba las líneas posibles para determinar al ganador
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  // Si no hay ganador, devuelve null
  return null;
}