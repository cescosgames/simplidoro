import React, { useEffect, useRef, useState } from 'react'
import { workLengthSecs, shortBreakSecs, longBreakSecs } from '../atoms';
import { useAtom } from 'jotai';
import Blurb from './Blurb';

const Modal = ({ isOpen, toggleModal }) => {
    // setting and getting these
    const [workSecs, setWorkSecs] = useAtom(workLengthSecs);
    const [shortSecs, setShortBreakSecs] = useAtom(shortBreakSecs);
    const [longSecs, setLongBreakSecs] = useAtom(longBreakSecs);

    // our timer name and times, default to work
    const [timerName, setTimerName] = useState('Work');
    const [timerTime, setTimerTime] = useState(1500);

    // index to track which timer we're working on 0 work, 1 short, 2 long
    const [timerIndex, setTimerIndex] = useState(0);

    // adding a focus trap to our modal for accessibility, using useRef to grab our modal
    const modalRef = useRef(null); // initially setting to null, referenced in the main div JSX below. after mounting, our div will be assigned to modalref.current
    // if we are open, use effect on isopen to get all our elements to 'trap' our focus into
    useEffect(() => {
        // first check if we are not open or if the modal is null. if either of those, don't do anything
        if (!isOpen || !modalRef.current) return;

        // get all the focusable elements, in this case every button inside our modalRef.current aka our main div
        const focusableElements = modalRef.current.querySelectorAll("button");
        const firstElement = focusableElements[0]; // set the first one where to start 
        const lastElement = focusableElements[focusableElements.length - 1]; // set the last one where to end

        // Focus the first button when modal opens if the first element exists
        firstElement?.focus();

        // our keydown function to check for tab, shifttab, and escape
        const handleKeyDown = (e) => {
        if (e.key === "Tab") { 
            if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
                // prevent default behavior since we want to jump to the last element if we are shift tabbing on the first
                e.preventDefault();
                // using the ?. operator here and throughout to ensure the object we are trying to access returns true and if not, will return undefined instead of crashing
                lastElement?.focus();
            }
            } else {
            // Tab
            if (document.activeElement === lastElement) {
                e.preventDefault(); // same as above, but forward direction
                firstElement?.focus();
            }
            }
        }
        if (e.key === "Escape") { // escape key close modal option
            toggleModal();
        }
        };

        // add this key down function to our modal
        modalRef.current.addEventListener("keydown", handleKeyDown);

        // use the ? operator to check if modalRef.current returns true before remove the event listener and crashing the page
        return () => {
            // return in useEffect acts as a cleanup function, as in, it gets called when the component unmounts or when the effect is re-run
            modalRef.current?.removeEventListener("keydown", handleKeyDown);
        };
        
      }, [isOpen, toggleModal]); // could theoretically just use isOpen as a dependency, but since toggleModal could change in the parent this is safer


    // function to correctly display time
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

    // update our timer name and setting when we change index
    useEffect(() => {
        if(timerIndex === 0) {
            setTimerName('Work');
            setTimerTime(workSecs);
        } else if (timerIndex === 1) {
            setTimerName('Short');
            setTimerTime(shortSecs);
        } else {
            setTimerName('Long');
            setTimerTime(longSecs);
        }
    },[timerIndex])

    // update our length atoms
    useEffect(() => {
        if(timerIndex === 0) {
            setWorkSecs(timerTime);
        } else if (timerIndex === 1) {
            setShortBreakSecs(timerTime);
        } else {
            setLongBreakSecs(timerTime);
        }
    }, [timerTime])

    // function to advance or decrease timer we're working on isPrev is back, not is forward
    function switchTimer(isPrev) {
        if(!isPrev) {
            // flip through the timers (0 work, 1 short, 3 long)
            setTimerIndex((prevIndex) => (prevIndex >= 2 ? 0 : prevIndex + 1));
        } else {
            setTimerIndex((prevIndex) => (prevIndex <= 0 ? 2 : prevIndex - 1));
        } 
    }
    // same as above, but for time
    function switchTime(isMinus) {
        if(!isMinus) {
            // move the time up by 60 seconds, time limit of 1 hour
            setTimerTime((prevTime) => (prevTime < 3600 ? prevTime + 60 : 3600));
        } else {
            setTimerTime((prevTime) => (prevTime > 60 ? prevTime - 60 : 60));
        } 
    }
    // reset function
    function resetTimers() {
        setWorkSecs(1500);
        setShortBreakSecs(300);
        setLongBreakSecs(900);
        setTimerName('Work');
        setTimerTime(1500);
        setTimerIndex(0);
        // console.log('reset')
    }

    if(!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center bgOpacity justify-center w-[100vw] h-[100vh] z-10" ref={modalRef}>
        <div className="bg-veg-grass p-6 rounded-lg shadow-lg max-w-sm w-sm relative border-2 border-offwhite text-offwhite">

            {/* the close button */}
            <button onClick={()=>toggleModal()} className="absolute text-2xl top-2 right-2 hover:text-veg-carrot cursor-pointer transition hover:scale-130">
                x
            </button>

            {/* the body of the modal */}
            <div className='flex flex-col gap-5 items-center justify-center'>
                {/* header for the modal */}
                <span className='font-bold text-xl'>Time Settings</span>
                
                {/* the adjust timer button */}
                <div className='flex w-[75%] justify-between gap-0'>
                    <button onClick={() => switchTimer(true)} className='w-[30%] border rounded-md border-offwhite transition hover:bg-veg-carrot text-sm hover:text-offwhite cursor-pointer'>prev</button>
                    <span className='w-[40%] text-lg'>{timerName}</span>
                    <button onClick={() => switchTimer(false)} className='w-[30%] border rounded-md border-offwhite transition hover:bg-veg-carrot text-sm hover:text-offwhite cursor-pointer'>next</button>
                </div>
                {/* the adjust length buttons */}
                <div className='flex w-[75%] justify-between gap-0'>
                    <button onClick={() => switchTime(true)} className='w-[30%] border rounded-md border-offwhite transition hover:bg-veg-carrot hover:text-offwhite cursor-pointer'>-1</button>
                    <span className='w-[40%] text-lg'>{formatTime(timerTime)} </span>
                    <button onClick={() => switchTime(false)} className='w-[30%] border rounded-md border-offwhite transition hover:bg-veg-carrot hover:text-offwhite cursor-pointer'>+1</button>
                </div>

                {/* reset button */}
                <button 
                    className='mt-1 w-[30%] border rounded-md border-offwhite transition hover:bg-veg-carrot hover:text-offwhite cursor-pointer'
                    onClick={() => resetTimers()}
                    > Reset
                </button>

                <Blurb />

            </div>

        </div>
    </div>
  )
}

export default Modal