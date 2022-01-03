import React from 'react'

export default function HelpComponent({displaySettings}) {
    return (
        <div className={displaySettings.helpStyle} id="helpDiv" >
            <h2>Help</h2>
            <ul>
                <li>Heads Up can only be played on mobile devices.</li>
                <li>Heads Up requires access to the mobile device's gyroscope. <b>If you previously declined permission, close and reopen the web browser.</b></li>
                <li>Unmute the sound and ensure that the mobile device isn't silented in order to hear the Heads Up audio cues.</li>
                <li>To exit out of a round, refresh the webpage.</li>
                <li>There are no teams or scorekeeping in this version of Catch Phrase.</li>
                <li>In order for the app to be able to ask permission to use the mobile device's gyroscope, ensure that https is used in the url, not http.</li>
                <li><a href='https://howdoyouplayit.com/catchphrase-rules-play-catchphrase/'>Catch Phrase rules</a></li>
                <li><a href='https://www.wikihow.com/Play-Heads-Up!'>Heads Up rules</a></li>
                
            </ul>

        </div>
    )
}
