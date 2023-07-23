import { useEffect, useState } from 'react'
import './App.scss'
import { moonIcon, sunIcon } from './assets'

const getColorScheme = (): string => {
  const colorSchemeInLocalStorage = localStorage.getItem('colorScheme')
  if (colorSchemeInLocalStorage && colorSchemeInLocalStorage === 'dark' || colorSchemeInLocalStorage === 'light') return colorSchemeInLocalStorage

  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function App() {
  const [colorScheme, setColorScheme] = useState<string>(getColorScheme())

  useEffect(() => {
    if (colorScheme === 'dark') {
      document.body.className = 'dark'
      localStorage.setItem('colorScheme', 'dark')
    } else {
      document.body.removeAttribute('class')
      localStorage.setItem('colorScheme', 'light')
    }
  }, [colorScheme])

  return (<>
    <header className='main-header container d-fl ai-c jc-sb'>
      <div className="brand-area">
        <span>devfinder</span>
      </div>
      <div className="button-area">
        <button
          className={`ccs-btn d-fl ai-c ${colorScheme}`}
          onClick={() => colorScheme === 'dark' ? setColorScheme('light') : setColorScheme('dark')}
        >
          {colorScheme === 'dark' && <>Light <img src={sunIcon} alt="sun icon" /></>}
          {colorScheme === 'light' && <>Dark <img src={moonIcon} alt="moon icon" /></>}
        </button>
      </div>
    </header>
  </>)
}