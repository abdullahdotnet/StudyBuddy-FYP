import React from 'react';

const Features = () => {
  const images = [
    '/src/assets/images/students01.avif',
    '/src/assets/images/students06.jpg',
    '/src/assets/images/students04.jpg'
  ];

  return (
    <section className="py-16" id='features-section'>
      <h2 className="text-center text-4xl font-bold mb-10 robot-font" >FEATURES</h2>
      <div className="space-y-10 w-10/12 mx-auto text-sm roboto-font">

        {/* Feature 1 */}
        <div className="flex place-items-center justify-center shadow gap-x-10 space-x-8 py-8 rounded-lg">
          <div className="h-64 w-96 bg-white rounded-lg  flex items-center justify-center">
            <img
              src={images[0]}
              alt="Students AI Assistant"
              className="h-full w-full object-cover rounded-lg shadow-lg"
            />
          </div>
          <div className='w-1/2'>
            <h3 className="text-2xl font-bold text-center">Students AI Assistant</h3>
            <p className="text-gray-600 mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eleifend fermentum leo. Sed ac tincidunt est, eget viverra sapien. Curabitur quis dolor convallis, efficitur arcu at, tincidunt dolor. 
            </p>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="flex place-items-center justify-center flex-row-reverse shadow gap-x-10 space-x-8 py-8 rounded-lg">
          <div className="h-64 w-96 bg-white rounded-lg shadow-xl flex items-center justify-center">
            <img
              src={images[1]}
              alt="Students AI Assistant"
              className="h-full w-full object-cover rounded-lg shadow-lg"
            />
          </div>
          <div className='w-1/2'>
            <h3 className="text-2xl font-bold text-center">AI Chatbot</h3>
            <p className="text-gray-600 mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eleifend fermentum leo. Sed ac tincidunt est, eget viverra sapien. Curabitur quis dolor convallis, efficitur arcu at, tincidunt dolor. 
            </p>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="flex place-items-center justify-center shadow gap-x-10 space-x-8 py-8 rounded-lg">
          <div className="h-64 w-96 bg-white rounded-lg shadow-xl flex items-center justify-center">
            <img
              src={images[2]}
              alt="Students AI Assistant"
              className="h-full w-full object-cover rounded-lg shadow-lg"
            />
          </div>
          <div className='w-1/2'>
            <h3 className="text-2xl font-bold text-center">Resource Finding</h3>
            <p className="text-gray-600 mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eleifend fermentum leo. Sed ac tincidunt est, eget viverra sapien. Curabitur quis dolor convallis, efficitur arcu at, tincidunt dolor. 
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Features;
