var EventListener = function() {
  var _listenersMap = {};
  var _fired = {};
  var _noId = 0;
  var fn = {
    add: function(eventType, callback, thisArg, options) {
      if (!fn.hasEvent(eventType)) {
        _listenersMap[eventType] = {};
      }
      var ln = {
        callback: callback,
        thisArg: typeof thisArg != "undefined" ? thisArg : {}
      };
      if (options && options.id) {
        var id = "id:" + options.id;
      } else {
        var id = "no:" + _noId;
        _noId++;
      }
      _listenersMap[eventType][id] = ln;
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
    remove: function(eventType, id) {
      if (_listenersMap.hasOwnProperty(eventType) &&
        _listenersMap[eventType].hasOwnProperty("id:" + id)) {
        delete _listenersMap[eventType]["id:" + id];
        return true;
      }
      return false;
    },
    hasEvent: function(eventType) {
      return _listenersMap.hasOwnProperty(eventType);
    },
    fireEvent: function(eventType, args, thisArg) {
      if (!fn.hasEvent(eventType)) {
        _listenersMap[eventType] = {};
      }
      for (var id in _listenersMap[eventType]) {
        _listenersMap[eventType][id].callback.apply(
          typeof thisArg != "undefined" ? thisArg : _listenersMap[eventType][id].thisArg,
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
