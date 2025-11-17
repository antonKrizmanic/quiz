const Module = require('module');
const path = require('path');

const baseDir = path.resolve(__dirname, '..', '.test-dist');
const originalResolve = Module._resolveFilename;

Module._resolveFilename = function (request, parent, isMain, options) {
    if (request.startsWith('@/')) {
        const resolved = path.join(baseDir, request.slice(2));
        return originalResolve.call(this, resolved, parent, isMain, options);
    }
    return originalResolve.call(this, request, parent, isMain, options);
};
