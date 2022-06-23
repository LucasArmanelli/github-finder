import React, { useEffect, useContext } from 'react'
import GithubContent from '../context/github/GithubContext'
import { useParams } from 'react-router-dom'

function User() {
  const { getUser, user } = useContext(GithubContent)

  const params = useParams()

  useEffect(() => {
    getUser(params.login)
  }, [getUser, params.login])

  return (
    <div>User</div>
  )
}

export default User