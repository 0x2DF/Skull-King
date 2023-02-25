export interface User {
    handle: string;
}

export function User(): User {
    return {
        handle: "",
    }
}