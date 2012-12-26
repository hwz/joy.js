/**
 * @class GameObject
 */
(function(J) {
  var Actor = J.DisplayObjectContainer.extend({
    init: function (options) {
      if (!options) {
        options = {};
      }

      this._intervals = {};
      this._behaviours = [];

      this._super();
    },

    /**
     * @method bind
     * @param {String} action action name (update, key, keypress, keyrelease)
     * @param {Function} callback
     */
    bind: function(action, func) {
      var behaviour = J.Behaviour.extend({});
      behaviour.prototype[action] = func;
      this.addBehaviour(behaviour);
    },

    /**
     * @method addBehaviour
     * @param {Joy.Behaviour} behaviour behaviour class
     */
    addBehaviour: function (b) {
      var self = this,
          behaviour = new b();
      if (behaviour.update && !this._intervals.update) {
        this.addInterval('update', function() {
          behaviour.update.apply(self);
        }, 100);
      }
      this._behaviours.push(behaviour);
    },

    /**
     * @method addInterval
     * @param {String} id
     * @param {Function} callback
     * @param {Number} interval in milliseconds
     */
    addInterval: function (id, callback, interval) {
      // Prevent lost interval reference to keep running.
      if (this._intervals[id]) {
        clearInterval(this._intervals[id]);
      }
      this._intervals[id] = setInterval(callback, interval);
    },

    update: function() {
      var i=0, totalBehaviours = this._behaviours.length;
      for (;i<totalBehaviours;++i) {
        this._behaviours[i].update.apply(this);
      }
    }
  });

  J.Actor = Actor;
})(Joy);
