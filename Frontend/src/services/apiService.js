// Base URL configuration

// Function to fetch data from an API endpoint
export const getData = async (url) => {
    try {
        // Making the GET request using fetch
        const response = await fetch(`${url}`);
        // Check if the response is not okay (status code not in the 200–299 range)
        if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`);
        }

        // Parse the JSON data
        const data = await response.json();

        // Returning the transformed data
        return { data: data, error: null };
    } catch (error) {
        // optional and can be removed
        console.error('API fetch error:', error);

        // Handling different error scenarios
        if (error.message.startsWith('Server Error')) {
            return { data: null, error: error.message };
        } else if (error.message === 'Failed to fetch') {
            // Handle network errors (e.g., no internet connection)
            return { data: null, error: 'Network Error: Unable to reach the server' };
        } else {
            return { data: null, error: `Error: ${error.message}` };
        }
    }
};

// Function to post data to an API endpoint
export const postData = async (url, payload) => {
    try {
        // Making the POST request using fetch
        const response = await fetch(`${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        // Check if the response is not okay (status code not in the 200–299 range)
        if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`);
        }

        // Parse the JSON data
        const data = await response.json();

        // Returning the transformed data
        return { data, error: null };
    } catch (error) {
        // Optional and can be removed
        console.error('API fetch error:', error);

        // Handling different error scenarios
        if (error.message.startsWith('Server Error')) {
            return { data: null, error: error.message };
        } else if (error.message === 'Failed to fetch') {
            // Handle network errors (e.g., no internet connection)
            return { data: null, error: 'Network Error: Unable to reach the server' };
        } else {
            return { data: null, error: `Error: ${error.message}` };
        }
    }
};

