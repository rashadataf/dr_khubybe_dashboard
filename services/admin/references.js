import axios from "axios";

const API = "/api/admin";

const fetchAll = async () => {
  try {
    const response = await axios.get(`${API}/references`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const createNewReference = async (title) => {
  try {
    const response = await axios.post(`${API}/references`, { title });
    return true;
  } catch (error) {
    console.log(error);
  }
};

const updateReference = async (_id, title) => {
  try {
    const response = await axios.put(`${API}/references/${_id}`, { title });
    return true;
  } catch (error) {
    console.log(error);
  }
};

const deleteReference = async (_id) => {
  try {
    const response = await axios.delete(`${API}/references/${_id}`);
    return true;
  } catch (error) {}
};

const referencesServices = {
  fetchAll,
  createNewReference,
  updateReference,
  deleteReference,
};

export default referencesServices;
