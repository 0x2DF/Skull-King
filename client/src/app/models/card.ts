export interface Card {
    id: number;
    name: string;
    rank: number;
    value: number;
    type: string;
    valid: boolean;
}

export function Card(): Card {
    return {
        id: 0,
        name: "",
        rank: 0,
        value: 0,
        type: "",
        valid: false,
    }
}