import axios from "axios";

const API = "/api/super";

const fetchAll = async () => {
  try {
    const response = await axios.get(`${API}/admins`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const createNewAdmin = async (formData) => {
  try {
    const response = await axios.post(`${API}/admins`, formData);
    return true;
  } catch (error) {
    console.log(error);
  }
};

const updateAdmin = async (_id, formData) => {
  try {
    const response = await axios.put(`${API}/admins/${_id}`, formData);
    return true;
  } catch (error) {
    console.log(error);
  }
};

const deleteAdmin = async (_id) => {
  try {
    const response = await axios.delete(`${API}/admins/${_id}`);
    return true;
  } catch (error) {}
};

const adminsServices = {
  fetchAll,
  createNewAdmin,
  updateAdmin,
  deleteAdmin,
};

export default adminsServices;
