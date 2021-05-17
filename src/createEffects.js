"use strict";
exports.__esModule = true;
exports.createEffect = void 0;
var operators_1 = require("rxjs/operators");
function isAction(action) {
    return action && typeof action === 'object' && action.type;
}
function createEffect(fn) {
    return function (action$, state$, dispatch) {
        return fn(action$, state$, dispatch).pipe(operators_1.tap(function (action) {
            if (isAction(action)) {
                action$.next(action);
            }
        }));
    };
}
exports.createEffect = createEffect;
