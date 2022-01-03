import React from 'react'


export default function ProgressBarComponent({displaySettings,progress}) {

    return (
        <div className={displaySettings.timerProgressStyle} id="progressBar">
            <div style={{width: progress + "%"}} id="progressBarProgress">
            </div>
        </div>
    )
}
