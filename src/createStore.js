"use strict";
exports.__esModule = true;
exports.createStore = void 0;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var identify = function (x) { return x; };
function createStore(reducers) {
    if (reducers === void 0) { reducers = identify; }
    var action$ = new rxjs_1.BehaviorSubject({ type: '@@INIT' });
    var state$ = action$.pipe(operators_1.scan(function (state, action) { return reducers(state, action); }, {}), operators_1.tap(function (state) { return (state$.value = state); }), operators_1.shareReplay(1));
    function dispatch(action) {
        action$.next(action);
    }
    function registerEffects(effects) {
        for (var _i = 0, effects_1 = effects; _i < effects_1.length; _i++) {
            var effect = effects_1[_i];
            effect(action$, state$, dispatch).subscribe();
        }
    }
    return {
        state$: state$,
        dispatch: dispatch,
        registerEffects: registerEffects
    };
}
exports.createStore = createStore;
