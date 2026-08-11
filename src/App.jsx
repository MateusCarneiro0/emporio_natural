import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import LoggedProtected from "./Components/protectedRoutes/LoggedProtected";
import AuthProtected from "./Components/protectedRoutes/AuthProtected";
import SpinnerFullScreen from "./Components/SpinnerFullScreen";
import AppLayout from "./Components/AppLayout";
import { ErrorBoundary } from "react-error-boundary";
import Error from "./Components/Error";
import AppBootstrap from "./AppBootstrap";
import { RouterProvider } from "react-router/dom";
import {
  fetchProducts,
  getProduct,
} from "./Components/productsComponents/actionProduct";

const Home = lazy(() => import("./Pages/Home"));
const Products = lazy(() => import("./Pages/Products"));
const Cart = lazy(() => import("./Pages/Cart"));
const Product = lazy(() => import("./Components/productsComponents/Product"));
const Login = lazy(() => import("./Pages/Login"));
const Signup = lazy(() => import("./Pages/Signup"));
const NotFound = lazy(() => import("./Pages/NotFound"));
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        element: <Home />,
        path: "/",
      },
      {
        element: <Products />,
        path: "/produtos",
        loader: fetchProducts,
        children: [
          {
            element: (
              <AuthProtected>
                <Product />
              </AuthProtected>
            ),
            path: "/produtos/:id",
            loader: getProduct,
          },
        ],
      },
      {
        element: (
          <AuthProtected>
            <Cart />
          </AuthProtected>
        ),
        path: "/cart",
      },
      {
        element: (
          <LoggedProtected>
            <Login />
          </LoggedProtected>
        ),
        path: "/login",
      },
      {
        element: (
          <LoggedProtected>
            <Signup />
          </LoggedProtected>
        ),
        path: "/signup",
      },
      {
        element: <NotFound />,
        path: "*",
      },
    ],
  },
]);
function App() {
  return (
    <ErrorBoundary fallback={<Error />}>
      <AppBootstrap>
        <Suspense fallback={<SpinnerFullScreen />}>
          <RouterProvider router={router} />
        </Suspense>
      </AppBootstrap>
    </ErrorBoundary>
  );
}

export default App;
