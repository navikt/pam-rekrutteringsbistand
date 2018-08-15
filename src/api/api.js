import { redirectToLogin } from '../login';
import { SEARCH_API } from '../fasitProperties';

export class ApiError {
    constructor(message, statusCode) {
        this.message = message;
        this.statusCode = statusCode;
    }
}

async function request(url, options) {
    let response;
    try {
        response = await fetch(url, options);
    } catch (e) {
        throw new ApiError('Network Error', 0);
    }

    if (response.status !== 200) {
        if (response.status === 401) {
            redirectToLogin();
        } else {
            throw new ApiError(response.statusText, response.status);
        }
    }
    return response.json();
}

export async function fetchGet(url) {
    return request(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    });
}

export async function fetchPost(url, body) {
    return request(url, {
        body: JSON.stringify(body),
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    });

}

export async function fetchPut(url, body) {
    return request(url, {
        body: JSON.stringify(body),
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    });
}

const suggestionsTemplate = (match) => ({
    suggest: {
        navn_suggest: {
            prefix: match,
            completion: {
                field: 'navn_suggest',
                size: 10
            }
        }
    }
});

export async function fetchEmployerSuggestions(match) {
    const result = await fetchPost(`${SEARCH_API}underenhet/_search`, suggestionsTemplate(match));

    return {
        match,
        result: [
            ...result.suggest.navn_suggest[0].options.map((suggestion) => ({
                name: suggestion._source.navn,
                orgnr: suggestion._source.organisasjonsnummer,
                location: (suggestion._source.adresse ? {
                    address: suggestion._source.adresse.adresse,
                    postalCode: suggestion._source.adresse.postnummer,
                    city: suggestion._source.adresse.poststed
                } : undefined)
            })).sort()
        ]
    };
}

export async function fetchOrgnrSuggestions(match) {
    const result = await fetchGet(`${SEARCH_API}underenhet/_search?q=organisasjonsnummer:${match}*`);

    return {
        match,
        result: [
            ...result.hits.hits.map((employer) => ({
                name: employer._source.navn,
                orgnr: employer._source.organisasjonsnummer,
                location: (employer._source.adresse ? {
                    address: employer._source.adresse.adresse,
                    postalCode: employer._source.adresse.postnummer,
                    city: employer._source.adresse.poststed
                } : undefined)
            })).sort()
        ]
    };
}
