import React, { useState } from 'react';
import Box from './Box';

import { FaTimes, FaCircleNotch } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';

export default function GameBoard() {
  const [currentUser, setCurrentUser] = useState("User");
  const [gameWinner, setGameWinner] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [gameTied, setGameTied] = useState(false);
  const [gameBoardBoxes, setGameBoardBoxes] = useState([
                                                        {hasValue: false, isFinal: false, icon: null, user: null}, 
                                                        {hasValue: false, isFinal: false, icon: null, user: null}, 
                                                        {hasValue: false, isFinal: false, icon: null, user: null}, 
                                                        {hasValue: false, isFinal: false, icon: null, user: null}, 
                                                        {hasValue: false, isFinal: false, icon: null, user: null}, 
                                                        {hasValue: false, isFinal: false, icon: null, user: null}, 
                                                        {hasValue: false, isFinal: false, icon: null, user: null}, 
                                                        {hasValue: false, isFinal: false, icon: null, user: null}, 
                                                        {hasValue: false, isFinal: false, icon: null, user: null}
                                                      ]);
                                                      

  function handleUserSelect(index) {
    if (gameWinner == null) {
      let temp = gameBoardBoxes.slice();
      for (let i = 0; i < gameBoardBoxes.length; i++) {
        if (i !== index && !temp[i].isFinal) {
          temp.splice(i, 1, {hasValue: false, isFinal: false, icon: null})
        }
        else if (!temp[i].isFinal) {
          temp.splice(index, 1, {hasValue: true, isFinal: false, icon: <FaTimes id="timesIcon"/>, user: "User"})
          setSelectedIndex(index);
        }
      }
      setGameBoardBoxes(temp);
    }
  }

  function handleUserUnselect(index) {
    let temp = gameBoardBoxes.slice();
    if (!temp[index].isFinal) {
      temp.splice(index, 1, {hasValue: false, icon: null})
      setGameBoardBoxes(temp);
      setSelectedIndex(null);
    }
  }

  function handleSubmitClicked() {
    if (selectedIndex != null) {
      let temp = gameBoardBoxes.slice();
      temp.splice(selectedIndex, 1, {hasValue: true, isFinal: true, icon: <FaTimes id="timesIcon"/>, user: "User"});
      setGameBoardBoxes(temp);
      setCurrentUser("Computer");
      computerMakesPick(temp);
      gameFinishedCheck(temp);
    }
  }

  function computerMakesPick(temp) {
    if (gameWinner == null) {
      let pick = null;
      let counter = 0;
      while (pick == null && counter < 10) {
        let index = Math.floor(Math.random() * 9);
        if (!temp[index].isFinal && index !== 9) {
          temp.splice(index, 1, {hasValue: true, isFinal: true, icon: <FaCircleNotch id="timesIcon"/>, user: "Computer"});
          pick = index;
          setGameBoardBoxes(temp);
          setCurrentUser("User");
        }
        counter++;
      }

      if (pick == null && counter > 8) {
        setGameTied(true);
      }
      gameFinishedCheck(temp);
    }
  }

  async function gameFinishedCheck(temp) {
    let user = "";
    let winner = null;
    for (let i = 0; i < temp.length; i++) {
        if (i === 0 && temp[i].isFinal) {
            user = temp[i].user;
            if (temp[1].isFinal && temp[1].user === user) {
              if (temp[2].isFinal && temp[2].user === user) {
                winner = user;
              }
              else {
                user = "";
              }
            }
            else if (temp[4].isFinal && temp[4].user === user) {
              if (temp[8].isFinal && temp[8].user === user) {
                winner = user;
              }
              else {
                user = "";
              }
            }
            else if (temp[3].isFinal && temp[3].user === user) {
              if (temp[6].isFinal && temp[6].user === user) {
                winner = user;
              }
              else {
                user = "";
              }
            }
            else {
              user = "";
            }
        }

        if (winner == null) {
          winner = checkOneRow(temp, i, 1, 4, 7);
        }

        if (winner == null) {
          if (i === 2 && temp[i].isFinal) {
            user = temp[i].user;
            if (temp[4].isFinal && temp[4].user === user) {
              if (temp[6].isFinal && temp[6].user === user) {
                winner = user;
              }
              else {
                user = "";
              }
            }
            else if (temp[5].isFinal && temp[5].user === user) {
              if (temp[8].isFinal && temp[8].user === user) {
                winner = user;
              }
              else {
                user = "";
              }
            }
            else {
              user = "";
            }
          }
        }

        if (winner == null) {
          winner = checkOneRow(temp, i, 3, 4, 5);
        }
        if (winner == null) {
          winner = checkOneRow(temp, i, 6, 7, 8);
        }
    }

    if(winner !== null) {
      await setGameWinner(winner);
    }
  }

  function checkOneRow(temp, i, val1, val2, val3) {
    let winner = null;
    if (i === val1 && temp[i].isFinal) {
      let user = temp[i].user;
      if (temp[val2].isFinal && temp[val2].user === user) {
        if (temp[val3].isFinal && temp[val3].user === user) {
          winner = user;
        }
        else {
          user = "";
        }
      }
      else {
        user = "";
      }
    }

    return winner;
  }

  return (
    <>
      <div className="board">
              {gameBoardBoxes.map((box, index) =>
                <Box key={index} 
                     handleSelect={handleUserSelect}
                     handleUnselect={handleUserUnselect}
                     index={index} 
                     hasValue={box.hasValue} 
                     icon={box.icon}
                     currentUser={currentUser}/>
              )}
      </div>
      {currentUser !== "Computer" && 
      <ButtonToolbar>
        <Button variant="primary" size="lg" onClick={handleSubmitClicked}>
            Submit turn
        </Button>      
      </ButtonToolbar>}
      {gameWinner !== null &&
      <h1>{gameWinner} Won!</h1>}
      {(gameTied && gameWinner == null) &&
      <h1>Tie!</h1>}
    </>
  );
}