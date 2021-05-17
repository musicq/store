"use strict";
exports.__esModule = true;
exports.select = void 0;
var operators_1 = require("rxjs/operators");
function select(path) {
    return operators_1.map(function (state) {
        if (!path)
            return state;
        var props = path.split('.');
        var prop;
        var res = state;
        while ((prop = props.shift()) !== undefined &&
            res !== undefined) {
            res = res[prop];
        }
        return res;
    });
}
exports.select = select;
