import { TURN,CELL_VALUE,GAME_STATUS } from './constants.js';
import { getCellElementAtIdx,
    getCellElementList,
    getCurrentTurnElement,
    getGameStatusElement,
    getRelayButtonElement }
        from "./selectors.js";

import {checkGameStatus} from './utils.js';

/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let gameStatus = GAME_STATUS.PLAYING;
let cellValues = new Array(9).fill("");

function toggleTurn() {
    // toggle turn
    currentTurn = currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;

    // update turn on DOM element

    const currentTurnElement = getCurrentTurnElement();
    if(currentTurnElement) {
        currentTurnElement.classList.remove(TURN.CROSS,TURN.CIRCLE);
        currentTurnElement.classList.add(currentTurn)
    }
}

function updateGameStatus(newGameStatus) {
    gameStatus = newGameStatus;

    const gameStatusElement = getGameStatusElement();
    if(gameStatusElement) gameStatusElement.textContent = newGameStatus;
}
function showRelayButton() {
    const replayButton = getRelayButtonElement();
    if(replayButton) replayButton.classList.add('show')
}
function highlightWinCells(winPosition) {
    if(!Array.isArray(winPosition) || winPosition.length !== 0) return;

    winPosition.forEach(winIndex => {
        getCellElementAtIdx(winIndex).classList.add('win')
    })
}

function handleCellClick (cell,index) {
    const isClicked = cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);
    const isEndGame = gameStatus !== GAME_STATUS.PLAYING
    if(isClicked || isEndGame) return;
    //set selected cell
    cell.classList.add(currentTurn)
    // update cellValues

    cellValues[index] = currentTurn === TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;

    // check game status

    const game = checkGameStatus(cellValues)
    switch(game.status) {
        case GAME_STATUS.ENDED: {
            //update game status
            //show replay button
            updateGameStatus(game.status)
            showRelayButton()
            break;
        }
        case GAME_STATUS.O_WIN:
        case GAME_STATUS.X_WIN: {
            //update game status
            //show replay button
            //highlight win cells
            updateGameStatus(game.status)
            showRelayButton()
            highlightWinCells(game.winPositions)
            break;
        }
        
        default:
        //playing
    }
    // toggle turn
    toggleTurn() 

}

function initCellElementList() {
    const cellElementList = getCellElementList();
    cellElementList.forEach((cell,index) => {
        cell.addEventListener("click", () => handleCellClick(cell,index));
    })

}

/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */

(() =>{
    // bind click event for all li elements
    initCellElementList();
    // bind click event for replay button
})()