import React from 'react'


export default function PromptComponent({displaySettings,prompt, gameState, timerValue,gameName}) {

    const themeStyles = {
        backgroundColor: gameName === "catchphrase" ? '#ff0000' : '#008cff'
    }
    return (
        <div className={displaySettings.promptStyle}  style={themeStyles}>
            <span id="prompt">{gameState === "running" || gameState === "countdown" ? prompt : ""}</span>
            <p id="promptTimer">{gameState === "running" ? timerValue.toFixed(2) : ""}</p>
        </div>
    )
}
