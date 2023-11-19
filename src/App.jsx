import { useState } from 'react';

// Componente Square: representa un cuadrado en el tablero
function Square({ value, onSquareClick, isWinnerSquare  }) {
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
    <button className={squareClass} style={squareStyle} onClick={onSquareClick}>
      {value}
    </button>
  );
}

// Componente Board: representa el tablero del juego
function Board({ xIsNext, squares, onPlay }) {
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
  const winner = calculateWinner(squares);
  let status;
  // Si hay un ganador, muestra el mensaje de ganador
  if (winner) {
    status = 'Ganador: ' + winner;
  } else {
    // Si no hay ganador, muestra el siguiente jugador
    status = 'Siguiente jugador: ' + (xIsNext ? 'X' : 'O');
  }

  // Renderiza el tablero con sus cuadrados
  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

// Componente Game: representa el juego completo con historial de movimientos
export default function Game() {
  // Estado para el historial de movimientos y el movimiento actual
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  // Maneja el clic en un cuadrado y actualiza el historial de movimientos
  function handlePlay(nextSquares) {
    // Crea una copia del historial hasta el movimiento actual
    const nextHistory = history.slice(0, currentMove + 1);
    // Agrega el nuevo estado al historial y actualiza el movimiento actual
    setHistory([...nextHistory, nextSquares]);
    setCurrentMove(nextHistory.length);
  }

  // Cambia al estado de juego de un movimiento específico
  function jumpTo(nextMove) {
    // Establece el movimiento actual y corta el historial hasta ese punto
    setCurrentMove(nextMove);
    setHistory(history.slice(0, nextMove + 1));
  }

  // Genera la lista de movimientos anteriores
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
            <button onClick={() => jumpTo(move)}>{description}</button>
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
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

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
      return squares[a];
    }
  }
  // Si no hay ganador, devuelve null
  return null;
}