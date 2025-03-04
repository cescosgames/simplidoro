import React, { useEffect, useState } from 'react'
import TimerSetButton from './TimerSetButton';
import { countAtom, isPlaying, isWorkSession, sessionNum, sessionIndex, workLengthSecs, shortBreakSecs, longBreakSecs } from '../atoms'; // our atom.ts file that holds all our atoms, imported in every component that needs it
import { useAtom, useAtomValue } from 'jotai'; 
import webNotif from '../assets/web-notif.mp3';

const Timer = () => {
    // these are our jotai global atoms (state) 
    const [time, setTime] = useAtom(countAtom); // our timer
    const [timerPlaying, setTimerPlaying] = useAtom(isPlaying); // our bool for if it's counting down
    const workLength = useAtomValue(isWorkSession); // our bool for tracking if it's a work session or break
    const [numSesh, setNumSesh] = useAtom(sessionNum); // our number of work sessions completed
    const [seshIndex, setSeshIndex] = useAtom(sessionIndex); // the index of which session we are currently on
    const workSecs = useAtomValue(workLengthSecs);
    const shortSecs = useAtomValue(shortBreakSecs);
    const longSecs = useAtomValue(longBreakSecs);

    // referencing our sound notification,
    const alarm = new Audio(webNotif);
    // making a visual notification if user is hard of hearing, function that will play a css animation and then stop it after 1s, takes place in our timer number text
    const [animate, setAnimate] = useState(false);

    // setting our session number
    const [sessionInt, setSessionInt] = useState(0);

    // setting our active length button, set to null on start because none should be selected
    const [activeLengthButton, setActiveLengthButton] = useState(0);
    // our function to handle which button is the active one, takes an index as an argument that we set in the timersetbutton itself
    const handleActiveLengthButton = (index) => {
        // set our activelengthbutton to the index (0,1, or 2 in our case)
        setActiveLengthButton(index);
        // continues in timerSetButton
    };
    // same thing, but for the pause/play/buttons, starts at 0 because it isn't playing
    const [activeControlButton, setActiveControlButton] = useState(0);
    // our function to handle which contorl button is the active one, takes an index as an argument that we set in the timersetbutton itself
    const handleActiveControlButton = (index) => {
        // set our activelengthbutton to the index (0,1, or 2 in our case)
        setActiveControlButton(index);
        // continues in start/stop buttons
    };

    // our function to format our time into 00:00 format, takes minutes and seconds as arguments
    function formatTime(timeInSecs) {
        // get our minutes from our seconds by rounding our timeInSeconds by 60
        let minutes = Math.floor(timeInSecs/60);
        // get our seconds by getting the remainder of timeInSecs/60
        let seconds = timeInSecs % 60;
        // this is our Pad function which takes in a number as as an argument, converts it to a string, and pads the string at the start with a 0
        // padStart has a maxlength of 2, so it will only add a 0 if the length is < 2 
        const pad = (num) => String(num).padStart(2,'0');
        // then we return our 
        return `${pad(minutes)}:${pad(seconds)}`;
    }

    function advanceSessionIndex(seshIndex) {
        // check if we are out of our sessions bounds
        if(seshIndex === 0) { // 0 is work session
            setNumSesh(prevNum => {
                // using a local variable so we can update our session before progressing (i.e. on 4) sidestepping react async updates
                const updatedNumSesh = prevNum + 1;
            
                if (updatedNumSesh % 4 === 0 && updatedNumSesh !== 0) {// if we've done 4 work sessions, jump to long break
                    setSeshIndex(prevIndex => prevIndex + 2);
                    setTime(longSecs);
                    setActiveControlButton(1);
                    setActiveLengthButton(2);
                } else { // else short break
                    setSeshIndex(prevIndex => prevIndex + 1);
                    setTime(shortSecs);
                    setActiveControlButton(1);
                    setActiveLengthButton(1);
                }

                // return our prevNum + 1 as our result for numSesh
                return updatedNumSesh;
            });
        } else if (seshIndex === 1) { // 1 is short session
            setSeshIndex(prevIndex => prevIndex - 1);
            setTime(workSecs);
            setActiveControlButton(1);
            setActiveLengthButton(0);
        } else { // 2 is long session
            setSeshIndex(0);
            setTime(workSecs);
            setActiveControlButton(1);
            setActiveLengthButton(0);
        }
    }

    // our useEffect to cue counting down
    useEffect(() => {
        // if our timer isn't playing, stop
        if(!timerPlaying) {
            return;
        }
        // once we hit 0, stop
        if(time <= 0) {
            // play the alarm when timer hits 0
            alarm.play();
            // visual feedback as well
            setAnimate(true);
            // and make sure to flip it back after 1s
            setTimeout(() => setAnimate(false),1000);
            // then add work sesh num
            if(workLength.isWorkSesh === true) {
                setNumSesh(prevNum => prevNum + 1);
            }
            advanceSessionIndex(seshIndex);
            return;
        }
        // set our interval
        const interval = setInterval(() => {
            setTime(prevTime => prevTime-1);
        }, 1000); //1000 milliseconds
        
        // this is a cleanup function! Didn't know about this before but essentially in react, when using intervals, you need to clean them when the useEffect is no longer called
        return () => clearInterval(interval);
        // so each time that time changes (each second) we set our interval and clear the previous interval until we hit 0
        // this is inefficient! in future versions, I will look for a more efficient solution
        // most likely, useRef would be the preferred solution

    }, [time, timerPlaying]); // dependency on time AND timerPlaying so our control buttons can affect it

    // updating our sessionNumber text when it changes
    useEffect(() => {
        setSessionInt(numSesh);
    }, [numSesh])

  return (
    // the pomo
    <div className={`flex flex-col gap-2 md:w-md w-xs mx-auto bg-veg-carrot my-5 rounded-full text-offwhite justify-center items-center ${animate ? 'animation' :''}`}>
        {/* the header to select work length */}
        <div className='flex md:gap-2 gap-1 justify-center w-[80%] mx-2 md:mt-8 mt-12'>
            {/* the buttons to switch which timer we are on */}
            {/* our index is what we pass to determine who is active, our isClicked checks if our index is === to the correct active button (returns true or false) */}
            {/* in the TimerSetButton, we dynamically add/remove class with a ternary checking if isClicked is true or false */}
            <TimerSetButton index={0} clickActive={handleActiveLengthButton} isClicked={activeLengthButton === 0} timerName={'work'} timeInSecs={workSecs} isWorkSesh={true} seshIndex={0}/> {/* 1500 default */}
            <TimerSetButton index={1} clickActive={handleActiveLengthButton} isClicked={activeLengthButton === 1} timerName={'short break'} timeInSecs={shortSecs} isWorkSesh={false} seshIndex={1}/> {/* 300 default */}
            <TimerSetButton index={2} clickActive={handleActiveLengthButton} isClicked={activeLengthButton === 2} timerName={'long break'} timeInSecs={longSecs} isWorkSesh={false} seshIndex={2}/> {/* 900 default */}
        </div>

        {/* the timer */}
        <div>
            <span className={`md:text-9xl text-8xl ${animate ? 'animation' :''}`}>{formatTime(time)}</span>
        </div>

        {/* the start/stop buttons */}
        <div className='flex gap-2 justify-center w-[50%] m-2'>
            {/* the buttons to switch which timer we are on, icons courtesy of heroicons. Didn't seperate into smaller component because I didn't want to deal with SVG */}
            {/* pause button */}
            <button className={`bg-offwhite border-2 opacity-50 rounded-sm text-veg-carrot px-5 py-1 cursor-pointer transition hover:bg-veg-blue hover:opacity-90 hover:text-offwhite
                ${activeControlButton === 0 ? 'buttonDown' : ''}`}
                aria-label='Pause Timer'
                onClick={() => {
                    // set our global jotai variable to false
                    setTimerPlaying(false);
                    handleActiveControlButton(0);
                    }
                }
                >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                </svg>
            </button>
            {/* play button */}
            <button className={`bg-offwhite opacity-50 border-2 rounded-sm text-veg-carrot px-5 py-1 cursor-pointer transition hover:bg-veg-blue hover:opacity-90 hover:text-offwhite
                ${activeControlButton === 1 ? 'buttonDown' : ''}`}
                aria-label='Play Timer'
                onClick={() => {
                    setTimerPlaying(true);
                    handleActiveControlButton(1);
                    }
                }
                >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                </svg>
            </button>
            {/* skip button */}
            <button className={`bg-offwhite opacity-50 border-2 rounded-sm text-veg-carrot px-5 py-1 cursor-pointer transition hover:bg-veg-blue hover:opacity-90 hover:text-offwhite
                ${activeControlButton === 3 ? 'buttonDown' : ''}`}
                aria-label='Skip Current Timer'
                onClick={() => {
                    setTimerPlaying(false);
                    advanceSessionIndex(seshIndex);
                    handleActiveControlButton(0);
                    }
                }
                >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z" />
                </svg>
            </button>
        </div>

        {/* the session tracker */}
        <div className='mb-2 flex flex-col'>
            <span>Pomos Doroed: {sessionInt}</span>
            {/* <span>Long Break in {`${4-sessionInt}`} more sessions!</span> */}
        </div>
    </div>
  )
}

export default Timer