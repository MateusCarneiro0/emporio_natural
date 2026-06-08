import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Products from "./Pages/Products";
import Cart from "./Pages/Cart";
import NotFound from "./Pages/NotFound";
import { Provider } from "react-redux";
import store from "./store";
import Product from "./Components/productsComponents/Product";

function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/produtos" element={<Products />}>
              <Route path="/produtos/:id" element={<Product />} />
            </Route>
            <Route path="/cart" element={<Cart />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;

//In 4 version of vite
//Use in terminal: npm i eslint vite-plugin-eslint eslint-config-react-app --save-dev
//Delete .eslintrc.js and put .eslintrc.json
//In this put(all with double asps): cej cvjs
