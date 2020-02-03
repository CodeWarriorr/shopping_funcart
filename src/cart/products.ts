
export interface Price {
    value: string,
    currency: string,
}

export interface Product {
    id: number,
    name: string,
    description: string,
    price: Price,
    quantity: number
    total: Price | undefined,
}

const products = [
    {
        id: 1,
        name: 'Big Sword',
        description: 'Perfect weapon for future dragon slayer',
        price: {
            value: '130',
            currency: 'EUR',
        },
        quantity: 1,
        total: undefined,
    },
    {
        id: 2,
        name: 'Magic Hat',
        description: 'It does exactly nothing, but you will look cool',
        price: {
            value: '20',
            currency: 'EUR',
        },
        quantity: 10,
        total: undefined,
    },
    {
        id: 3,
        name: 'Black Jack Jacket',
        description: 'Easy +5 to win in any casino',
        price: {
            value: '1569',
            currency: 'EUR',
        },
        quantity: 10,
        total: undefined,
    },
    {
        id: 4,
        name: 'Unidentified Object',
        description: 'Nobody knows whats inside, it might be nothing',
        price: {
            value: '1.25',
            currency: 'EUR',
        },
        quantity: 50,
        total: undefined,
    },
];

export const findById = (productId: number): Product | undefined => products.find(ele => ele.id === productId);
