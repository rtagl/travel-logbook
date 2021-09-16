const API_URL = 'http://localhost:3001';

let token = null;
export const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

export const getAll = async () => {
  const response = await fetch(`${API_URL}/api/logs`);
  return response.json();
};

export const createEntry = async (newEntry) => {
  const response = await fetch(`${API_URL}/api/logs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify(newEntry),
  });
  return response.json();
};

export const deleteEntry = async (entryId) => {
  const response = await fetch(`${API_URL}/api/logs/${entryId}`, {
    method: 'DELETE',
  });
  return response.json();
};
