import axios from 'axios';


const SERVER_HOST = 'localhost';
const SERVER_PORT = 8000;
const SERVER_URL = `http://${SERVER_HOST}:${SERVER_PORT}/`;

const ENDPOINTS = {
    CHIEF_NAMES: 'chief-names',
    CRYPTOCURRENCIES: 'cryptocurrencies',
    REPORT: 'report',
    DOWNLOAD_REPORT: 'report/pdf'
}


export const get = async (path: string) => {
    const url = SERVER_URL + path;
    const response = await axios.get(url);
    return response.data;
}

export const post = async (path: string, data: any) => {
    const url = SERVER_URL + path;
    const response = await axios.post(url, data);
    return response.data;
}

export const postBlob = async (path: string, data: any) => {
    const url = SERVER_URL + path;
    const response = await axios.post(url, data, {responseType: 'blob'});
    return response;
}


export const getChiefNames = async () => {
    return await get(ENDPOINTS.CHIEF_NAMES);
}


export const getCryptoCurrencies = async () => {
    return await get(ENDPOINTS.CRYPTOCURRENCIES);
}

export type CryptocurrencyRate = {
    name: string,
    rate: number,
    currency: string
}

export type CryptocurrencyAmount = {
    name: string,
    quantity: number,
}

export type CryptocurrencyManualRates = {
    url: string,
    name: string,
    cryptocurrencyRates: CryptocurrencyRate[]
}

export type Report = {
    id: string,
    date: string,
    valueCurrency: string,

    name: string,
    caseNumber: string,
    ownerData: string,
    cryptocurrenciesAmount: CryptocurrencyAmount[]
    cryptocurrencyManualRates: CryptocurrencyManualRates[]
}

export const postReport = async (report: any) => {
    try {
        return await post(ENDPOINTS.REPORT, report);
    }
    catch (error) {
        // console.log(error)
        return null;
    }
}

export const postReportPDF = async (report: any) => {
    try {
        return await postBlob(ENDPOINTS.DOWNLOAD_REPORT, report);
    }
    catch (error) {
        // console.log(error)
        return null;
    }
}