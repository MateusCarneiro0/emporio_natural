import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Products from "./Pages/Products";
import Cart from "./Pages/Cart";
import Product from "./Components/productsComponents/Product";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import NotFound from "./Pages/NotFound";
import LoggedProtected from "./Components/protectedRoutes/LoggedProtected";
import AuthProtected from "./Components/protectedRoutes/AuthProtected";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/produtos"
          element={
            <AuthProtected>
              <Products />
            </AuthProtected>
          }
        >
          <Route
            path="/produtos/:id"
            element={
              <AuthProtected>
                <Product />
              </AuthProtected>
            }
          />
        </Route>
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/login"
          element={
            <LoggedProtected>
              <Login />
            </LoggedProtected>
          }
        />
        <Route
          path="/signup"
          element={
            <LoggedProtected>
              <Signup />
            </LoggedProtected>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
