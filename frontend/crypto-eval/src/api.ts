import axios from 'axios';


const SERVER_HOST = 'localhost';
const SERVER_PORT = 8000;
const SERVER_URL = `http://${SERVER_HOST}:${SERVER_PORT}/`;

const ENDPOINTS = {
    CHIEF_NAMES: 'chief-names',
    CRYPTOCURRENCIES: 'cryptocurrencies',
}


export const get = async (path: string) => {
    const url = SERVER_URL + path;
    const response = await axios.get(url);
    return response.data;
}


export const getChiefNames = async () => {
    return await get(ENDPOINTS.CHIEF_NAMES);
}


export const getCryptoCurrencies = async () => {
    return await get(ENDPOINTS.CRYPTOCURRENCIES);
}
