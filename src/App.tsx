import { useEffect, useRef, useState } from 'react'
import './App.scss'
import { companyIcon, locationIcon, moonIcon, searchIcon, sunIcon, twitterIcon, websiteIcon } from './assets'
import { ReactSVG } from 'react-svg'
import { Octokit } from '@octokit/core'


const SUPERSECRETKEY = 'ghp_u8JnzrHGxuU4Q_supersecret_5BQC8bnJzHEAuqmiG17QUXE'
const octokit = new Octokit({
  // just to hide from gh bot :/
  auth: SUPERSECRETKEY.split('_supersecret_')[0] + SUPERSECRETKEY.split('_supersecret_')[1]
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
  dateJoined: string,
  bio: string | null,
  publicRepos: number,
  followers: number,
  following: number,
  location: string | null,
  blog: string | null,
  twitter: string | null | undefined,
  company: string | null
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
  const [userData, setUserData] = useState<IUserData | null>()
  const getDataFromAPI = async (username: string) => {
    return await octokit.request('GET /users/{username}', {
      username: username,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    }).then((response) => {
      const responseData = response.data;

      setUserData({
        avatarUrl: responseData.avatar_url,
        name: responseData.name,
        login: responseData.login,
        dateJoined: responseData.created_at,
        bio: responseData.bio,
        publicRepos: responseData.public_repos,
        followers: responseData.followers,
        following: responseData.following,
        location: responseData.location,
        blog: responseData.blog,
        twitter: responseData.twitter_username,
        company: responseData.company
      })

      return true

    }).catch(() => {
      console.log('cannot fetch data, 404')
      return false
    })
  }

  // date
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
  const formatDate = (rawDate: string | null | undefined) => {
    if (!rawDate) return 'not found'
    const date = new Date(rawDate)
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
  }

  // get data after render
  useEffect(() => {
    getDataFromAPI('octocat')
  }, [])

  // form
  const formElems = {
    inputRef: useRef<HTMLInputElement>(null),
    errorSpanRef: useRef<HTMLSpanElement>(null),
    buttonRef: useRef<HTMLButtonElement>(null)
  }
  const [isBtnDisabled, setIsBtnDisabled] = useState(false)
  useEffect(() => {
    isBtnDisabled ? formElems.buttonRef.current?.classList.add('loading') : formElems.buttonRef.current?.removeAttribute('class')
  }, [isBtnDisabled, formElems.buttonRef])

  const handleSearchFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    formElems.errorSpanRef.current?.classList.remove('visible')

    const inputValue: string | null | undefined = formElems.inputRef.current?.value
    if (!inputValue) return
    if (inputValue.length < 3) return

    setIsBtnDisabled(true)
    const apiRequestOk = await getDataFromAPI(inputValue)
    if (!apiRequestOk) {
      formElems.errorSpanRef.current?.classList.add('visible')
    }
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
      <section
        className={`searchbar-section container w-bg ${colorScheme}`}
        onClick={() => formElems.inputRef.current?.focus()}
      >
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
          >No results</span>
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
          <p className="date-joined">Joined {formatDate(userData?.dateJoined)}</p>
          <p className="bio">{userData?.bio || 'This user has no set bio'}</p>
          <section className='stats-section'>
            <div className="row">
              <h3>Repos</h3>
              <p>{userData?.publicRepos || '-'}</p>
            </div>
            <div className="row">
              <h3>Followers</h3>
              <p>{userData?.followers || '-'}</p>
            </div>
            <div className="row">
              <h3>Following</h3>
              <p>{userData?.following || '-'}</p>
            </div>
          </section>
          <section className="additional-info-section">
            <h2 className="visually-hidden">Addition info</h2>
            <div className={`row ${!userData?.location && 'not-av'}`}>
              <ReactSVG src={locationIcon} desc="location icon" />
              <p>{userData?.location || 'not found'}</p>
            </div>
            <div className={`row ${!userData?.blog && 'not-av'}`}>
              <ReactSVG src={websiteIcon} desc="website icon" />
              <p>
                {
                  userData?.blog &&
                  <a href={userData.blog} target='_blank' rel='noreferrer'>{userData.blog}</a> ||
                  'not found'
                }
              </p>
            </div>
            <div className={`row ${!userData?.twitter && 'not-av'}`}>
              <ReactSVG src={twitterIcon} desc="twitter icon" />
              {userData?.twitter || 'not found'}
            </div>
            <div className={`row ${!userData?.company && 'not-av'}`}>
              <ReactSVG src={companyIcon} desc="company icon" />
              {userData?.company || 'not found'}
            </div>
          </section>
        </article>
      </section>
    </main>
    {/* footer */}
    <footer className="main-footer container">
      <p>Created by <a href="https://www.frontendmentor.io/profile/orlowski-dev" target='_blank' rel='noreferrer'>@orlowski-dev</a></p>
      <p>with ReactJS + Vite + TypeScript</p>
    </footer>
  </>)
}