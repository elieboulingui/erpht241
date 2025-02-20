import React from 'react'
import Tabs from './components/TabsOne'
import { auth } from '@/auth'
import InviteTeam from './components/TabsTwo';

export default async function Page() {
  const session = await auth();
  const userId = session?.user?.id; // Assuming session contains user data with an ID

  return (
    <div className='flex'>
      <div className='w-full'>
        {userId ? <Tabs userId={userId} /> : <p>Loading...</p>}
      </div>
      {/* <div className='w-full'>
        <InviteTeam />
      </div> */}
    </div>
  )
}
