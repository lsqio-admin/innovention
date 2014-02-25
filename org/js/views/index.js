(function() {
    define(['require', 'jquery', 'underscore', 'bb', 'i/item/c','text!/html/index.html'], function(require, $, _, Backbone, Items) {
        return Backbone.View.extend({
            id: 'index',
            initialize: function(options) {
                var that = this;
                this.___ = options.___;
                this.items = new Items(null,{ s: this.___.so});
                var Home = require('text!/html/index.html');
                this.home = _.template(Home);
                that.render();
            },
            events: {
            },
            render:function(){
                var that       = this;
                that.$el.html(this.home({}))
               /* that.items.fetch({
                    success:function(){
                    },data:{}
                })
             */
            
            }
    });
});

}).call(this);

