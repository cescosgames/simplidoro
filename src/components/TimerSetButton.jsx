import React, { useState } from 'react'
import { countAtom, isWorkSession, sessionIndex } from '../atoms'
import { useSetAtom } from 'jotai'

const TimerSetButton = ({ index, timeInSecs, timerName, clickActive, isClicked, isWorkSesh, seshIndex }) => {
    const setTime = useSetAtom(countAtom);
    const setSession = useSetAtom(isWorkSession);
    const setSeshIndex = useSetAtom(sessionIndex);

    // our aria label
    let ariaLabel = '';

    const setAriaLabel = () => {
      if(index === 0) { // pause button
        ariaLabel = 'Set Work Session';
      } else if (index === 1) {
        ariaLabel = 'Set Short Break';
      } else {
        ariaLabel = 'Set Long Break';
      }
    }

    setAriaLabel();
    
  return (
    <button 
        className={`bg-offwhite opacity-50 rounded-sm border-2 text-veg-carrot md:px-5 md:py-1 py-1 px-3 cursor-pointer transition hover:bg-veg-blue hover:opacity-90 hover:text-offwhite ${isClicked ? 'selected' : ''}`}
        aria-label={ariaLabel}
        onClick={() => {
          // set our time
          setTime(parseInt(timeInSecs));
          // set if it's a work or break
          setSession({isWorkSesh});
          // set which session index we are currently on
          setSeshIndex({seshIndex});
          // setIsPressed((prevState) => !prevState);
          {clickActive(index)};
          // console.log('isPressed');
          }
        }>
        {timerName}
    </button>
  )
}

export default TimerSetButton