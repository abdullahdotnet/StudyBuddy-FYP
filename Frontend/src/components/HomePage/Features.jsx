import React from 'react';

const Features = () => {
  const images = [
    '/src/assets/images/students01.avif',
    '/src/assets/images/students06.jpg',
    '/src/assets/images/students04.jpg'
  ];

  return (
    <section className="py-16" id='features-section'>
      <h2 className="text-center text-4xl font-bold mb-10 robot-font text-customTextDark" >FEATURES</h2>
      <div className="space-y-10 w-10/12 mx-auto text-sm roboto-font">

        {/* Feature 1 */}
        <div className="flex place-items-center justify-center shadow gap-x-10 space-x-8 py-8 rounded-lg">
          <div className="h-64 w-96 bg-white rounded-lg  flex items-center justify-center">
            <img
              src={images[0]}
              alt="Smart Entry Test Prep"
              className="h-full w-full object-cover rounded-lg shadow-lg"
            />
          </div>
          <div className='w-1/2'>
            <h3 className="text-2xl font-bold text-center text-customTextDark">Smart Entry Test Prep</h3>
            <p className="mt-4 text-base">
              Streamline your entry test preparation with StudyBuddy's specialized tools. Access concise summaries, practice resources, and targeted study materials to excel in competitive exams effortlessly.
            </p>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="flex place-items-center justify-center flex-row-reverse shadow gap-x-10 space-x-8 py-8 rounded-lg">
          <div className="h-64 w-96 bg-white rounded-lg shadow-xl flex items-center justify-center">
            <img
              src={images[2]}
              alt="YouTube Learning Companion"
              className="h-full w-full object-cover rounded-lg shadow-lg"
            />
          </div>
          <div className='w-1/2'>
            <h3 className="text-2xl font-bold text-center text-customTextDark">YouTube Learning Companion</h3>
            <p className="mt-4 text-base">
              Enhance your learning with StudyBuddy's YouTube integration. Take notes, capture screenshots, and chat with videos directly from YouTube for an interactive and efficient study experience!
            </p>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="flex place-items-center justify-center shadow gap-x-10 space-x-8 py-8 rounded-lg">
          <div className="h-64 w-96 bg-white rounded-lg shadow-xl flex items-center justify-center">
            <img
              src={images[1]}
              alt="Students AI Assistant"
              className="h-full w-full object-cover rounded-lg shadow-lg"
            />
          </div>
          <div className='w-1/2'>
            <h3 className="text-2xl font-bold text-center text-customTextDark">AI Chatbot</h3>
            <p className="mt-4 text-base">
              Our AI Chatbot provides instant assistance, answering questions, summarizing content, and offering insights. It's your personal guide for learning, available anytime to enhance understanding and productivity.
            </p>
          </div>
        </div>

        {/* Feature 4 */}
        <div className="flex place-items-center justify-center flex-row-reverse shadow gap-x-10 space-x-8 py-8 rounded-lg">
          <div className="h-64 w-96 bg-white rounded-lg shadow-xl flex items-center justify-center">
            <img
              src={images[2]}
              alt="Ace Your Board Exams"
              className="h-full w-full object-cover rounded-lg shadow-lg"
            />
          </div>
          <div className='w-1/2'>
            <h3 className="text-2xl font-bold text-center text-customTextDark">Ace Your Board Exams</h3>
            <p className="mt-4 text-base">
              Stay organized during your board exam preparation with StudyBuddy. Take effective notes and streamline your study process to focus on the topics that matter most for success.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Features;
