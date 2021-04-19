import axios from "axios";

const API = "/api/admin";

const fetchAll = async () => {
  try {
    const response = await axios.get(`${API}/tags`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const createNewTag = async (title) => {
  try {
    const response = await axios.post(`${API}/tags`, { title });
    return true;
  } catch (error) {
    console.log(error);
  }
};

const updateTag = async (_id, title) => {
  try {
    const response = await axios.put(`${API}/tags/${_id}`, { title });
    return true;
  } catch (error) {
    console.log(error);
  }
};

const deleteTag = async (_id) => {
  try {
    const response = await axios.delete(`${API}/tags/${_id}`);
    return true;
  } catch (error) {}
};

const tagsServices = {
  fetchAll,
  createNewTag,
  updateTag,
  deleteTag,
};

export default tagsServices;
