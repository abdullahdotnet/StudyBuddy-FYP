import { Link } from 'react-router-dom';

const EntryTest = () => {
    return (
        <div className="flex flex-col   min-h-screen  p-6">
            <h1 className="text-3xl font-bold mb-6">Entry Test</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mock Test Card */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Mock Test</h2>
                    <p className="text-gray-600 mb-6">Prepare for your entry test with our carefully designed mock tests to help you succeed.</p>
                    <Link to="/entry-test/test" className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                        Start Mock Test
                    </Link>
                </div>
                {/* Book Wise Card */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Book Wise Preparation</h2>
                    <p className="text-gray-600 mb-6">Study and practice for your test with book-wise questions and answers.</p>
                    <Link to="/entry-test/book-wise" className="inline-block bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                        Start Book Wise Preparation
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EntryTest;
