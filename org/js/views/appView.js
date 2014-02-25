(function() {

  define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    return Backbone.View.extend({
      el: 'body',
      initialize: function() {
        return this.render();
      },
      render: function() {}
    });
  });

}).call(this);