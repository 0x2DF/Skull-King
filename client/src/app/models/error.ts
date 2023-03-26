export interface Error {
    name: string;
    description: string;
}

export function Error(): Error {
    return {
        name: "",
        description: "",
    }
}