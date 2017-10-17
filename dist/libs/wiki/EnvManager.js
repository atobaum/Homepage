"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class EnvManager {
    constructor() {
        this.envList = new Map();
    }
    addEnv(env) {
        this.envList.set(env.key, env);
    }
    afterScan() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(Array.from(this.envList.values()).map(env => env.afterScan())).catch(e => {
                throw e;
            });
        });
    }
    makeToken(key, argv) {
        return this.envList.get(key).makeToken(argv);
    }
}
exports.EnvManager = EnvManager;
