/* eslint-disable no-underscore-dangle */

import {AD_API} from '../fasitProperties'

export class ApiError {
    constructor(message, statusCode) {
        this.message = message;
        this.statusCode = statusCode;
    }
}

async function get(url) {
    let response;
    try {
        response = await fetch(url, {
            method: 'GET'
        });
    } catch (e) {
        throw new ApiError(e.message, 0);
    }

    if (response.status !== 200) {
        throw new ApiError(response.statusText, response.status);
    }
    return response.json();
}

async function post(url, query) {
    let response;
    try {
        response = await fetch(url, {
            body: JSON.stringify(query),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (e) {
        throw new ApiError(e.message, 0);
    }

    if (response.status !== 200) {
        throw new ApiError(response.statusText, response.status);
    }
    return response.json();
}

export async function fetchStilling(uuid) {
    return get(`${AD_API}ads/${uuid}`);
}

export async function fetchAds() {
    return get(`${AD_API}ads/`);
}

export async function fetchEmployerSuggestions(prefix) {
    return Promise.resolve([`${prefix}-aaaa`, `${prefix}-bbbb`, `${prefix}-cccc`]);
}

export async function fetchLocationSuggestions(prefix) {
    return Promise.resolve([`${prefix}`, `${prefix}by`, `${prefix}nes`]);
}

export async function fetchStyrkSuggestions(prefix) {
    return Promise.resolve([`${prefix}-aaaa`, `${prefix}-bbbb`, `${prefix}-cccc`]);
}

