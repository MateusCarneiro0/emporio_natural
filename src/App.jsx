import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoggedProtected from "./Components/protectedRoutes/LoggedProtected";
import AuthProtected from "./Components/protectedRoutes/AuthProtected";
import SpinnerFullScreen from "./Components/SpinnerFullScreen";
const Home = lazy(() => import("./Pages/Home"));
const Products = lazy(() => import("./Pages/Products"));
const Cart = lazy(() => import("./Pages/Cart"));
const Product = lazy(() => import("./Components/productsComponents/Product"));
const Login = lazy(() => import("./Pages/Login"));
const Signup = lazy(() => import("./Pages/Signup"));
const NotFound = lazy(() => import("./Pages/NotFound"));
function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<SpinnerFullScreen />}>
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
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
