import React from 'react'
import WelcomeQoute from '../../components/Dashboard/WelcomeQoute'
import Tasks from '../../components/Dashboard/Tasks'
import Notes from '../../components/Dashboard/Notes'
import Activity from '../../components/Dashboard/Activity'


function dashboard() {
  return (
    <div>
      <WelcomeQoute name="Etisam" />
      <Tasks/>
      <Activity/>
      <Notes/>

    </div>
  )
}

export default dashboard
