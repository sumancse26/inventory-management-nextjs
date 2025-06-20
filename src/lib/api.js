// import Cookies from "js-cookie";
import { cookies } from "next/headers";
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

export const fetchApi = async (endPoint, options) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const url = `${BASE_URL}${endPoint}`;

  try {
    const response = await fetch(url, {
      ...options,

      headers: {
        ...options.headers,
        token,
        "Content-Type": "application/json",
      },
    });

    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || `Request failed with status ${response.status}`
        );
      }

      return data;
    } else {
      const text = await response.text();
      throw new Error(`Unexpected response format: ${text}`);
    }
  } catch (err) {
    return { error: true, message: err.message };
  }
};
