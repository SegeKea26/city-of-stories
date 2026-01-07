import './App.css'
import Header from './components/Header/Header'
import Experience from './Experience/Experience'
import Footer from './components/Footer/Footer'

function App() {

  return (
    <>
      <Header />
      <main className='main'>
        <Experience />
      </main>
      <Footer />
    </>
  )
}

export default App
