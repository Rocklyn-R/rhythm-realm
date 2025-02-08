import { BASE_URL } from "./addressBook";

export const createNewUser = async (name: string, lastName: string, email: string, password: string) => {
    try {
        const response = await fetch(`${BASE_URL}/user/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                first_name: name,
                last_name: lastName,
                email: email.toLowerCase(),
                password,
            }),
            credentials: 'include'
        });
        const responseData = await response.json();

        if (response.ok) {
            return { user: responseData.user };
        } else {
            if (responseData && responseData.message === 'Failed to create user') {
                return { error: 'User with this email already exists' };
            } else {
                return { error: 'An error occurred', details: responseData };
            }
        }
    } catch (error: any) {
        return { error: 'An error occurred', details: error.message };
    }
}

export const signInUser = async (email: string, password: string) => {
    try {
        const response = await fetch(`${BASE_URL}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
            credentials: 'include'
        });
        const responseData = await response.json();

        if (!response.ok) {
            return { error: "Incorrect email or password" }
        }
        return { user: responseData.user };
    } catch (error: any) {
        return { error: "Incorrect email or password" }
    }
}

export const checkAuthentication = async () => {
    try {
        const response = await fetch(`${BASE_URL}/user/auth`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        const data = await response.json();
        if (response.status === 401) {
            return { error: 'Error authenticating user' };
        } else if (response.status === 200 && data.message === 'User not signed in') {
            return { error: 'User not signed in' };
        } else return { user: data.user };

    } catch (error: any) {
        return { error: 'User not signed in ' }
    }
}

export const logoutUser = async () => {
    try {
        const response = await fetch(`${BASE_URL}/user/logout`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        return response.status;

    } catch (error: any) {
        return { error: error }
    }
}

export const updateUserName = async (first_name: string, last_name: string) => {
    try {
        const response = await fetch(`${BASE_URL}/user/user-name`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                first_name,
                last_name,
            }),
            credentials: 'include'
        });
        
        if (response.ok) {
            return true;
        }
    } catch (error: any) {

        throw error;
    }
}

export const updateUserEmail = async (email: string) => {
    try {
        const response = await fetch(`${BASE_URL}/user/email`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email
            }),
            credentials: 'include'
        });
        if (response.ok) {
            return true;
        }
    } catch (error: any) {
        throw error;
    }
}

export const updateUserPassword = async (oldPassword: string, newPassword: string) => {
    try {
        const response = await fetch(`${BASE_URL}/user/update-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ oldPassword, newPassword })
        })

        const data = await response.json();
        console.log(data.message);

        if (response.ok) {
            //console.log('Success');
            return 'Success';
        } else if (!response.ok && data.message === 'Old password incorrect') {
            return 'Old password incorrect';
        } else {
            throw new Error('Failed to update user email')
        }
    } catch (error) {
        console.log(error)
    }
}

export const checkForUserEmail = async (email: string) => {
    try {
        const response = await fetch(`${BASE_URL}/user/reset-password/email-check?email=${email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        const data = await response.json();
        return data.message;
    } catch (error) {
        console.error(error);
    }
}

export const sendResetEmail = async (email: string) => {
    try {
    const response = await fetch(`${BASE_URL}/user/send-reset-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });
    if (response.ok) {
        return true;
    }
    } catch (error) {
        console.error(error)
    }
};

export const checkToken = async (token: string) => {
    try {
        const response = await fetch(`${BASE_URL}/user/reset-password/check-token?token=${token}`);
        const data = await response.json();
        console.log(data);
        return data;
        } catch (error) {
            console.error(error)
        }
}

export const createNewPasswordWithToken = async (password: string, user_id: string) => {
    try {
        const response = await fetch(`${BASE_URL}/user/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password, user_id }),
        });
        if (response.ok) {
            return true;
        }
        } catch (error) {
            console.log(error);
            console.error(error)
        }
}