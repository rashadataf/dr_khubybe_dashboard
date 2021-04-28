import axios from "axios";

const API = "/api/super";

const fetchAll = async () => {
  try {
    const response = await axios.get(`${API}/emails`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const createNewEmail = async (subject, content) => {
  try {
    const response = await axios.post(`${API}/emails`, { subject, content });
    return true;
  } catch (error) {
    console.log(error);
  }
};

const updateEmail = async (_id, formData) => {
  try {
    const response = await axios.put(`${API}/emails/${_id}`, formData);
    return true;
  } catch (error) {
    console.log(error);
  }
};

const deleteEmail = async (_id) => {
  try {
    const response = await axios.delete(`${API}/emails/${_id}`);
    return true;
  } catch (error) {}
};

const emailsServices = {
  fetchAll,
  createNewEmail,
  updateEmail,
  deleteEmail,
};

export default emailsServices;
