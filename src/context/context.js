import React, { useState, useEffect } from 'react'
import mockUser from './mockData.js/mockUser'
import mockRepos from './mockData.js/mockRepos'
import mockFollowers from './mockData.js/mockFollowers'
import axios from 'axios'

const url = 'https://api.github.com'

//  GithubUserContext,consumer,GithubUserContext.Provider
const GithubContext = React.createContext()

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser)
  const [repos, setRepos] = useState(mockRepos)
  const [followers, setFollowers] = useState(mockFollowers)

  const [requests, setRequests] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState({
    show: false,
    msg: '',
  })

  // check rate
  const checkRequests = () => {
    axios
      .get(`${url}/rate_limit`)
      .then((response) => {
        if (response.status >= 200 && response.status < 299) {
          const { data } = response
          const {
            rate: { remaining },
          } = data
          setRequests(remaining)
          if (remaining === 0) {
            // do somthing
            toggleError(
              true,
              'sorry, you have exceeded your hourly rate limit!'
            )
          }
        }
      })
      .catch((error) => console.error(error))
  }
  const toggleError = (show = false, msg = '') => {
    setError({ show, msg })
  }
  const searchGithubUser = async (user) => {
    toggleError()
    setLoading(true)
    const response = await axios(`${url}/users/${user}`).catch((e) =>
      console.log(e)
    )

    if (response) {
      const { data } = response
      const { followers_url, repos_url } = data
      setGithubUser(data)

      await Promise.allSettled([
        axios(`${repos_url}?per_page=100`),
        axios(`${followers_url}?per_page=100`),
      ])
        .then((result) => {
          const [repos, followers] = result
          const status = 'fulfilled'
          if (repos.status === status) {
            setRepos(repos.value.data)
          }
          if (followers.status === status) {
            setFollowers(followers.value.data)
          }
        })
        .catch((e) => console.log('sattle error'))
    } else {
      toggleError(true, 'sorry,there is no user with that username')
    }
    setLoading(false)
    checkRequests()
  }
  useEffect(checkRequests, [])
  const contextValues = {
    githubUser,
    repos,
    followers,
    requests,
    error,
    searchGithubUser,
    loading,
  }

  return <GithubContext.Provider value={contextValues} children={children} />
}

export { GithubContext, GithubProvider }
