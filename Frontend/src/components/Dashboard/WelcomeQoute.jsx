import React from 'react'

const WelcomeQoute = ( { name } ) => {
  return (
    <div className="py-8 px-4">
      <h1 className="text-4xl font-bold">
        Hi there, <span className="text-green-600">{name}</span>
        <span className="text-orange-500">!</span>
      </h1>
      <p className="mt-4 text-gray-500 italic">
        "Your time is limited, so don't waste it living someone else's life. Don't be trapped by dogma – 
        which is living with the results of other people's thinking" - Steve Jobs
      </p>
    </div>
  )
}

export default WelcomeQoute