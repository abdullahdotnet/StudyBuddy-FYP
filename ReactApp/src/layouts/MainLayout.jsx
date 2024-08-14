import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'
function main_layout() {
  return (
    <>
        <Navbar/>
        <Outlet/>
    </>
  )
}

export default main_layout
