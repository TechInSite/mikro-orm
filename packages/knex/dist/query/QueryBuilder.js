"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
const core_1 = require("@mikro-orm/core");
const enums_1 = require("./enums");
const QueryBuilderHelper_1 = require("./QueryBuilderHelper");
const CriteriaNodeFactory_1 = require("./CriteriaNodeFactory");
/**
 * SQL query builder with fluent interface.
 *
 * ```ts
 * const qb = orm.em.createQueryBuilder(Publisher);
 * qb.select('*')
 *   .where({
 *     name: 'test 123',
 *     type: PublisherType.GLOBAL,
 *   })
 *   .orderBy({
 *     name: QueryOrder.DESC,
 *     type: QueryOrder.ASC,
 *   })
 *   .limit(2, 1);
 *
 * const publisher = await qb.getSingleResult();
 * ```
 */
class QueryBuilder {
    /**
     * @internal
     */
    constructor(entityName, metadata, driver, context, alias = `e0`, connectionType, em) {
        this.entityName = entityName;
        this.metadata = metadata;
        this.driver = driver;
        this.context = context;
        this.alias = alias;
        this.connectionType = connectionType;
        this.em = em;
        /** @internal */
        this._populate = [];
        /** @internal */
        this._populateMap = {};
        this.aliasCounter = 1;
        this.flags = new Set([core_1.QueryFlag.CONVERT_CUSTOM_TYPES]);
        this.finalized = false;
        this._joins = {};
        this._aliasMap = {};
        this._cond = {};
        this._orderBy = {};
        this._groupBy = [];
        this._having = {};
        this._joinedProps = new Map();
        this.subQueries = {};
        this.platform = this.driver.getPlatform();
        this.knex = this.driver.getConnection(this.connectionType).getKnex();
        this.helper = new QueryBuilderHelper_1.QueryBuilderHelper(this.entityName, this.alias, this._aliasMap, this.subQueries, this.metadata, this.knex, this.platform);
        this._aliasMap[this.alias] = this.entityName;
    }
    select(fields, distinct = false) {
        this._fields = core_1.Utils.asArray(fields);
        if (distinct) {
            this.flags.add(core_1.QueryFlag.DISTINCT);
        }
        return this.init(enums_1.QueryType.SELECT);
    }
    addSelect(fields) {
        if (this.type && this.type !== enums_1.QueryType.SELECT) {
            return this;
        }
        return this.select([...core_1.Utils.asArray(this._fields), ...core_1.Utils.asArray(fields)]);
    }
    insert(data) {
        return this.init(enums_1.QueryType.INSERT, data);
    }
    update(data) {
        return this.init(enums_1.QueryType.UPDATE, data);
    }
    delete(cond = {}) {
        return this.init(enums_1.QueryType.DELETE, undefined, cond);
    }
    truncate() {
        return this.init(enums_1.QueryType.TRUNCATE);
    }
    count(field, distinct = false) {
        this._fields = [...(field ? core_1.Utils.asArray(field) : this.metadata.find(this.entityName).primaryKeys)];
        if (distinct) {
            this.flags.add(core_1.QueryFlag.DISTINCT);
        }
        return this.init(enums_1.QueryType.COUNT);
    }
    join(field, alias, cond = {}, type = 'innerJoin', path) {
        this.joinReference(field, alias, cond, type, path);
        return this;
    }
    leftJoin(field, alias, cond = {}) {
        return this.join(field, alias, cond, 'leftJoin');
    }
    joinAndSelect(field, alias, cond = {}, type = 'innerJoin', path) {
        const prop = this.joinReference(field, alias, cond, type, path);
        this.addSelect(this.getFieldsForJoinedLoad(prop, alias));
        const [fromAlias] = this.helper.splitField(field);
        const populate = this._joinedProps.get(fromAlias);
        const item = { field: prop.name, strategy: core_1.LoadStrategy.JOINED, children: [] };
        if (populate) {
            populate.children.push(item);
        }
        else { // root entity
            this._populate.push(item);
        }
        this._joinedProps.set(alias, item);
        return this;
    }
    leftJoinAndSelect(field, alias, cond = {}) {
        return this.joinAndSelect(field, alias, cond, 'leftJoin');
    }
    getFieldsForJoinedLoad(prop, alias) {
        const fields = [];
        prop.targetMeta.props
            .filter(prop => this.driver.shouldHaveColumn(prop, this._populate))
            .forEach(prop => fields.push(...this.driver.mapPropToFieldNames(this, prop, alias)));
        return fields;
    }
    withSubQuery(subQuery, alias) {
        this.subQueries[alias] = subQuery.toString();
        return this;
    }
    where(cond, params, operator) {
        if (core_1.Utils.isString(cond)) {
            cond = { [`(${cond})`]: core_1.Utils.asArray(params) };
            operator = operator || '$and';
        }
        else {
            cond = core_1.QueryHelper.processWhere(cond, this.entityName, this.metadata, this.platform, this.flags.has(core_1.QueryFlag.CONVERT_CUSTOM_TYPES));
        }
        const op = operator || params;
        const topLevel = !op || !core_1.Utils.hasObjectKeys(this._cond);
        const criteriaNode = CriteriaNodeFactory_1.CriteriaNodeFactory.createNode(this.metadata, this.entityName, cond);
        if ([enums_1.QueryType.UPDATE, enums_1.QueryType.DELETE].includes(this.type) && criteriaNode.willAutoJoin(this)) {
            // use sub-query to support joining
            this.setFlag(this.type === enums_1.QueryType.UPDATE ? core_1.QueryFlag.UPDATE_SUB_QUERY : core_1.QueryFlag.DELETE_SUB_QUERY);
            this.select(this.metadata.find(this.entityName).primaryKeys, true);
        }
        if (topLevel) {
            this._cond = criteriaNode.process(this);
        }
        else if (Array.isArray(this._cond[op])) {
            this._cond[op].push(criteriaNode.process(this));
        }
        else {
            const cond1 = [this._cond, criteriaNode.process(this)];
            this._cond = { [op]: cond1 };
        }
        if (this._onConflict) {
            this._onConflict[this._onConflict.length - 1].where = this._cond;
            this._cond = {};
        }
        return this;
    }
    andWhere(cond, params) {
        return this.where(cond, params, '$and');
    }
    orWhere(cond, params) {
        return this.where(cond, params, '$or');
    }
    orderBy(orderBy) {
        const processed = core_1.QueryHelper.processWhere(orderBy, this.entityName, this.metadata, this.platform, false);
        this._orderBy = CriteriaNodeFactory_1.CriteriaNodeFactory.createNode(this.metadata, this.entityName, processed).process(this);
        return this;
    }
    groupBy(fields) {
        this._groupBy = core_1.Utils.asArray(fields);
        return this;
    }
    having(cond = {}, params) {
        if (core_1.Utils.isString(cond)) {
            cond = { [`(${cond})`]: core_1.Utils.asArray(params) };
        }
        this._having = CriteriaNodeFactory_1.CriteriaNodeFactory.createNode(this.metadata, this.entityName, cond).process(this);
        return this;
    }
    onConflict(fields = []) {
        this._onConflict = this._onConflict || [];
        this._onConflict.push({ fields: core_1.Utils.asArray(fields) });
        return this;
    }
    ignore() {
        if (!this._onConflict) {
            throw new Error('You need to call `qb.onConflict()` first to use `qb.ignore()`');
        }
        this._onConflict[this._onConflict.length - 1].ignore = true;
        return this;
    }
    merge(data) {
        if (!this._onConflict) {
            throw new Error('You need to call `qb.onConflict()` first to use `qb.merge()`');
        }
        this._onConflict[this._onConflict.length - 1].merge = data;
        return this;
    }
    /**
     * @internal
     */
    populate(populate) {
        this._populate = populate;
        return this;
    }
    /**
     * @internal
     */
    ref(field) {
        return this.knex.ref(field);
    }
    raw(sql, bindings = []) {
        const raw = this.knex.raw(sql, bindings);
        raw.__raw = true; // tag it as there is now way to check via `instanceof`
        return raw;
    }
    limit(limit, offset = 0) {
        this._limit = limit;
        if (offset) {
            this.offset(offset);
        }
        return this;
    }
    offset(offset) {
        this._offset = offset;
        return this;
    }
    withSchema(schema) {
        this._schema = schema;
        return this;
    }
    setLockMode(mode, tables) {
        if (mode != null && mode !== core_1.LockMode.OPTIMISTIC && !this.context) {
            throw core_1.ValidationError.transactionRequired();
        }
        this.lockMode = mode;
        this.lockTables = tables;
        return this;
    }
    setFlag(flag) {
        this.flags.add(flag);
        return this;
    }
    unsetFlag(flag) {
        this.flags.delete(flag);
        return this;
    }
    cache(config = true) {
        this._cache = config;
        return this;
    }
    /**
     * Adds index hint to the FROM clause.
     */
    indexHint(sql) {
        this._indexHint = sql;
        return this;
    }
    getKnexQuery() {
        this.finalize();
        const qb = this.getQueryBase();
        core_1.Utils.runIfNotEmpty(() => this.helper.appendQueryCondition(this.type, this._cond, qb), this._cond && !this._onConflict);
        core_1.Utils.runIfNotEmpty(() => qb.groupBy(this.prepareFields(this._groupBy, 'groupBy')), this._groupBy);
        core_1.Utils.runIfNotEmpty(() => this.helper.appendQueryCondition(this.type, this._having, qb, undefined, 'having'), this._having);
        core_1.Utils.runIfNotEmpty(() => qb.orderByRaw(this.helper.getQueryOrder(this.type, this._orderBy, this._populateMap)), this._orderBy);
        core_1.Utils.runIfNotEmpty(() => qb.limit(this._limit), this._limit);
        core_1.Utils.runIfNotEmpty(() => qb.offset(this._offset), this._offset);
        core_1.Utils.runIfNotEmpty(() => {
            this._onConflict.forEach(item => {
                const sub = qb.onConflict(item.fields);
                core_1.Utils.runIfNotEmpty(() => sub.ignore(), item.ignore);
                core_1.Utils.runIfNotEmpty(() => {
                    const sub2 = sub.merge(item.merge);
                    core_1.Utils.runIfNotEmpty(() => this.helper.appendQueryCondition(this.type, item.where, sub2), item.where);
                }, 'merge' in item);
            });
        }, this._onConflict);
        if (this.type === enums_1.QueryType.TRUNCATE && this.platform.usesCascadeStatement()) {
            return this.knex.raw(qb.toSQL().toNative().sql + ' cascade');
        }
        if (this.lockMode) {
            this.helper.getLockSQL(qb, this.lockMode, this.lockTables);
        }
        this.helper.finalize(this.type, qb, this.metadata.find(this.entityName));
        return qb;
    }
    /**
     * Returns the query with parameters as wildcards.
     */
    getQuery() {
        return this.getKnexQuery().toSQL().toNative().sql;
    }
    /**
     * Returns the list of all parameters for this query.
     */
    getParams() {
        return this.getKnexQuery().toSQL().toNative().bindings;
    }
    /**
     * Returns raw interpolated query string with all the parameters inlined.
     */
    getFormattedQuery() {
        const query = this.getKnexQuery().toSQL();
        return this.platform.formatQuery(query.sql, query.bindings);
    }
    getAliasForJoinPath(path) {
        if (!path || path === this.entityName) {
            return this.alias;
        }
        const join = Object.values(this._joins).find(j => j.path === path);
        if (path.endsWith('[pivot]') && join) {
            return join.alias;
        }
        /* istanbul ignore next */
        return (join === null || join === void 0 ? void 0 : join.inverseAlias) || (join === null || join === void 0 ? void 0 : join.alias);
    }
    getNextAlias(prefix = 'e') {
        // Take only the first letter of the prefix to keep character counts down since some engines have character limits
        return `${prefix.charAt(0).toLowerCase()}${this.aliasCounter++}`;
    }
    /**
     * Executes this QB and returns the raw results, mapped to the property names (unless disabled via last parameter).
     * Use `method` to specify what kind of result you want to get (array/single/meta).
     */
    async execute(method = 'all', mapResults = true) {
        var _a, _b, _c, _d;
        if (!this.connectionType && method !== 'run' && [enums_1.QueryType.INSERT, enums_1.QueryType.UPDATE, enums_1.QueryType.DELETE, enums_1.QueryType.TRUNCATE].includes(this.type)) {
            this.connectionType = 'write';
        }
        const query = this.getKnexQuery().toSQL();
        const cached = await ((_a = this.em) === null || _a === void 0 ? void 0 : _a.tryCache(this.entityName, this._cache, ['qb.execute', query.sql, query.bindings, method]));
        if (cached === null || cached === void 0 ? void 0 : cached.data) {
            return cached.data;
        }
        const type = this.connectionType || (method === 'run' ? 'write' : 'read');
        const res = await this.driver.getConnection(type).execute(query.sql, query.bindings, method, this.context);
        const meta = this.metadata.find(this.entityName);
        if (!mapResults || !meta) {
            await ((_b = this.em) === null || _b === void 0 ? void 0 : _b.storeCache(this._cache, cached, res));
            return res;
        }
        if (method === 'all' && Array.isArray(res)) {
            const map = {};
            const mapped = res.map(r => this.driver.mapResult(r, meta, this._populate, this, map));
            await ((_c = this.em) === null || _c === void 0 ? void 0 : _c.storeCache(this._cache, cached, mapped));
            return mapped;
        }
        const mapped = this.driver.mapResult(res, meta, this._populate, this);
        /* istanbul ignore next */
        await ((_d = this.em) === null || _d === void 0 ? void 0 : _d.storeCache(this._cache, cached, mapped));
        return mapped;
    }
    /**
     * Alias for `qb.getResultList()`
     */
    async getResult() {
        return this.getResultList();
    }
    /**
     * Executes the query, returning array of results
     */
    async getResultList() {
        let res = await this.execute('all', true);
        if (this._joinedProps.size > 0) {
            res = this.driver.mergeJoinedResult(res, this.metadata.find(this.entityName));
        }
        return res.map(r => this.em.map(this.entityName, r));
    }
    /**
     * Executes the query, returning the first result or null
     */
    async getSingleResult() {
        const res = await this.getResultList();
        return res[0] || null;
    }
    /**
     * Returns knex instance with sub-query aliased with given alias.
     * You can provide `EntityName.propName` as alias, then the field name will be used based on the metadata
     */
    as(alias) {
        var _a;
        const qb = this.getKnexQuery();
        if (alias.includes('.')) {
            const [a, f] = alias.split('.');
            const meta = this.metadata.find(a);
            /* istanbul ignore next */
            alias = ((_a = meta === null || meta === void 0 ? void 0 : meta.properties[f]) === null || _a === void 0 ? void 0 : _a.fieldNames[0]) || alias;
        }
        return qb.as(alias);
    }
    clone() {
        const qb = new QueryBuilder(this.entityName, this.metadata, this.driver, this.context, this.alias, this.connectionType, this.em);
        Object.assign(qb, this);
        // clone array/object properties
        const properties = [
            'flags', '_populate', '_populateMap', '_joins', '_joinedProps', '_aliasMap', '_cond', '_data', '_orderBy',
            '_schema', '_indexHint', '_cache', 'subQueries', 'lockMode', 'lockTables',
        ];
        properties.forEach(prop => qb[prop] = core_1.Utils.copy(this[prop]));
        /* istanbul ignore else */
        if (this._fields) {
            qb._fields = [...this._fields];
        }
        qb.finalized = false;
        return qb;
    }
    getKnex() {
        const tableName = this.helper.getTableName(this.entityName) + (this.finalized && this.helper.isTableNameAliasRequired(this.type) ? ` as ${this.alias}` : '');
        const qb = this.knex(tableName);
        if (this.context) {
            qb.transacting(this.context);
        }
        return qb;
    }
    joinReference(field, alias, cond, type, path) {
        var _a, _b;
        const [fromAlias, fromField] = this.helper.splitField(field);
        const entityName = this._aliasMap[fromAlias];
        const meta = this.metadata.get(entityName);
        const prop = meta.properties[fromField];
        if (!prop) {
            throw new Error(`Trying to join ${field}, but ${fromField} is not a defined relation on ${meta.className}`);
        }
        this._aliasMap[alias] = prop.type;
        cond = core_1.QueryHelper.processWhere(cond, this.entityName, this.metadata, this.platform);
        const aliasedName = `${fromAlias}.${prop.name}`;
        path = path !== null && path !== void 0 ? path : `${((_b = (_a = Object.values(this._joins).find(j => j.alias === fromAlias)) === null || _a === void 0 ? void 0 : _a.path) !== null && _b !== void 0 ? _b : entityName)}.${prop.name}`;
        if (prop.reference === core_1.ReferenceType.ONE_TO_MANY) {
            this._joins[aliasedName] = this.helper.joinOneToReference(prop, fromAlias, alias, type, cond);
        }
        else if (prop.reference === core_1.ReferenceType.MANY_TO_MANY) {
            let pivotAlias = alias;
            if (type !== 'pivotJoin') {
                const oldPivotAlias = this.getAliasForJoinPath(path + '[pivot]');
                pivotAlias = oldPivotAlias !== null && oldPivotAlias !== void 0 ? oldPivotAlias : `e${this.aliasCounter++}`;
            }
            const joins = this.helper.joinManyToManyReference(prop, fromAlias, alias, pivotAlias, type, cond, path);
            Object.assign(this._joins, joins);
            this._aliasMap[pivotAlias] = prop.pivotTable;
        }
        else if (prop.reference === core_1.ReferenceType.ONE_TO_ONE) {
            this._joins[aliasedName] = this.helper.joinOneToReference(prop, fromAlias, alias, type, cond);
        }
        else { // MANY_TO_ONE
            this._joins[aliasedName] = this.helper.joinManyToOneReference(prop, fromAlias, alias, type, cond);
        }
        if (!this._joins[aliasedName].path && path) {
            this._joins[aliasedName].path = path;
        }
        return prop;
    }
    prepareFields(fields, type = 'where') {
        const ret = [];
        fields.forEach(f => {
            if (!core_1.Utils.isString(f)) {
                return ret.push(f);
            }
            if (this._joins[f] && type === 'where') {
                return ret.push(...this.helper.mapJoinColumns(this.type, this._joins[f]));
            }
            ret.push(this.helper.mapper(f, this.type));
        });
        const meta = this.metadata.find(this.entityName);
        /* istanbul ignore next */
        const requiresSQLConversion = ((meta === null || meta === void 0 ? void 0 : meta.props) || []).filter(p => { var _a; return (_a = p.customType) === null || _a === void 0 ? void 0 : _a.convertToJSValueSQL; });
        if (this.flags.has(core_1.QueryFlag.CONVERT_CUSTOM_TYPES) && (fields.includes('*') || fields.includes(`${this.alias}.*`)) && requiresSQLConversion.length > 0) {
            requiresSQLConversion.forEach(p => ret.push(this.helper.mapper(p.name, this.type)));
        }
        Object.keys(this._populateMap).forEach(f => {
            if (!fields.includes(f) && type === 'where') {
                ret.push(...this.helper.mapJoinColumns(this.type, this._joins[f]));
            }
            if (this._joins[f].prop.reference !== core_1.ReferenceType.ONE_TO_ONE && this._joins[f].inverseJoinColumns) {
                this._joins[f].inverseJoinColumns.forEach(inverseJoinColumn => {
                    core_1.Utils.renameKey(this._cond, inverseJoinColumn, `${this._joins[f].alias}.${inverseJoinColumn}`);
                });
            }
        });
        return ret;
    }
    init(type, data, cond) {
        this.type = type;
        this._aliasMap[this.alias] = this.entityName;
        if (!this.helper.isTableNameAliasRequired(type)) {
            delete this._fields;
        }
        if (data) {
            this._data = this.helper.processData(data, this.flags.has(core_1.QueryFlag.CONVERT_CUSTOM_TYPES));
        }
        if (cond) {
            this.where(cond);
        }
        return this;
    }
    getQueryBase() {
        const qb = this.getKnex();
        if (this._schema) {
            qb.withSchema(this._schema);
        }
        if (this._indexHint) {
            const alias = this.helper.isTableNameAliasRequired(this.type) ? ` as ${this.platform.quoteIdentifier(this.alias)}` : '';
            const schema = this._schema ? this.platform.quoteIdentifier(this._schema) + '.' : '';
            const tableName = schema + this.platform.quoteIdentifier(this.helper.getTableName(this.entityName)) + alias;
            qb.from(this.knex.raw(`${tableName} ${this._indexHint}`));
        }
        switch (this.type) {
            case enums_1.QueryType.SELECT:
                qb.select(this.prepareFields(this._fields));
                if (this.flags.has(core_1.QueryFlag.DISTINCT)) {
                    qb.distinct();
                }
                this.helper.processJoins(qb, this._joins);
                break;
            case enums_1.QueryType.COUNT: {
                const m = this.flags.has(core_1.QueryFlag.DISTINCT) ? 'countDistinct' : 'count';
                qb[m]({ count: this._fields.map(f => this.helper.mapper(f, this.type)) });
                this.helper.processJoins(qb, this._joins);
                break;
            }
            case enums_1.QueryType.INSERT:
                qb.insert(this._data);
                break;
            case enums_1.QueryType.UPDATE:
                qb.update(this._data);
                this.helper.updateVersionProperty(qb, this._data);
                break;
            case enums_1.QueryType.DELETE:
                qb.delete();
                break;
            case enums_1.QueryType.TRUNCATE:
                qb.truncate();
                break;
        }
        return qb;
    }
    finalize() {
        var _a, _b;
        if (this.finalized) {
            return;
        }
        if (!this.type) {
            this.select('*');
        }
        const meta = this.metadata.find(this.entityName);
        if (meta && this.flags.has(core_1.QueryFlag.AUTO_JOIN_ONE_TO_ONE_OWNER)) {
            const relationsToPopulate = this._populate.map(({ field }) => field);
            meta.relations
                .filter(prop => prop.reference === core_1.ReferenceType.ONE_TO_ONE && !prop.owner && !relationsToPopulate.includes(prop.name))
                .map(prop => ({ field: prop.name }))
                .forEach(item => this._populate.push(item));
        }
        this._populate.forEach(({ field }) => {
            var _a;
            const [fromAlias, fromField] = this.helper.splitField(field);
            const aliasedField = `${fromAlias}.${fromField}`;
            if (this._joins[aliasedField] && this.helper.isOneToOneInverse(field)) {
                return this._populateMap[aliasedField] = this._joins[aliasedField].alias;
            }
            if ((_a = this.metadata.find(field)) === null || _a === void 0 ? void 0 : _a.pivotTable) { // pivot table entity
                this.autoJoinPivotTable(field);
            }
            else if (meta && this.helper.isOneToOneInverse(field)) {
                const prop = meta.properties[field];
                this._joins[prop.name] = this.helper.joinOneToReference(prop, this.alias, `e${this.aliasCounter++}`, 'leftJoin');
                this._populateMap[field] = this._joins[field].alias;
            }
        });
        if (meta && (((_a = this._fields) === null || _a === void 0 ? void 0 : _a.includes('*')) || ((_b = this._fields) === null || _b === void 0 ? void 0 : _b.includes(`${this.alias}.*`)))) {
            meta.props
                .filter(prop => prop.formula && (!prop.lazy || this.flags.has(core_1.QueryFlag.INCLUDE_LAZY_FORMULAS)))
                .map(prop => {
                const alias = this.knex.ref(this.alias).toString();
                const aliased = this.knex.ref(prop.fieldNames[0]).toString();
                return `${prop.formula(alias)} as ${aliased}`;
            })
                .filter(field => !this._fields.includes(field))
                .forEach(field => this.addSelect(field));
        }
        core_1.QueryHelper.processObjectParams(this._data);
        core_1.QueryHelper.processObjectParams(this._cond);
        core_1.QueryHelper.processObjectParams(this._having);
        this.finalized = true;
        if (meta && this.flags.has(core_1.QueryFlag.PAGINATE) && this._limit > 0) {
            this.wrapPaginateSubQuery(meta);
        }
        if (meta && (this.flags.has(core_1.QueryFlag.UPDATE_SUB_QUERY) || this.flags.has(core_1.QueryFlag.DELETE_SUB_QUERY))) {
            this.wrapModifySubQuery(meta);
        }
    }
    wrapPaginateSubQuery(meta) {
        const pks = this.prepareFields(meta.primaryKeys, 'sub-query');
        const subQuery = this.clone().limit(undefined).offset(undefined);
        subQuery.finalized = true;
        const knexQuery = subQuery.as(this.alias).clearSelect().select(pks);
        // 3 sub-queries are needed to get around mysql limitations with order by + limit + where in + group by (o.O)
        // https://stackoverflow.com/questions/17892762/mysql-this-version-of-mysql-doesnt-yet-support-limit-in-all-any-some-subqu
        const subSubQuery = this.getKnex().select(pks).from(knexQuery).groupBy(pks).limit(this._limit);
        if (this._offset) {
            subSubQuery.offset(this._offset);
        }
        const subSubSubQuery = this.getKnex().select(pks).from(subSubQuery.as(this.alias));
        this._limit = undefined;
        this._offset = undefined;
        this.select(this._fields).where({ [core_1.Utils.getPrimaryKeyHash(meta.primaryKeys)]: { $in: subSubSubQuery } });
    }
    wrapModifySubQuery(meta) {
        const subQuery = this.clone();
        subQuery.finalized = true;
        // wrap one more time to get around MySQL limitations
        // https://stackoverflow.com/questions/45494/mysql-error-1093-cant-specify-target-table-for-update-in-from-clause
        const subSubQuery = this.getKnex().select(this.prepareFields(meta.primaryKeys)).from(subQuery.as(this.alias));
        const method = this.flags.has(core_1.QueryFlag.UPDATE_SUB_QUERY) ? 'update' : 'delete';
        this[method](this._data).where({
            [core_1.Utils.getPrimaryKeyHash(meta.primaryKeys)]: { $in: subSubQuery },
        });
    }
    autoJoinPivotTable(field) {
        const pivotMeta = this.metadata.find(field);
        const owner = pivotMeta.props.find(prop => prop.reference === core_1.ReferenceType.MANY_TO_ONE && prop.owner);
        const inverse = pivotMeta.props.find(prop => prop.reference === core_1.ReferenceType.MANY_TO_ONE && !prop.owner);
        const prop = this._cond[pivotMeta.name + '.' + owner.name] || this._orderBy[pivotMeta.name + '.' + owner.name] ? inverse : owner;
        const pivotAlias = this.getNextAlias();
        this._joins[field] = this.helper.joinPivotTable(field, prop, this.alias, pivotAlias, 'leftJoin');
        core_1.Utils.renameKey(this._cond, `${field}.${owner.name}`, core_1.Utils.getPrimaryKeyHash(owner.fieldNames.map(fieldName => `${pivotAlias}.${fieldName}`)));
        core_1.Utils.renameKey(this._cond, `${field}.${inverse.name}`, core_1.Utils.getPrimaryKeyHash(inverse.fieldNames.map(fieldName => `${pivotAlias}.${fieldName}`)));
        this._populateMap[field] = this._joins[field].alias;
    }
}
exports.QueryBuilder = QueryBuilder;
