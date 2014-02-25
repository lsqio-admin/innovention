(function() {
    define(['require', 'jquery', 'underscore', 'bb', 'i/item/c','text!/html/admin.html','text!/html/list-video-admin.html'], function(require, $, _, Backbone, Items) {
        return Backbone.View.extend({
            id: 'index',
            initialize: function(options) {
                var that = this;
                this.___ = options.___;
                this.items = new Items(null,{ s: this.___.so});
                this.items.on("change:states.count",this.updateCount,this)
                this.home = _.template(require('text!/html/admin.html'));
                this.listVideo = _.template(require('text!/html/list-video-admin.html'));
                that.render();
            },
            events: {
                "click .create":"createItem"
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
            },createItem:function(){
                var that    = this
                ,err        = 0
                ,title      = that.$(".createNewItem .title").val()
                ,videoLink  = that.$(".createNewItem .videoLink").val();

                if(title.length < 3){
                    err++;
                    that.$(".createNewItem .title").addClass("err");
                }

                if(videoLink.length < 3){
                    err++;
                    that.$(".createNewItem .videoLink").addClass("err");
                }

                if(err == 0 ){
                    that.$(".createNewItem input").removeClass("err")
                    that.items.create({title:title,body:{video:videoLink},states:{count:0},group:"vote"})
                }
                    

            },updateCount:function(m){
                var that = this;

                that.$(".item[data-id='"+m.id+"'] .count").html(m.get("states.count"))
            }
    });
});

}).call(this);

