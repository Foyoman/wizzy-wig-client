import axios from "axios";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import { setAuthTokens, setUser } from "../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";

const baseURL = "http://localhost:8000";

const useAxios = () => {
  const dispatch = useDispatch();
  const authTokens = useSelector((state: RootState) => state.auth.authTokens);

  const axiosInstance = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${authTokens?.access}`,
    },
  });

  axiosInstance.interceptors.request.use(async (req) => {
    const user = jwt_decode(authTokens.access) as { exp: number };
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if (!isExpired) return req;

    console.log('expired token intercepted, refreshing token and redoing request')

    const response = await axios.post(`${baseURL}/api/token/refresh/`, {
      refresh: authTokens.refresh,
    });

    localStorage.setItem("authTokens", JSON.stringify(response.data));

    dispatch(setAuthTokens(response.data));
    dispatch(setUser(jwt_decode(response.data.access)));

    req.headers.Authorization = `Bearer ${response.data.access}`;

    return req;
  });

  return axiosInstance;
};

export default useAxios;
