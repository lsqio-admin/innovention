(function() {
    define(['require', 'jquery', 'underscore', 'bb', 'i/item/c','text!/html/admin.html'], function(require, $, _, Backbone, Items) {
        return Backbone.View.extend({
            id: 'index',
            initialize: function(options) {
                var that = this;
                this.___ = options.___;
                this.items = new Items(null,{ s: this.___.so});
                this.home = _.template(require('text!/html/admin.html'));
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
                        ,email: !(that.___.p.get("email").indexOf("@nyu") == -1)
                    }))
                }else{
                    that.$el.html(this.home({
                         name: ""
                        ,log: that.___.u.loggedIn
                        ,email: false
                    }))
                }
                
                that.items.fetch({
                    success:function(){
                        that.items.each(function(m){
                            that.$("ul.list").append(that.listVideo(m.toJSON()));
                        })
                    },data:{"group":"vote"}
                })
            }
    });
});

}).call(this);

