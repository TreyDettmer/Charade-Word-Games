import React from 'react'

export default function GameButtonsComponent({displaySettings,ChangeGame,gameName}) {

    return (
        <div id="gameButtonsDiv" className={displaySettings.gameButtonsStyle}>
            <button className={gameName === "headsup" ? "gameButton" : "gameButton faded"} onClick={() => ChangeGame("catchphrase")}>Catch Phrase</button>
            <button className={gameName === "catchphrase" ? "gameButton" : "gameButton faded"} onClick={() => ChangeGame("headsup")}>Heads Up</button>
        </div>
    )
}
