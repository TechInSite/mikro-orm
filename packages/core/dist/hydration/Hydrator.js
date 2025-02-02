"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hydrator = void 0;
/* istanbul ignore next */
class Hydrator {
    constructor(metadata, platform, config) {
        this.metadata = metadata;
        this.platform = platform;
        this.config = config;
    }
    /**
     * @inheritDoc
     */
    hydrate(entity, meta, data, factory, type, newEntity = false, convertCustomTypes = false) {
        const props = this.getProperties(meta, type);
        for (const prop of props) {
            this.hydrateProperty(entity, prop, data, factory, newEntity, convertCustomTypes);
        }
    }
    /**
     * @inheritDoc
     */
    hydrateReference(entity, meta, data, factory, convertCustomTypes) {
        meta.primaryKeys.forEach(pk => {
            this.hydrateProperty(entity, meta.properties[pk], data, factory, false, convertCustomTypes);
        });
    }
    getProperties(meta, type) {
        if (type === 'reference') {
            return meta.primaryKeys.map(pk => meta.properties[pk]);
        }
        if (type === 'returning') {
            return meta.hydrateProps.filter(prop => prop.primary || prop.defaultRaw);
        }
        return meta.hydrateProps;
    }
    /* istanbul ignore next */
    hydrateProperty(entity, prop, data, factory, newEntity, convertCustomTypes) {
        entity[prop.name] = data[prop.name];
    }
}
exports.Hydrator = Hydrator;
