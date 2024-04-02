const EventListener = function() {
  const _listenersMap = {};
  const _fired = {};
  let _noId = 0;
  const fn = {
    add: function(eventType, callback, options) {
      if (!fn.hasEvent(eventType)) {
        _listenersMap[eventType] = {};
      }
      const ln = {
        callback: callback,
        this: options && typeof options.this != "undefined" ? options.this : {},
        once: options && options.once ? true : false
      };
      let id;
      if (options && options.id) {
        id = "id:" + options.id;
      } else {
        id = "no:" + _noId;
        _noId++;
      }
      _listenersMap[eventType][id] = ln;
      // For retroactive firings on add
      if (options && options.retroactive) {
        if (!_fired.hasOwnProperty(eventType)) {
          _fired[eventType] = [];
        }
        for (const event of _fired[eventType]) {
          ln.callback.apply(
            typeof event[2] != "undefined" ? event[2] : ln.this,
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
    fireEvent: function(eventType, args, options) {
      if (!fn.hasEvent(eventType)) {
        _listenersMap[eventType] = {};
      }
      for (var id in _listenersMap[eventType]) {
        _listenersMap[eventType][id].callback.apply(
          options && typeof options.this != "undefined" ? options.this : _listenersMap[eventType][id].this,
          Array.isArray(args) ? args : []
        );
        // If listener should be removed after one fire (if still around)
        if (_listenersMap[eventType][id] && _listenersMap[eventType][id].once) {
          delete _listenersMap[eventType][id];
        }
      }
      // For retroactive firings on add
      if (!_fired.hasOwnProperty(eventType)) {
        _fired[eventType] = [];
      }
      _fired[eventType].push([eventType, args, options && typeof options.this != "undefined" ? options.this : undefined]);
      return true;
    }
  };
  return fn;
};
