(function() {

  define(['jquery', 'underscore', 'backbone', 'events'], function($, _, Backbone, Events) {
    var functions, views;
    views = {};
    functions = {
      create: function(context, name, View, options) {
        var view;
        if (typeof views[name] !== 'undefined') {
          views[name].undelegateEvents();
          if (typeof views[name].close === 'function') {
            views[name].close();
          }
        }
        view = new View(options);
        if (_.isEmpty(context)) {
          views[name] = view;
        } else {
          view.parent = context;
          if (typeof context.children === 'undefined') {
            context.children = {};
            context.children[name] = view;
          } else {
            context.children[name] = view;
          }
        }
        Events.trigger('viewCreated');
        return view;
      },
      list: function() {
        return views;
      },
      get: function(name) {
        if (_.isObject(views[name])) {
          return views[name];
        } else {
          return false;
        }
      },
      remove: function(name, parent) {
       
        if (parent) {
          if (_.has(parent, "children")) {
            if (_.isObject(parent.children[name])) {
              parent.children[name].unbind();
              parent.children[name].$el.remove();
              if (_.isFunction(parent.children[name].close)) {
                parent.children[name].close();
              }
              return delete parent.children[name];
            }
          }
        } else {
          views[name].unbind();
          views[name].$el.remove();
          if (_.isFunction(views[name].close)) {
            views[name].close();
          }
          return delete views[name];
        }
      },
      getChild: function(parent, name) {
        var result;
        if (parent) {
          if (_.has(parent, "children")) {
            if (_.isObject(parent.children[name])) {
              result = parent.children[name];
            }
          }
        }
        if (_.isObject(result)) {
          return result;
        } else {
          return false;
        }
      }
    };
    return functions;
  });

}).call(this);
