import axios from "axios";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";

const baseURL = "http://localhost:8000";

const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use(async (req) => {
  console.log('intercepted');

  let currentAuthTokens = localStorage.getItem("authTokens")
    ? JSON.parse(localStorage.getItem("authTokens")!)
    : null;

  // If there are no tokens, exit early
  if (!currentAuthTokens) return req;

  req.headers.Authorization = `Bearer ${currentAuthTokens?.access}`;

  const user = jwt_decode(currentAuthTokens.access) as { exp: number };
  const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

  // If the token hasn't expired, proceed with the request
  if (!isExpired) return req;

  try {
    const response = await axios.post(`${baseURL}/api/token/refresh/`, {
      refresh: currentAuthTokens.refresh,
    });

    console.log('refreshed')

    // If refresh is successful, update local storage and request headers
    localStorage.setItem("authTokens", JSON.stringify(response.data));
    req.headers.Authorization = `Bearer ${response.data.access}`;
  } catch (error) {
    // Handle token refresh errors here (e.g., redirect to login or show an error message)
    console.error("Error refreshing token:", error);
  }

  return req;
});

export default axiosInstance;
