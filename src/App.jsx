import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./Pages/Home"
import Products from "./Pages/Products"
import Contact from "./Pages/Contact"
import NotFound from "./Pages/NotFound"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/produtos" element={<Products/>} />
          <Route path="/contato" element={<Contact/>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

//In 4 version of vite
//Use in terminal: npm i eslint vite-plugin-eslint eslint-config-react-app --save-dev
//Delete .eslintrc.js and put .eslintrc.json
//In this put(all with double asps): cej cvjs
