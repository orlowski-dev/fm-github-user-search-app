import { useEffect, useRef, useState } from 'react'
import './App.scss'
import { companyIcon, locationIcon, moonIcon, searchIcon, sunIcon, twitterIcon, websiteIcon } from './assets'
import { ReactSVG } from 'react-svg'
import { Octokit } from '@octokit/core'

const octokit = new Octokit({
  auth: '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'
})



const getColorScheme = (): string => {
  const colorSchemeInLocalStorage = localStorage.getItem('colorScheme')
  if (colorSchemeInLocalStorage && colorSchemeInLocalStorage === 'dark' || colorSchemeInLocalStorage === 'light') return colorSchemeInLocalStorage

  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

interface IUserData {
  avatarUrl: string,
  name: string | null,
  login: string,
}

export default function App() {
  // color scheme
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

  // user data
  const [userData, setUserData] = useState<IUserData | null>(null)
  const getDataFromAPI = async (username: string) => {
    await octokit.request('GET /users/{username}', {
      username: username,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    }).then((response) => {
      const responseData = response.data;
      console.log(responseData);

      setUserData({
        avatarUrl: responseData.avatar_url,
        name: responseData.name,
        login: responseData.login
      })


    }).catch(() => {
      console.log('cannot fetch data, 404')
    })
  }

  // get data after render
  useEffect(() => {
    getDataFromAPI('octocat')
  }, [])

  // form
  const [isBtnDisabled, setIsBtnDisabled] = useState(false)
  useEffect(() => {
    isBtnDisabled ? formElems.buttonRef.current?.classList.add('loading') : formElems.buttonRef.current?.removeAttribute('class')
  }, [isBtnDisabled])
  const formElems = {
    inputRef: useRef<HTMLInputElement>(null),
    errorSpanRef: useRef<HTMLSpanElement>(null),
    buttonRef: useRef<HTMLButtonElement>(null)
  }
  const handleSearchFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const inputValue: string | null | undefined = formElems.inputRef.current?.value
    if (!inputValue) return
    if (inputValue.length < 3) return

    setIsBtnDisabled(true)
    await getDataFromAPI(inputValue)
    setIsBtnDisabled(false)
  }

  return (<>
    {/* header */}
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
      {/* searchbar section */}
      <section className={`searchbar-section container w-bg ${colorScheme}`}>
        <h2 className='visually-hidden'>Searchbar section</h2>
        <form onSubmit={handleSearchFormSubmit}>
          <img src={searchIcon} alt='search icon' />
          <label>
            <span className="visually-hidden">GitHub username</span>
            <input
              type="text"
              id="username"
              placeholder="Search GitHub username.."
              className={colorScheme === 'dark' ? 'dark' : undefined}
              ref={formElems.inputRef}
              autoComplete='off'
            />
          </label>
          <span
            className="error"
            id='form-error'
            ref={formElems.errorSpanRef}
          ></span>
          <button
            disabled={isBtnDisabled}
            ref={formElems.buttonRef}
            className='loading'
          >
            <span>Search</span>
          </button>
        </form>
      </section>
      {/* result section & user info */}
      <section className={`result-section container w-bg ${colorScheme}`}>
        <h2 className="visually-hidden">Result section</h2>
        <article className="user-info">
          <div className="user-picture-area">
            <img src={userData?.avatarUrl} alt="avatar" />
          </div>
          <h3 className='full-name'>{userData?.name || userData?.login}</h3>
          <p className='username'>@{userData?.login}</p>
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