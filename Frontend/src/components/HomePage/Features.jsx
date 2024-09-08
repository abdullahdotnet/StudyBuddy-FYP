import React from 'react';

const Features = () => {
  const images = [
    '/src/assets/images/students01.avif',
    '/src/assets/images/students02.jpeg',
    '/src/assets/images/students03.jpeg'
  ];

  return (
    <section className="py-16">
      <h2 className="text-center text-4xl font-bold mb-10">FEATURES</h2>

      <div className="space-y-16">

        {/* Feature 1 */}
        <div className="flex items-center space-x-8">
          <div className="h-64 w-96 bg-white rounded-lg shadow-xl flex items-center justify-center">
            <img
              src={images[0]}
              alt="Students AI Assistant"
              className="h-full w-full object-cover rounded-lg"
            />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Students AI Assistant</h3>
            <p className="text-gray-600 mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eleifend fermentum leo. Sed ac tincidunt est, eget viverra sapien. Curabitur quis dolor convallis, efficitur arcu at, tincidunt dolor. 
            </p>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="flex items-center space-x-8 flex-row-reverse">
          <div className="h-64 w-96 bg-white rounded-lg shadow-xl flex items-center justify-center">
            <img
              src={images[1]}
              alt="AI ChatBot"
              className="h-full w-full object-cover rounded-lg"
            />
          </div>
          <div>
            <h3 className="text-2xl font-bold">AI ChatBot</h3>
            <p className="text-gray-600 mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eleifend fermentum leo. Sed ac tincidunt est, eget viverra sapien. Curabitur quis dolor convallis, efficitur arcu at, tincidunt dolor. 
            </p>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="flex items-center space-x-8">
          <div className="h-64 w-96 bg-white rounded-lg shadow-xl flex items-center justify-center">
            <img
              src={images[2]}
              alt="Resource Locator"
              className="h-full w-full object-cover rounded-lg"
            />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Resource Locator</h3>
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
