import React from 'react'
import { atom, useAtom, useSetAtom } from 'jotai';
import { countAtom } from '../atoms'; // import our global atoms ts file to access our global atoms

// // initialize outside of react component
// const countAtom = atom(0);

const TestButton = () => {
    // this both uses state and setter functions, but if we don't want to use one or the other, we can use jotai functions to only access setter or state
    // const [time, setTime] = useAtom(countAtom);
    // in this case, we don't need to use the state, just the setter so we can use useSetAtom to set our count atom that will be picked up from our Timer.jsx componet
    const setTime = useSetAtom(countAtom);

  return (
    <div>
        <button 
            className='cursor-pointer bg-veg-blue p-5 rounded-md text-offwhite hover:opacity-50 transition'
            onClick={() => setTime((prevTime) => prevTime + 1)}
            >
                Increase by 1 second
        </button>
    </div>
  )
}

export default TestButton