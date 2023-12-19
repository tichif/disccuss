'use client';

import { useSession } from 'next-auth/react';

const Profile = () => {
  const session = useSession();

  if (session.data?.user) {
    return <div>You are signed in</div>;
  } else {
    return <div>You are signed out</div>;
  }
};

export default Profile;
