import React from 'react'


export default function GameStatsComponent({displaySettings,stats, ReturnToMenu}) {

    return (
        
        <div id="gameStats" className={displaySettings.gameStatsStyle}>
            <h2>Prompts Seen</h2>
            <ul>
                {stats.map(stat => (
                    
                    <li key={stat} style={{color: stat.length > 0 && stat[0] === "?" ? "#ff0000" : "#000000" }}>{stat.length > 0 && stat[0] === "?" ? stat.slice(1) : stat}</li>
                ))}
            </ul>
            <button onClick={ReturnToMenu}>Return To Menu</button>
        </div>
    )
}
