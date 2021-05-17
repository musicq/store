"use strict";
exports.__esModule = true;
exports.ofType = void 0;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
function ofType(types) {
    return rxjs_1.pipe(operators_1.filter(function (action) {
        return Array.isArray(types) ? types.includes(action.type) : action.type === types;
    }));
}
exports.ofType = ofType;
