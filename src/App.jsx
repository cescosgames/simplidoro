import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Timer from './components/Timer';
import Footer from './components/Footer';
import Blurb from './components/Blurb';

function App() {

  return (
    <>
      <Navbar />
      <div className='flex items-center justify-center h-[75vh]'>
        <Timer />
      </div>
      <Footer />
    </>
  )
}

export default App
