// This was added for front end testing only
import React from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_USERS } from '../utils/queries';

const AllUsers = () => {
  const { loading, error, data } = useQuery(QUERY_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return data.users.map(({ username, email }) => (
    <div>
      <h3>{username}</h3>

      <b>About this location:</b>
      <p>{email}</p>
      <br />
    </div>
  ));
};

export default AllUsers;
