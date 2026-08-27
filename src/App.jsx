import Nav from './components/Nav'
import ScrollVideo from './components/ScrollVideo'
import Services from './components/Services'
import Work from './components/Work'
import Process from './components/Process'
import Testimonials from './components/Testimonials'
import Quote from './components/Quote'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <a href="#services"
         className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60]
                    focus:rounded-full focus:bg-forest focus:px-5 focus:py-3 focus:text-sm focus:text-canvas">
        Skip to content
      </a>
      <Nav />
      <main>
        <ScrollVideo />
        <Services />
        <Work />
        <Process />
        <Testimonials />
        <Quote />
      </main>
      <Footer />
    </>
  )
}
