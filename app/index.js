'use strict';
import './style.scss';
import {
  PLAYERS,
  CELL_STATES,
  CELL_STATES_TO_NUMBERS,
  MESSAGES,
  GAME_STATES
} from './constants.js';

window.addEventListener('load', (e) => {
  // Bootstrap the app after the html is loaded Create a new Game Instance
  let game = new TicTacToe();

  // Adding event listeners to the Reset, New Game buttons
  document
    .getElementById('action-button')
    .addEventListener('click', () => {
      game.reset();
    });

});

/**
 * Cell in the TicTacToe Grid
 *
 */
class Cell {

  get currentPlayer() {
    return this._currentPlayer || null;
  }
  set currentPlayer(player) {
    this._currentPlayer = player;
  }

  get status() {
    return this._status || null;
  }
  set status(status) {
    this._status = status;
    this.elementRef.innerHTML = `<span class="cell-text">${status}</span>`;
    if (status !== CELL_STATES.BLANK) {
      this.statusChangedEvent = new Event('cellStatusChanged');
      this
        .elementRef
        .dispatchEvent(this.statusChangedEvent);
    }
  }

  constructor(elementRef) {
    // this.element = document.createElement('div');
    // this.element.className = "cell";
    this.elementRef = elementRef;
    this.status = CELL_STATES.BLANK;
    this
      .elementRef
      .addEventListener('click', (event) => {
        this.onClick(event);
      })
  }

  reset() {
    this.status = CELL_STATES.BLANK;
  }

  onClick = (event) => {
    if (this.status === CELL_STATES.BLANK) { // blanck, set the status
      this.status = this.currentPlayer;
    }
    // do nothing otherwise
  }

}

class TicTacToe {

  constructor(gridSize = 3) {
    this.gridSize = gridSize;
    // this.currentPlayer = PLAYERS.X;
    this.cells = [];
    // this.totalMovesLeft = gridSize * gridSize;
    this.setup();
    this.reset();
  }

  setup = () => {
    // Get references to all cells in grid
    // Use spread operator to convert them into iterable array
    let [...cellRefs] = document.getElementsByClassName('cell');

    cellRefs.forEach(cellRef => {

      // create a new Cell with each ref
      let cell = new Cell(cellRef);

      // attach status change event listener
      cell
        .elementRef
        .addEventListener('cellStatusChanged', (event) => {
          this.onCellStatusChanged(event)
        });
      // keep all created cell objects for reference during game
      this.cells.push(cell);
    });
  }

  onCellStatusChanged = () => {
    console.log('Cell Status Changed');
    this.totalMovesLeft--;
    if (this.totalMovesLeft > 0) {
      this.togglePlayer();
      this.setGameState(GAME_STATES.IN_PROGRESS);
    } else {
      this.setGameState(GAME_STATES.FINISHED);
    }

  }

  togglePlayer() {
    if (this.currentPlayer === PLAYERS.X) {
      this.currentPlayer = PLAYERS.O;
    } else {
      this.currentPlayer = PLAYERS.X;
    }
    this.setCurrentPlayer(this.currentPlayer);
  }

  setCurrentPlayer(player) {
    this.playerChangedEvent = new Event('playerChanged');
    document.dispatchEvent(this.playerChangedEvent);
    this
      .cells
      .filter(cell => cell.status === CELL_STATES.BLANK)
      .forEach(cell => {
        cell.currentPlayer = player;
      });
  }

  /**
   * Resets the state of the game
   */
  reset() {
    this.currentPlayer = PLAYERS.X;
    this
      .cells
      .forEach(cell => {
        cell.currentPlayer = this.currentPlayer;
        cell.reset();
      });
    this.totalMovesLeft = this.gridSize * this.gridSize;
    this.setGameState(GAME_STATES.NEW);
  }

  setGameState(gameState) {
    let ab = document.getElementById('action-button');
    let message = document.getElementById('message');

    switch (gameState) {
      case GAME_STATES.NEW:
        if (ab.classList.contains('button-warn')) {
          ab
            .classList
            .remove('button-warn');
        }
        ab
          .classList
          .add('button-primary');
        ab.innerHTML = 'NEW GAME';
        message.innerHTML = this.currentPlayer + MESSAGES.NEXT_TURN;
        break;
      case GAME_STATES.IN_PROGRESS:
        if (ab.classList.contains('button-primary')) {
          ab
            .classList
            .remove('button-primary');
        }
        ab
          .classList
          .add('button-warn');
        ab.innerHTML = 'RESET';
        message.innerHTML = this.currentPlayer + MESSAGES.NEXT_TURN;
        break;
      case GAME_STATES.FINISHED:
        ab.innerHTML = 'PLAY AGAIN';
        ab
          .classList
          .add('button-primary');
        message.innerHTML = MESSAGES.GAME_OVER;
        break;
    }
  }

  // get status() {   return this     .cells     .map(cell => cell.status)
  // .map(status => CELL_STATES_TO_NUMBERS[status]); } getWinner(cellStatuses) {
  // let winnerSums = {     X: CELL_STATES_TO_NUMBERS[CELL_STATES.X] *
  // this.gridSize,     O: CELL_STATES_TO_NUMBERS[CELL_STATES.O] * this.gridSize }
  //   console.log('Max Scores', winnerSums);   // check rows   let rowMaxSum =
  // 0;   for (let row = 0; row < this.gridSize; row++) {     let sum = 0;     for
  // (let col = 0; col < this.gridSize; col++) {       sum += cellStatuses[(row *
  // this.gridSize) + col];       // console.log('row',cellStatuses.filter((s, i)
  // => i % row === 0));     }     console.log('Row Sum', sum);     if (sum ===
  // winnerSums.X) {       return PLAYERS.X;     }     if (sum === winnerSums.O) {
  //       return PLAYERS.O;     }   }   for (let col = 0; col < 3; col++) { //
  // console.log('col',cellStatuses.filter((s, i) => i / col === 0));   }   //
  // check columns check diagonals   return null; } getCurrentPlayer();
}