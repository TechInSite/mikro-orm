"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlainObject = exports.EntityRepositoryType = exports.EntityMetadata = exports.PrimaryKeyProp = exports.PrimaryKeyType = void 0;
/**
 * @packageDocumentation
 * @module core
 */
/* istanbul ignore file */
var typings_1 = require("./typings");
Object.defineProperty(exports, "PrimaryKeyType", { enumerable: true, get: function () { return typings_1.PrimaryKeyType; } });
Object.defineProperty(exports, "PrimaryKeyProp", { enumerable: true, get: function () { return typings_1.PrimaryKeyProp; } });
Object.defineProperty(exports, "EntityMetadata", { enumerable: true, get: function () { return typings_1.EntityMetadata; } });
Object.defineProperty(exports, "EntityRepositoryType", { enumerable: true, get: function () { return typings_1.EntityRepositoryType; } });
Object.defineProperty(exports, "PlainObject", { enumerable: true, get: function () { return typings_1.PlainObject; } });
__exportStar(require("./enums"), exports);
__exportStar(require("./errors"), exports);
__exportStar(require("./exceptions"), exports);
__exportStar(require("./MikroORM"), exports);
__exportStar(require("./entity"), exports);
__exportStar(require("./events"), exports);
__exportStar(require("./EntityManager"), exports);
__exportStar(require("./unit-of-work"), exports);
__exportStar(require("./utils"), exports);
__exportStar(require("./hydration"), exports);
__exportStar(require("./drivers"), exports);
__exportStar(require("./connections"), exports);
__exportStar(require("./platforms"), exports);
__exportStar(require("./types"), exports);
__exportStar(require("./naming-strategy"), exports);
__exportStar(require("./metadata"), exports);
__exportStar(require("./cache"), exports);
__exportStar(require("./decorators"), exports);
