import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';

interface jwtPayload {
    name: string;
    email: string;
    user_id: number | string;
    role: string;
}

const saltRounds = 10;

export const encryptPassword = async (password: string) => await bcrypt.hash(password, saltRounds);

export const decryptPassword = async (password: string, encryptedPassword: string) =>
    await bcrypt.compare(password, encryptedPassword);

export const jwtEncode = async ({ name, email, user_id, role }: jwtPayload): Promise<string> => {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const jwt = await new SignJWT({ name: name, email, user_id, role })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(secret);
    return jwt;
};

export const filterArray = (items: [], searchKey: string, options: object): object => {
    if (!items?.length) {
        return [];
    }
    return items.filter(filterObject(searchKey, options));
};

export const filterObject = (searchKey: string, { ignoreCase = false } = {}) => {
    return (item: object) => {
        if (!searchKey) {
            return true;
        }

        let reduceStr = Object.entries(item).reduce((result, [, value]) => {
            return !(value instanceof Object) ? (result += ` ${value}`) : result;
        }, '');

        if (!ignoreCase) {
            searchKey = searchKey.toLowerCase();
            reduceStr = reduceStr.toLowerCase();
        }

        return reduceStr.includes(searchKey);
    };
};

export const buildUrl = (url: string, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return queryString ? `${url}?${queryString}` : url;
};

export const generateInvoiceNumber = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123adskwlc456789abcdefghijklmnopqrstuvwxyz';
    let result = 'INV';
    for (let i = 0; i < 5; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result?.toString();
};

export const generateProductCode = (name: string): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const namePart = (name || 'XX').substring(0, 2).toUpperCase();
    let randomPart = '';

    for (let i = 0; i < 4; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return `${namePart}${randomPart}`;
};
