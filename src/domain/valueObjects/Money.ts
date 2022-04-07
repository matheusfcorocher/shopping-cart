import DineroFactory, { Dinero as Money} from 'dinero.js';
import {Mathmatic} from '../../lib/Mathematic';

const createMoney = (amount: number) => {
    return DineroFactory({amount})
};

export { Money, createMoney };