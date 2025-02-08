import axios from 'axios';
import { Cart } from '../types/types';
import { BASE_URL } from './addressBook';

export const fetchStateByZipCode = async (zipCode: string) => {
    try {
        const response = await axios.get(`https://api.zippopotam.us/us/${zipCode}`);
        const state = response.data.places[0]['state abbreviation'];
        return state;
    } catch (error) {
        return null;
    }
}

export const addToCart = async (product_id: number, variant_id: number, quantity: number) => {
    try {
        const response = await fetch(`${BASE_URL}/cart/add-to-cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ product_id, variant_id, quantity })
        });
    
        return response.ok;

    } catch (error) {
        throw error;
    }
}

export const removeFromCart = async (product_id: number, variant_id: number) => {
    try {
        const response = await fetch(`${BASE_URL}/cart/remove-from-cart`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ product_id, variant_id })
        });
        return response.ok;
    } catch (error) {
        throw error;
    }
}

export const getItemsFromCart = async () => {
    try {
        const response = await fetch(`${BASE_URL}/cart/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        }
    } catch (error) {
        throw error;
    }
}

export const replaceCart = async (cart: Cart[]) => {
    try {
        const response = await fetch(`${BASE_URL}/cart/replace-cart`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ cart })
        });
        return response.ok;
    } catch (error) {
        throw error;
    }
}

export const insertMultipleIntoCart = async (cart: Cart[]) => {
    try {
        const response = await fetch(`${BASE_URL}/cart/insert-multiple`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ cart })
        });
        return response.ok;
    } catch (error) {
        throw error;
    }
}

export const deleteCart = async () => {
    try {
        const response = await fetch(`${BASE_URL}/cart/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        return response.ok;
    } catch (error) {
        console.log(error);
        throw error;
    }
}