import React from 'react'
import LeadGeneration from "./components/LeadGeneration"
import ContactsOverview from "./components/Listcontact"
import  Darkpeack  from './components/Darkpeack'
export default function page() {
  return (
    <div className='bg-white'>
     <Darkpeack/>
      <LeadGeneration/>
      <ContactsOverview/>
    </div>
  )
}
