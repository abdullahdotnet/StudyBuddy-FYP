import React,{useState} from 'react';

const FindResources = () => {

  // State for number of articles and videos
  const [articleCount, setArticleCount] = useState(2);
  const [videoCount, setVideoCount] = useState(2);
  return (

    <div className="p-6 ml-60"> {/* Padding and margin left for space for sidebar */}
    
      {/* Heading */}
      <h1 className="text-3xl font-bold mb-6">Find Resources</h1>
      
      {/* Search Bar */}
      <div className="flex justify-between mb-6">
        <input
          type="text"
          placeholder="Search your topic here..."
          className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <button className="ml-2 py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
          <i className="fas fa-search"></i>
        </button>
      </div>

{/* Filters Section */}
<div className="flex flex-col space-y-4 ml-[1112px]">
  <label className="flex items-center bg-orange-200 p-2 rounded-md">
    <input 
      type="checkbox" 
      className="form-checkbox h-4 w-4 text-blue-600 mr-2" 
      defaultChecked 
    />
    <span className="text-sm">Articles</span>
    {/* Dynamic input for article count placed directly after text */}
    <input 
      type="number" 
      value={articleCount} 
      onChange={(e) => setArticleCount(e.target.value)} 
      className="w-10 text-sm font-bold bg-transparent border-none ml-2"
    />
  </label>

  <label className="flex items-center bg-orange-200 p-2 rounded-md">
    <input 
      type="checkbox" 
      className="form-checkbox h-4 w-4 text-blue-600 mr-2" 
      defaultChecked 
    />
    <span className="text-sm">Videos</span>
    {/* Dynamic input for video count placed directly after text */}
    <input 
      type="number" 
      value={videoCount} 
      onChange={(e) => setVideoCount(e.target.value)} 
      className="w-10 text-sm font-bold bg-transparent border-none ml-2"
    />
  </label>
</div>

      {/* Articles Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Articles</h2>
        <div className="bg-green-100 p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-xl">Linear Algebra: A game changer</h3>
          <p className="text-gray-700">
            Here will come the description of the article. We will show a couple of lines over here and then the user can click "see more" to get to the article.
          </p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="font-semibold text-xl">Linear Algebra: A game changer</h3>
          <p className="text-gray-700">
            Here will come the description of the article. We will show a couple of lines over here and then the user can click "see more" to get to the article.
          </p>
        </div>
      </div>

      {/* Videos Section */}
        <div>
            <div className="flex items-center space-x-4 mb-4">
              <h2 className="text-2xl font-semibold mb-4">Videos</h2>
              <div className="flex items-center">
              </div>
            </div>

            {/* Video Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-100 p-4 rounded-md">
                <div className="bg-orange-200 h-60 mb-2"></div>
                <h4 className="font-bold">Linear Algebra: A game changer</h4>
                <p className="text-sm text-gray-600">
                  Here will come the description of the video. We will show a couple of lines here, and the user can click the "see more"...
                </p>
              </div>
            </div>
          </div>
        </div>

  );
};

export default FindResources;
