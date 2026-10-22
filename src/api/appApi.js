import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../secretKeys";
import { logout } from "../slices/authSlice";

const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL, credentials: "include" });
let refreshState = null;

async function fetchRefresh() {
  const headers = {
    "Content-Type": "application/json",
  };

  const options = {
    method: "POST",
    headers,
    credentials: "include",
  };
  const res = await fetch(`${BASE_URL}/refresh`, options);

  const data = await res.json();
  return { res, data };
}

async function baseQueryWithReauth(args, api, extraOptions) {
  let result = await baseQuery(args, api, extraOptions);

  try {
    if (result.error && result?.error.status === 401) {
      if (!refreshState) {
        refreshState = fetchRefresh();
      }
      const { res } = await refreshState;
      if (res?.ok) {
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    }
  } catch {
    api.dispatch(logout());
  } finally {
    refreshState = null;
  }

  return result;
}

const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Products", "Cart"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/",
      providesTags: ["Products"],
      keepUnusedDataFor: 120,
    }),
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    getCart: builder.query({
      query: () => "users/cart",
      providesTags: ["Cart"],
    }),

    addProductCart: builder.mutation({
      query: (body) => ({
        method: "POST",
        url: "users/cart",
        body,
      }),

      invalidatesTags: ["Cart"],
    }),

    deleteProductCart: builder.mutation({
      query: (body) => ({
        method: "DELETE",
        url: "users/cart",
        body,
      }),

      invalidatesTags: ["Cart"],
    }),

    createNewUser: builder.mutation({
      query: (body) => ({
        url: "users/createnewuser",
        method: "POST",
        body,
      }),
    }),
  }),
});

export default appApi;

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetCartQuery,
  useAddProductCartMutation,
  useDeleteProductCartMutation,
  useCreateNewUserMutation,
} = appApi;
