import { atom } from "jotai";

// our timer count in seconds (default to work session)
export const countAtom = atom(1500);

// our bool to check if we are paused or playing
export const isPlaying = atom(false);

// checking if it's a work session or not
export const isWorkSession = atom(false);

// our number of sessions
export const sessionNum = atom(0);

// current session index - 0 = work, 1 = short break, 2 = long break
export const sessionIndex = atom(0);



// atoms for default values modified by settings
export const workLengthSecs = atom(1500);
export const shortBreakSecs = atom(300);
export const longBreakSecs = atom(900);