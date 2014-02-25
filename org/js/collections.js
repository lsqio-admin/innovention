(function() {

  define(["underscore", "bb", "i/models123456789/m", "bsend"], function(_, Backbone, Model, Bsend) {
    return Backbone.Collection.extend({
      model: Model,
      url: "models123456789",
      initialize: function(models, options) {
        if (_.isObject(options)) {
          if (_.has(options, "s")) {
            this.socket = options.s;
            _.bindAll(this, "serverCreate", "collectionCleanup");
            return this.ioBind("create", this.serverCreate, this);
          }
        }
      },
      serverCreate: function(data) {
        var exists;
        exists = this.get(data.id);
        if (!exists) {
          if (_.has(this, "socket")) {
            return this.add(data, {
              s: this.socket
            });
          } else {
            return this.add(data);
          }
        } else {
          data.fromServer = true;
          return exists.set(data);
        }
      },
      collectionCleanup: function(callback) {
        this.ioUnbindAll();
        this.each(function(model) {
          return model.modelCleanup();
        });
        return this;
      }
    });
  });

}).call(this);
