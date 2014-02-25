(function() {

  define(['require', 'jquery', 'underscore', 'bb', 'text!/html/header.html','text!/html/footer.html'], function(require, $, _, Backbone) {
    return Backbone.View.extend({
      id: 'top',
      tagName: 'header',
      initialize: function(options) {
        this.___ = options.___;
        this.render();
        return this.___.router.loadCss('/less/header.css', true);
      },
      events: {},
      render: function() {
        var that = this;        
        var Header = require('text!/html/header.html');
        var header = _.template(Header);
        if (that.___.u.loggedIn == true)        
          that.$el.append(header({
            name: that.___.p.get("title"),
            log: that.___.u.loggedIn
          }));
        else 
          that.$el.append(header({
            name: "Please Log In.",
            log: that.___.u.loggedIn
          }));
        var Footer = require('text!/html/footer.html');
        var footer = _.template(Footer);
        $("body").append(footer({}));
        return this.doneLoading();
      },    
      doneLoading: function() {
        $('body > #content').show();
        return $('body > #loader').hide();
      }
    });
  });

}).call(this);