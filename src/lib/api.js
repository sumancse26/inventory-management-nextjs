const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

export const fetchApi = async (endPoint, options) => {
  const url = `${BASE_URL}${endPoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};
