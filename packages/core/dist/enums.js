"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventType = exports.IsolationLevel = exports.LockMode = exports.LoadStrategy = exports.Cascade = exports.ReferenceType = exports.SCALAR_TYPES = exports.QueryFlag = exports.QueryOrderNumeric = exports.QueryOrder = exports.ARRAY_OPERATORS = exports.QueryOperator = exports.GroupOperator = void 0;
var GroupOperator;
(function (GroupOperator) {
    GroupOperator["$and"] = "and";
    GroupOperator["$or"] = "or";
})(GroupOperator = exports.GroupOperator || (exports.GroupOperator = {}));
var QueryOperator;
(function (QueryOperator) {
    QueryOperator["$eq"] = "=";
    QueryOperator["$in"] = "in";
    QueryOperator["$nin"] = "not in";
    QueryOperator["$gt"] = ">";
    QueryOperator["$gte"] = ">=";
    QueryOperator["$lt"] = "<";
    QueryOperator["$lte"] = "<=";
    QueryOperator["$ne"] = "!=";
    QueryOperator["$not"] = "not";
    QueryOperator["$like"] = "like";
    QueryOperator["$re"] = "regexp";
    QueryOperator["$ilike"] = "ilike";
    QueryOperator["$overlap"] = "&&";
    QueryOperator["$contains"] = "@>";
    QueryOperator["$contained"] = "<@";
})(QueryOperator = exports.QueryOperator || (exports.QueryOperator = {}));
exports.ARRAY_OPERATORS = ['$overlap', '$contains', '$contained'];
var QueryOrder;
(function (QueryOrder) {
    QueryOrder["ASC"] = "ASC";
    QueryOrder["ASC_NULLS_LAST"] = "ASC NULLS LAST";
    QueryOrder["ASC_NULLS_FIRST"] = "ASC NULLS FIRST";
    QueryOrder["DESC"] = "DESC";
    QueryOrder["DESC_NULLS_LAST"] = "DESC NULLS LAST";
    QueryOrder["DESC_NULLS_FIRST"] = "DESC NULLS FIRST";
    QueryOrder["asc"] = "asc";
    QueryOrder["asc_nulls_last"] = "asc nulls last";
    QueryOrder["asc_nulls_first"] = "asc nulls first";
    QueryOrder["desc"] = "desc";
    QueryOrder["desc_nulls_last"] = "desc nulls last";
    QueryOrder["desc_nulls_first"] = "desc nulls first";
})(QueryOrder = exports.QueryOrder || (exports.QueryOrder = {}));
var QueryOrderNumeric;
(function (QueryOrderNumeric) {
    QueryOrderNumeric[QueryOrderNumeric["ASC"] = 1] = "ASC";
    QueryOrderNumeric[QueryOrderNumeric["DESC"] = -1] = "DESC";
})(QueryOrderNumeric = exports.QueryOrderNumeric || (exports.QueryOrderNumeric = {}));
var QueryFlag;
(function (QueryFlag) {
    QueryFlag["DISTINCT"] = "DISTINCT";
    QueryFlag["PAGINATE"] = "PAGINATE";
    QueryFlag["UPDATE_SUB_QUERY"] = "UPDATE_SUB_QUERY";
    QueryFlag["DELETE_SUB_QUERY"] = "DELETE_SUB_QUERY";
    QueryFlag["CONVERT_CUSTOM_TYPES"] = "CONVERT_CUSTOM_TYPES";
    QueryFlag["INCLUDE_LAZY_FORMULAS"] = "INCLUDE_LAZY_FORMULAS";
    QueryFlag["AUTO_JOIN_ONE_TO_ONE_OWNER"] = "AUTO_JOIN_ONE_TO_ONE_OWNER";
})(QueryFlag = exports.QueryFlag || (exports.QueryFlag = {}));
exports.SCALAR_TYPES = ['string', 'number', 'boolean', 'Date', 'Buffer', 'RegExp'];
var ReferenceType;
(function (ReferenceType) {
    ReferenceType["SCALAR"] = "scalar";
    ReferenceType["ONE_TO_ONE"] = "1:1";
    ReferenceType["ONE_TO_MANY"] = "1:m";
    ReferenceType["MANY_TO_ONE"] = "m:1";
    ReferenceType["MANY_TO_MANY"] = "m:n";
    ReferenceType["EMBEDDED"] = "embedded";
})(ReferenceType = exports.ReferenceType || (exports.ReferenceType = {}));
var Cascade;
(function (Cascade) {
    Cascade["PERSIST"] = "persist";
    Cascade["MERGE"] = "merge";
    Cascade["REMOVE"] = "remove";
    Cascade["ALL"] = "all";
})(Cascade = exports.Cascade || (exports.Cascade = {}));
var LoadStrategy;
(function (LoadStrategy) {
    LoadStrategy["SELECT_IN"] = "select-in";
    LoadStrategy["JOINED"] = "joined";
})(LoadStrategy = exports.LoadStrategy || (exports.LoadStrategy = {}));
var LockMode;
(function (LockMode) {
    LockMode[LockMode["NONE"] = 0] = "NONE";
    LockMode[LockMode["OPTIMISTIC"] = 1] = "OPTIMISTIC";
    LockMode[LockMode["PESSIMISTIC_READ"] = 2] = "PESSIMISTIC_READ";
    LockMode[LockMode["PESSIMISTIC_WRITE"] = 3] = "PESSIMISTIC_WRITE";
    LockMode[LockMode["PESSIMISTIC_PARTIAL_WRITE"] = 4] = "PESSIMISTIC_PARTIAL_WRITE";
    LockMode[LockMode["PESSIMISTIC_WRITE_OR_FAIL"] = 5] = "PESSIMISTIC_WRITE_OR_FAIL";
    LockMode[LockMode["PESSIMISTIC_PARTIAL_READ"] = 6] = "PESSIMISTIC_PARTIAL_READ";
    LockMode[LockMode["PESSIMISTIC_READ_OR_FAIL"] = 7] = "PESSIMISTIC_READ_OR_FAIL";
})(LockMode = exports.LockMode || (exports.LockMode = {}));
var IsolationLevel;
(function (IsolationLevel) {
    IsolationLevel["READ_UNCOMMITTED"] = "read uncommitted";
    IsolationLevel["READ_COMMITTED"] = "read committed";
    IsolationLevel["SNAPSHOT"] = "snapshot";
    IsolationLevel["REPEATABLE_READ"] = "repeatable read";
    IsolationLevel["SERIALIZABLE"] = "serializable";
})(IsolationLevel = exports.IsolationLevel || (exports.IsolationLevel = {}));
var EventType;
(function (EventType) {
    EventType["onInit"] = "onInit";
    EventType["beforeCreate"] = "beforeCreate";
    EventType["afterCreate"] = "afterCreate";
    EventType["beforeUpdate"] = "beforeUpdate";
    EventType["afterUpdate"] = "afterUpdate";
    EventType["beforeDelete"] = "beforeDelete";
    EventType["afterDelete"] = "afterDelete";
    EventType["beforeFlush"] = "beforeFlush";
    EventType["onFlush"] = "onFlush";
    EventType["afterFlush"] = "afterFlush";
    EventType["beforeTransactionStart"] = "beforeTransactionStart";
    EventType["afterTransactionStart"] = "afterTransactionStart";
    EventType["beforeTransactionCommit"] = "beforeTransactionCommit";
    EventType["afterTransactionCommit"] = "afterTransactionCommit";
    EventType["beforeTransactionRollback"] = "beforeTransactionRollback";
    EventType["afterTransactionRollback"] = "afterTransactionRollback";
})(EventType = exports.EventType || (exports.EventType = {}));
