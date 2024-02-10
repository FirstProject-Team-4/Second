import { createContext } from "react";

interface User {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
}

interface Admin {
    firstName: string;
    lastName: string;
    email: string;
}

export const AppContext = createContext({
    user: null,
    userData: null,
    adminData: null,
    setContext: () => { },
    validateUser: (user: User) => {
        if (!user) return false;
        const { firstName, lastName, email, username } = user;
        return firstName.length >= 4 && firstName.length <= 32 &&
                     lastName.length >= 4 && lastName.length <= 32 &&
                     email.includes('@') && (email !== username);
    },
    validateAdmin: (admin: Admin) => {
        if (!admin) return false;
        const { firstName, lastName, email } = admin;
        return firstName.length >= 4 && firstName.length <= 32 &&
                     lastName.length >= 4 && lastName.length <= 32 &&
                     email.includes('@');
    },
});