import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Joblisting from '../components/joblisting'
import Appdownload from '../components/Appdownload'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <Joblisting/>
      <Appdownload/>
      <Footer/>
    </div>
  )
}

export default Home
