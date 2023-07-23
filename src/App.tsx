import { useEffect, useState } from 'react'
import './App.scss'
import { moonIcon, searchIcon, sunIcon } from './assets'

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
        <span className={colorScheme === 'dark' ? 'dark' : undefined}>devfinder</span>
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
    <main>
      <section className={`searchbar-section container w-bg ${colorScheme}`}>
        <h2 className='visually-hidden'>Searchbar section</h2>
        <form>
          <img src={searchIcon} alt='search icon' />
          <label>
            <span className="visually-hidden">GitHub username</span>
            <input
              type="text"
              id="username"
              placeholder="Search GitHub username.."
              className={colorScheme === 'dark' ? 'dark' : undefined}
            />
          </label>
          <span
            className="error"
            id='form-error'
          ></span>
          <button>Search</button>
        </form>
      </section>
    </main>
  </>)
}