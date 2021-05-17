"use strict";
exports.__esModule = true;
exports.combineReducers = void 0;
function combineReducers(reducers) {
    var keys = Object.keys(reducers);
    return function (state, action) {
        var r = {};
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            r[key] = reducers[key]((state || {})[key], action);
        }
        return r;
    };
}
exports.combineReducers = combineReducers;
