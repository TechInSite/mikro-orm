"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlEntityRepository = void 0;
const core_1 = require("@mikro-orm/core");
class SqlEntityRepository extends core_1.EntityRepository {
    constructor(_em, entityName) {
        super(_em, entityName);
        this._em = _em;
        this.entityName = entityName;
    }
    /**
     * Creates a QueryBuilder instance
     */
    createQueryBuilder(alias) {
        return this.em.createQueryBuilder(this.entityName, alias);
    }
    /**
     * Returns configured knex instance.
     */
    getKnex(type) {
        return this.em.getConnection(type).getKnex();
    }
    get em() {
        return this._em.getContext();
    }
}
exports.SqlEntityRepository = SqlEntityRepository;
