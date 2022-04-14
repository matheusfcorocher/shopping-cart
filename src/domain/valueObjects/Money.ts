import DineroFactory, { Dinero as Money} from 'dinero.js';

const createMoney = (amount: number) => {
    return DineroFactory({amount})
};

export { Money, createMoney };