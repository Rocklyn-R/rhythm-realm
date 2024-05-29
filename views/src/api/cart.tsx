import axios from 'axios';

export const fetchStateByZipCode = async (zipCode: string) => {
    try {
        const response = await axios.get(`https://api.zippopotam.us/us/${zipCode}`);
        const state = response.data.places[0]['state abbreviation'];
        return state;
    } catch (error) {
        return null;
    }
}