import Asside from "./components/Asside";
import Footer from "./components/Footer";
import Main from "./components/Main";

export default function App() {
  return (
    <div className="h-screen flex flex-col text-white">
      <div className="flex-1 flex" >
        <Asside />
        <Main />
      </div>
      <Footer />

    </div >
  )
}