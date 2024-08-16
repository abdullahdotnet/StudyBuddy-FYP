import React, { useEffect } from 'react'
import { getData } from '../../services/apiService'
function Home() {
  const [data, setData] = React.useState([])
  const url = 'https://jsonplaceholder.typicode.com/posts'
  useEffect(() => {
    const loadPosts = async () => {
      const {data, error} = await getData(url)
      if (data) {
        setData(data)
      } else {
        setData([{title: error, id: 0}])
      }
    }
    // loadPosts()
  }, [])
  return (
    <div>
      <h1>This is the home page</h1>
      {/* <ul>
        {data.map((post) => (
          <li key={post?.id}>{post?.title}</li>
        ))}
      </ul> */}
    </div>
  )
}

export default Home
