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
                if(_.isObject(that.___.p)){
                    that.$el.html(this.home({
                         name: that.___.p.get("title")
                        ,log: that.___.u.loggedIn
                        ,email: (that.___.p.get("email").indexOf("@nyu") != -1)
                    }))
                }else{
                    that.$el.html(this.home({
                         name: ""
                        ,log: that.___.u.loggedIn
                        ,email: false
                    }))
                }
                

                    
                


               /* that.items.fetch({
                    success:function(){
                    },data:{}
                })
             */
            
            }
    });
});

}).call(this);

