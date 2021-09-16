"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abort_controller_1 = __importDefault(require("abort-controller"));
const node_fetch_1 = __importDefault(require("node-fetch"));
class Clash {
    constructor(token) {
        this.token = token;
    }
    async request(endpoint) {
        if (!this.token)
            throw new Error("No token was provided");
        const controller = new abort_controller_1.default();
        setTimeout(() => {
            controller.abort();
        }, 1000);
        try {
            const response = await node_fetch_1.default(endpoint, {
                headers: {
                    auth: this.token,
                },
                signal: controller.signal,
            });
            return response.json();
        }
        catch (err) {
            if (controller.signal.aborted)
                throw new Error("The client aborted a request");
            else
                throw new Error("Couldn't request\n" + err);
        }
    }
}
exports.default = Clash;
