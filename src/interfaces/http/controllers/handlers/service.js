"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutHandler = void 0;
const checkoutHandler = async (req, reply) => {
    try {
        const { checkoutDomainService } = req.container.services;
        const result = await checkoutDomainService.execute(req.body);
        reply.send(result);
    }
    catch (error) {
        switch (error.CODE) {
            default:
                const { message, details } = error;
                return reply.status(500).send({ message, details });
        }
    }
};
exports.checkoutHandler = checkoutHandler;
