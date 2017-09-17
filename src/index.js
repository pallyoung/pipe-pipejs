(function (factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : window.Pipe = factory();     
})(function () {
    'use strict'

    var IDLE = 'idle';
    var BUSY = 'busy';

    function next(pipe, source) {
        var handler = pipe._handler;
        function _abort() {

        }
        function _next(newSource) {
            source = newSource || source;
            if (pipe._next) {
                next(pipe._next, source)
            } else {
                pipe._root.status = IDLE;
            }
        }
        handler(source, _next, _abort);

    }

    function abort(pipe) {
        pipe._root.status = IDLE;
    }

    function Pipe(handler) {
        var self = this;
        if (!(this instanceof (Pipe))) {
            self = new Pipe(handler);
        } else {
            self._previous = null;
            self._next = null;
            self._handler = handler;
            self._root = {
                status: IDLE,
                root: self
            };
        }
        return self;
    }
    Pipe.prototype = {
        constructor: Pipe,
        source: function (source) {
            if (this._root.status === IDLE) {
                next(this._root.root, source);
            } else {
                throw new Error();
            }

        },
        remove: function () {
            this._root = {
                status: IDLE,
                root: this
            }
            var next = this._next;
            var previous = this._previous;
            if (next && previous) {
                next._previous = previous;
                previous._next = next;
            } else if (!next && previous) {
                previous._next = null;
            } else if (!previous && next) {
                next._previous = null;
                next._root.root = next;
            }

        },
        before: function (pipe) {
            if (pipe._next) {
                throw new Error();
            }

            pipe._next = this;
            pipe._previous = this._previous;
            this._previous = pipe;
            pipe._root = this._root;
            if (!pipe._previous) {
                pipe._root.root = pipe;
            }

        },
        after: function (pipe) {
            if (pipe._previous) {
                throw new Error();
            }
            pipe._previous = this;
            pipe._next = this._next;
            this._next = pipe;
            pipe._root = this._root;
        }
    }
    return Pipe;
});


