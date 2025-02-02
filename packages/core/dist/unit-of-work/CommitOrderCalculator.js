"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommitOrderCalculator = void 0;
const enums_1 = require("../enums");
/**
 * CommitOrderCalculator implements topological sorting, which is an ordering
 * algorithm for directed graphs (DG) and/or directed acyclic graphs (DAG) by
 * using a depth-first searching (DFS) to traverse the graph built in memory.
 * This algorithm have a linear running time based on nodes (V) and dependency
 * between the nodes (E), resulting in a computational complexity of O(V + E).
 *
 * Based on https://github.com/doctrine/orm/blob/master/lib/Doctrine/ORM/Internal/CommitOrderCalculator.php
 * @internal
 */
class CommitOrderCalculator {
    constructor() {
        /** Matrix of nodes, keys are provided hashes and values are the node definition objects. */
        this.nodes = {};
        /** Volatile variable holding calculated nodes during sorting process. */
        this.sortedNodeList = [];
    }
    /**
     * Checks for node existence in graph.
     */
    hasNode(hash) {
        return hash in this.nodes;
    }
    /**
     * Adds a new node to the graph, assigning its hash.
     */
    addNode(hash) {
        this.nodes[hash] = { hash, state: 0 /* NOT_VISITED */, dependencies: {} };
    }
    /**
     * Adds a new dependency (edge) to the graph using their hashes.
     */
    addDependency(from, to, weight) {
        this.nodes[from].dependencies[to] = { from, to, weight };
    }
    discoverProperty(prop, entityName) {
        var _a;
        if (!(prop.reference === enums_1.ReferenceType.ONE_TO_ONE && prop.owner) && prop.reference !== enums_1.ReferenceType.MANY_TO_ONE) {
            return;
        }
        /* istanbul ignore next */
        const propertyType = (_a = prop.targetMeta) === null || _a === void 0 ? void 0 : _a.root.className;
        if (!propertyType || !this.hasNode(propertyType)) {
            return;
        }
        this.addDependency(propertyType, entityName, prop.nullable ? 0 : 1);
    }
    /**
     * Return a valid order list of all current nodes.
     * The desired topological sorting is the reverse post order of these searches.
     *
     * @internal Highly performance-sensitive method.
     */
    sort() {
        for (const vertex of Object.values(this.nodes)) {
            if (vertex.state !== 0 /* NOT_VISITED */) {
                continue;
            }
            this.visit(vertex);
        }
        const sortedList = this.sortedNodeList.reverse();
        this.nodes = {};
        this.sortedNodeList = [];
        return sortedList;
    }
    /**
     * Visit a given node definition for reordering.
     *
     * @internal Highly performance-sensitive method.
     */
    visit(node) {
        node.state = 1 /* IN_PROGRESS */;
        for (const edge of Object.values(node.dependencies)) {
            const target = this.nodes[edge.to];
            switch (target.state) {
                case 2 /* VISITED */: break; // Do nothing, since node was already visited
                case 1 /* IN_PROGRESS */:
                    this.visitOpenNode(node, target, edge);
                    break;
                case 0 /* NOT_VISITED */: this.visit(target);
            }
        }
        if (node.state !== 2 /* VISITED */) {
            node.state = 2 /* VISITED */;
            this.sortedNodeList.push(node.hash);
        }
    }
    /**
     * Visits all target's dependencies if in cycle with given node
     */
    visitOpenNode(node, target, edge) {
        if (!target.dependencies[node.hash] || target.dependencies[node.hash].weight >= edge.weight) {
            return;
        }
        for (const edge of Object.values(target.dependencies)) {
            const targetNode = this.nodes[edge.to];
            if (targetNode.state === 0 /* NOT_VISITED */) {
                this.visit(targetNode);
            }
        }
        target.state = 2 /* VISITED */;
        this.sortedNodeList.push(target.hash);
    }
}
exports.CommitOrderCalculator = CommitOrderCalculator;
