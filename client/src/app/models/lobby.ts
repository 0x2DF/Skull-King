export interface Lobby {
    code: string;
    clients: string[];
    state: string;
    admin: string;
}

export function Lobby(): Lobby {
    return {
        code: "",
        clients: <string[]>([]),
        state: "",
        admin: "",
    }
}