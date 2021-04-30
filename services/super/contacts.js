import axios from "axios";

const API = "/api/super";

const fetchAll = async () => {
  try {
    const response = await axios.get(`${API}/contacts`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const contactsServices = {
  fetchAll,
};

export default contactsServices;
