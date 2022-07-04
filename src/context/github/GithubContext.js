import { createContext, useReducer } from 'react';
import githubReducer from './GithubReducer';

const GitHubContext = createContext();

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN

export const GithubProvider = ({children}) => {
  const initialState = {
    users: [],
    user: {},
    loading: false,
  }

  const [state, dispatch] = useReducer(githubReducer, initialState)

  // Clear users from state
  const clearUsers = () => {
    dispatch({
      type: 'CLEAR_USERS',
    })
  }

  // Get search results
  const searchUsers = async (text) => {
    setLoading()

    const params = new URLSearchParams({
      q: text,
    });

    const response = await fetch(`${GITHUB_URL}/search/users?${params}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`
      },
    })

    const {items} = await response.json()
    
    dispatch({
      type: 'FETCH_USERS',
      payload: items,
    })
  }

  // Get single user
  const getUser = async (login) => {
    setLoading()

    const response = await fetch(`${GITHUB_URL}/users/${login}`,
    {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`
      },
    })

    if(response.status === 404) {
      window.location = '/notfound'
    } else {
      const data = await response.json()
    
      dispatch({
        type: 'FETCH_USER',
        payload: data,
      })

      return data
    }   
  }

  // set loading
  const setLoading = () => dispatch({ type: 'SET_LOADING' })

  return (
    <GitHubContext.Provider
    value={{
      users: state.users,
      loading: state.loading,
      user: state.user,
      searchUsers,
      clearUsers,
      getUser,
    }}>
      {children}
    </GitHubContext.Provider>
  ) 
}

export default GitHubContext