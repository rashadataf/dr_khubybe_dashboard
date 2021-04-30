import axios from "axios";

const API = "/api/super";

const saveSettings = async (apiKey, listID, server) => {
  try {
    const response = await axios.post(`${API}/settings`, {
      apiKey,
      listID,
      server,
    });
    return true;
  } catch (error) {
    console.log(error);
  }
};

const getSettings = async () => {
  try {
    const response = await axios.get(`${API}/settings`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const settingsServices = {
  getSettings,
  saveSettings,
};

export default settingsServices;
