export interface Error {
    name: string;
}

export function Error(): Error {
    return {
        name: "",
    }
}