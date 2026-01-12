import './App.css'
import Header from './components/Header/Header'
import Experience from './Experience/Experience'
import Footer from './components/Footer/Footer'
import Themer from './components/Themer/Themer'
import { useBackgroundMusic } from './hooks'

function App() {
  useBackgroundMusic()

  return (
    <>
      <Header />
      <main className='main'>
        <Experience />
      </main>
      <Footer />
      <Themer />
    </>
  )
}

export default App
