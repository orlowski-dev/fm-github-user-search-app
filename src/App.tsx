import { useEffect, useState } from 'react'
import './App.scss'
import { companyIcon, locationIcon, moonIcon, searchIcon, sunIcon, twitterIcon, websiteIcon } from './assets'
import { ReactSVG } from 'react-svg'

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
      <section className={`result-section container w-bg ${colorScheme}`}>
        <h2 className="visually-hidden">Result section</h2>
        <article className="user-info">
          <div className="user-picture-area">
            <img src="/Oval.png" alt="" />
          </div>
          <h3 className='full-name'>OctoCat</h3>
          <p className='username'>@octocat</p>
          <p className="date-joined">Joined 25 Jan 2011</p>
          <p className="bio">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod, repudiandae ipsum aliquid laborum doloremque alias et consequatur.</p>
          <section className='stats-section'>
            <div className="row">
              <h3>Repos</h3>
              <p>8</p>
            </div>
            <div className="row">
              <h3>Followers</h3>
              <p>8</p>
            </div>
            <div className="row">
              <h3>Following</h3>
              <p>8</p>
            </div>
          </section>
          <section className="additional-info-section">
            <h2 className="visually-hidden">Addition info</h2>
            <div className="row">
              <ReactSVG src={locationIcon} desc="location icon" />
              <p>San Francisco</p>
            </div>
            <div className="row">
              <ReactSVG src={websiteIcon} desc="website icon" />
              <p>
                <a href="" target='_blank' rel='noreferrer'>San</a>
              </p>
            </div>
            <div className="row not-av">
              <ReactSVG src={twitterIcon} desc="twitter icon" />
              <p>Not Available</p>
            </div>
            <div className="row">
              <ReactSVG src={companyIcon} desc="company icon" />
              <p>San Francisco</p>
            </div>
          </section>
        </article>
      </section>
    </main>
  </>)
}