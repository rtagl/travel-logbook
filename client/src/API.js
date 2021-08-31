const API_URL = 'http://localhost:3001';

export const getAll = async () => {
  const response = await fetch(`${API_URL}/api/logs`);
  return response.json();
};

export const createEntry = async (newEntry) => {
  const response = await fetch(`${API_URL}/api/logs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newEntry),
  });
  return response.json();
};
