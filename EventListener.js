var EventListener = function() {
  var _listeners = {};
  var _fired = {};
  var fn = {
    add: function(eventType, callback, thisArg, options) {
      if (!fn.hasEvent(eventType)) {
        _listeners[eventType] = [];
      }
      var ln = {
        callback: callback,
        thisArg: typeof thisArg != "undefined" ? thisArg : {}
      };
      _listeners[eventType].push(ln);
      // For retroactive firings on add
      if (options && options.retroactive) {
        if (!_fired.hasOwnProperty(eventType)) {
          _fired[eventType] = [];
        }
        for (var event of _fired[eventType]) {
          ln.callback.apply(
            typeof event[2] != "undefined" ? event[2] : ln.thisArg,
            Array.isArray(event[1]) ? event[1] : []
          );
        }
      }
      return true;
    },
    hasEvent: function(eventType) {
      return _listeners.hasOwnProperty(eventType);
    },
    fireEvent: function(eventType, args, thisArg) {
      if (!fn.hasEvent(eventType)) {
        _listeners[eventType] = [];
      }
      for (var ln of _listeners[eventType]) {
        ln.callback.apply(
          typeof thisArg != "undefined" ? thisArg : ln.thisArg,
          Array.isArray(args) ? args : []
        );
      }
      // For retroactive firings on add
      if (!_fired.hasOwnProperty(eventType)) {
        _fired[eventType] = [];
      }
      _fired[eventType].push([eventType, args, thisArg]);
      return true;
    }
  };
  return fn;
};
