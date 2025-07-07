import { isServer } from '@/utils/checkServer';
import Cookies from 'js-cookie';

const BASE_URL =
    process.env.NODE_ENV === 'production' ? 'https://sales-inventory-two.vercel.app' : 'http://localhost:3000';

export const fetchApi = async (endPoint, options = {}) => {
    let token = '';
    if (isServer()) {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        token = cookieStore.get('token')?.value || '';
    } else {
        token = Cookies.get('token') || '';
    }

    const isFormData = options.body instanceof FormData;

    const headers = {
        ...(options.headers || {}),
        ...(token && { Authorization: `Bearer ${token}` }), // ✅ standard token header
        ...(!isFormData && { 'Content-Type': 'application/json' }) // ✅ only if not FormData
    };

    const url = `${BASE_URL}${endPoint}`;
    //const url = endPoint;

    try {
        const response = await fetch(url, {
            ...options,
            headers
        });

        const contentType = response.headers.get('content-type');

        if (contentType?.includes('application/json')) {
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.message || `Request failed: ${response.status}`);
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
