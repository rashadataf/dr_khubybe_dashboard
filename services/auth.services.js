import axios from "axios";

const API = "/api/auth";

const signup = async (firstName, lastName, email, password) => {
  try {
    const response = await axios.post(`${API}/signup`, {
      firstName,
      lastName,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

const login = async (email, password) => {
  try {
    const response = await axios.post(`${API}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

const logout = () => {
  // try {
  //   const response = await axios.post(`${API}/logout`,null,{
  //     headers: {
  //       Authorize: 'Bearer ' + localStorage.getItem("token")
  //     }
  //   });
  // } catch (error) {

  // }
  // localStorage.clear();
  // const router = useRouter();
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("expiryDate");
  return;
};

const AuthService = {
  signup,
  login,
  logout,
};

export default AuthService;
