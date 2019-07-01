"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const assert_1 = __importDefault(require("assert"));
/**
 * Make payload for getRecordValues API.
 * @param ids - Notion record ID array.
 * @returns A payload.
 */
function makeRecordRequests(ids) {
    let requests = ids.map((id) => {
        return { id, table: 'block' };
    });
    return requests;
}
/**
 * Collect children IDs of an records array.
 * @param records - The records array.
 * @returns An array of IDs.
 */
function collectChildrenIDs(records) {
    let childrenIDs = [];
    records.forEach((record) => {
        let _childrenIDs = [];
        if (record.value != null && record.value.content != null) {
            _childrenIDs = record.value.content;
        }
        if (_childrenIDs) {
            childrenIDs = childrenIDs.concat(_childrenIDs);
        }
    });
    return childrenIDs;
}
/**
 * Convert RecordValue array to a Notion abstract syntax tree.
 * The tree must have single root and it is the first item in the array.
 * @param allRecords - The RecordValue array.
 * @returns A Notion abstract syntax tree.
 */
function makeTree(allRecords) {
    /* Cast RecordValue to BlockNode. */
    let list = allRecords.map((record) => {
        return {
            type: record.value.type,
            data: record.value.properties,
            raw_value: record.value,
            children: []
        };
    });
    /* A map for quick ID -> index lookup. */
    let map = {};
    for (let i = 0; i < allRecords.length; ++i) {
        map[list[i].raw_value.id] = i;
    }
    /* The tree's root is always the first of RecordValue array. */
    let treeRoot = list[0];
    let node;
    /**
     * Wire up each block's children by iterating through its content
     * and find each child's reference by ID.
     */
    for (let i = 0; i < allRecords.length; ++i) {
        node = list[i];
        /**
         * It's sad that parent_id of some blocks are incorrect, so the following
         * faster way doesn't work.
         */
        // list[map[node.raw_value.parent_id]].children.push(node)
        /** The slower way. */
        let childrenIDs = node.raw_value.content;
        if (childrenIDs != null) {
            for (let j = 0; j < childrenIDs.length; ++j) {
                let indexOfChildReference = map[childrenIDs[j]];
                let childReference = list[indexOfChildReference];
                node.children.push(childReference);
            }
        }
    }
    return treeRoot;
}
module.exports = async function downloadPageAsTree(pageID, agent) {
    assert_1.default(typeof pageID === 'string');
    assert_1.default(typeof agent === 'object');
    assert_1.default(typeof agent.getRecordValues === 'function');
    const api = agent;
    /**
     * Only downloading children of a root "page" block.
     * This prevents downloading children of "link to a page" and
     * "embeded sub-page" blocks.
     */
    let pageRootDownloaded = false;
    /* Get all records in a flat array. */
    const allRecords = await getChildrenRecords([pageID]);
    return makeTree(allRecords);
    //return { records: allRecords }
    /**
     * Get RecordValues of some IDs and their descendants.
     * @param ids - Some IDs.
     * @returns RecordValues of those IDs and their descendants.
     */
    async function getChildrenRecords(ids) {
        let requests = makeRecordRequests(ids);
        let response = await api.getRecordValues(requests);
        let childrenRecords;
        let childrenIDs;
        /**
         * Currently, I ignore any "page" block except the root page.
         *
         * More information:
         *
         * Notion marks a "link to page" block as "page", which has two problems :
         * 1. The "page" block points to its children, require additional checking
         * when doing recursive download.
         * 2. The "parent_id" of the "page" block does not points to the root page
         * we want to download. This way we can't construct a tree correctly.
         */
        if (pageRootDownloaded) {
            /* Filter out "page" blocks. */
            childrenRecords = response.results.filter((record) => {
                return record.value.type !== 'page';
            });
            childrenIDs = collectChildrenIDs(childrenRecords);
        }
        else {
            childrenRecords = response.results;
            childrenIDs = collectChildrenIDs(childrenRecords);
            pageRootDownloaded = true;
        }
        /* If there're remaining children, download them. */
        if (childrenIDs.length > 0) {
            return childrenRecords.concat(await getChildrenRecords(childrenIDs));
        }
        else {
            return childrenRecords;
        }
    }
};
