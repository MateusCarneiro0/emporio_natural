import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoggedProtected from "./Components/protectedRoutes/LoggedProtected";
import AuthProtected from "./Components/protectedRoutes/AuthProtected";
import SpinnerFullScreen from "./Components/SpinnerFullScreen";
import AppLayout from "./Components/AppLayout";
import { ErrorBoundary } from "react-error-boundary";
import Error from "./Components/Error";

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
      <ErrorBoundary fallback={<Error />}>
        <Suspense fallback={<SpinnerFullScreen />}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/produtos" element={<Products />}>
                <Route
                  path="/produtos/:id"
                  element={
                    <AuthProtected>
                      <Product />
                    </AuthProtected>
                  }
                />
              </Route>
              <Route
                path="/cart"
                element={
                  <AuthProtected>
                    <Cart />
                  </AuthProtected>
                }
              />
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
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
