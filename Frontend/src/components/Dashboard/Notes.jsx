import React from 'react';

const Notes = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 ml-10">Notes</h2>
      <div className="flex gap-4 ml-10">
        <div className="bg-orange-400 text-white py-4 px-6 rounded-lg">Note 1</div>
        <div className="bg-teal-400 text-white py-4 px-6 rounded-lg">Note 2</div>
        <div className="bg-orange-400 text-white py-4 px-6 rounded-lg">Note 3</div>
        <div className="bg-teal-400 text-white py-4 px-6 rounded-lg">Note 4</div>
        <div className="bg-orange-400 text-white py-4 px-6 rounded-lg">Note 5</div>
        <div className="bg-teal-400 text-white py-4 px-6 rounded-lg">Note 6</div>
      </div>
    </div>
  );
};

export default Notes;
