import React from 'react'

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 z-20 w-full px-4 py-2 bg-veg-grass border-t border-offwhite shadow-sm flex flex-col items-center justify-center md:gap-2 md:flex-row">
        <span className="text-sm md:text-veg-blue text-offwhite sm:text-center cursor-default">
            <a href="https://github.com/cescosgames" target='_blank' className='transition hover:opacity-50' aria-label='link to github profile'>2025 Made by Cesco</a>
        </span>
        <ul className="hidden items-center text-sm font-medium text-offwhite sm:mt-0 md:block hover:opacity-50 transition">
            <li>
                <a href="https://github.com/cescosgames" target='_blank' className="me-4 md:me-6 cursor-pointer" aria-label='link to github profile'>Github</a>
            </li>
        </ul>
    </footer>
  )
}

export default Footer