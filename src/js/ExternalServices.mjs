const baseURL = import.meta.env.VITE_SERVER_URL || 'https://wdd330-backend.onrender.com/';

async function convertToJson(response) {
  const jsonResponse = await response.json();
  if (!response.ok) {
    throw { name: 'servicesError', message: jsonResponse };
  }
  return jsonResponse;
}

export default class ExternalServices {
  async checkout(order) {
    const response = await fetch(`${baseURL}checkout/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    return convertToJson(response);
  }
}