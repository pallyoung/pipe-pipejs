(function (factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : window.Pipe = factory();
})(function () {
    'use strict'

    var IDLE = 'idle';
    var BUSY = 'busy';
    var id = 0;
    var KEY = '_pipe_x_key_';

    function key() {
        return 'pipe_x_key_' + (++id);
    }
    function firstNoop(source, next, abort) {
        next();
    }
    function lastNoop(source, next, abort) {
        next();
    }
    function next(key,handler,source) {
        function _abort() {

        }
        function _next(newSource) {
            source = newSource || source;
            var nextHandler = getNext(key,handler);
            if (nextHandler) {
                next(key,nextHandler, source)
            } else {
            }
        }
        handler(source, _next, _abort);

    }

    function abort(pipe) {

    }

    function wrapperHandler(key, handler) {

        var config = handler[key] ||
            {
                _next: null,
                _previous:null
            };

        handler[key] = config;

    }

    function getNext(key, handler) {
        return handler[key] && handler[key]._next || null;
    }
    function getPrevious(key,handler){
        return handler[key] && handler[key]._previous || null;
    }

    function setNext(key, handler, nextHandler) {
        var config = handler[key];
        if (!config) {
            throw new Error('handler is not in the pipe');
        }
        if (nextHandler[key]) {
            throw new Error('nextHandler is already in the pipe');
        }
        wrapperHandler(key, nextHandler);
        var nextConfig = nextHandler[key];
        nextConfig._next = config._next;
        if(config._next){
            config._next[key]._previous = nextHandler;
        }
        nextConfig._previous = handler;
        config._next = nextHandler;
        

    }
    function setPrevious(key, handler, previousHandler) {
        var config = handler[key];
        if (!config) {
            throw new Error('handler is not in the pipe');
        }
        if (previousHandler[key]) {
            throw new Error('previousHandler is already in the pipe');
        }
        wrapperHandler(key, previousHandler);
        var previousConfig = previousHandler[key];
        if(config._previous){
            config._previous[key]._next = previousHandler;
        }
        previousConfig._previous = config._previous;
        previousConfig._next = handler;
        config._previous = previousHandler;
    }
  


    function Pipe(first, last) {
        var self = this;
        first = first || firstNoop;
        last = last || lastNoop;
        if (!(self instanceof (Pipe))) {
            self = new Pipe(first, last);
        } else {
            self._key = key();
            wrapperHandler(self._key, first);
            self._first = first;
            self._last = last;
            setNext(self._key,first,last);
        }
        return self;
    }
    Pipe.prototype = {
        constructor: Pipe,
        source: function (source) {
            next(this._key,this._first, source);
        },
        unshift:function(handler){
            setNext(this._key,this._first,handler);
        },
        append: function (handler) {
            setPrevious(this._key,this._last,handler)
        },
        remove: function (handler) {
            var config = handler[this._key];
            var next = getNext(this._key, handler);
            var previous = getPrevious(this._key, handler);
            if (next && previous) {
                previous[this._key]._next = next;
                next[this._key]._previous = previous;
            }

        },
        insertBefore: function (handler, targetHandler) {
            setPrevious(this._key,targetHandler,handler);
        },
        insertAfter: function (handler, targetHandler) {
            setNext(this._key,targetHandler,handler);
        }
    }
    return Pipe;
});


