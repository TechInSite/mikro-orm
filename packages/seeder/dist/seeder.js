"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seeder = void 0;
class Seeder {
    call(em, seeders) {
        return new Promise((resolve, reject) => {
            Promise.all(seeders.map(s => {
                return (new s()).run(em.fork());
            })).then(() => resolve()).catch(reject);
        });
    }
}
exports.Seeder = Seeder;
