import React from 'react'

export default function TimerOptionsComponent({displaySettings,currentTimerLength,OnChangeTimerLength}) {
    return (
        <div>
            <div className={displaySettings.timerOptionsStyle} id="timerOptionsDiv">
                <span id="timerOptionsSpan">Timer Length:</span>
                <select value={currentTimerLength} onChange={OnChangeTimerLength}>
                    <option key={0} value={10.0}>10s</option>
                    <option key={1} value={20.0}>20s</option>
                    <option key={2} value={30.0}>30s</option>
                    <option key={3} value={40.0}>40s</option>
                    <option key={4} value={50.0}>50s</option>
                    <option key={5} value={60.0}>60s</option>
                    <option key={6} value={70.0}>70s</option>
                    <option key={7} value={80.0}>80s</option>
                    <option key={8} value={90.0}>90s</option>
                    <option key={9} value={120.0}>120s</option>
                </select>
            </div>
        </div>
    )
}
