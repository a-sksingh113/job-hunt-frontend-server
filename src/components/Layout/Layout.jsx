import Header from './Header'
import Footer from './Footer'
const Layout = ({children}) => {

  return (
    <div className="min-h-screen flex flex-col">
      <Header/>
      <main style={{ minHeight: "80vh" }}>
        {children}</main>
      <Footer/>
    </div>
  )
}

export default Layout