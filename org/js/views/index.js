(function() {
    define(['require', 'jquery', 'underscore', 'bb', 'i/item/c','text!/html/index.html','text!/html/list-video.html'], function(require, $, _, Backbone, Items) {
        return Backbone.View.extend({
            id: 'index',
            initialize: function(options) {
                var that = this;
                this.___ = options.___;
                this.items = new Items(null,{ s: this.___.so});
                this.items.on("change:states.count",this.updateCount,this)
                this.items.on("remove",this.removeItem,this)
                this.items.on("add",this.addItem,this)

                this.home = _.template(require('text!/html/index.html'));
                this.listVideo = _.template(require('text!/html/list-video.html'));

                that.render();
            },
            events: {
                "click .vote":"voteNow"
            },
            render:function(){
                var that       = this;
                var myVote ="";
                if(_.isObject(that.___.p)){
                    that.$el.html(this.home({
                         name: that.___.p.get("title")
                        ,log: that.___.u.loggedIn
                        ,email: (that.___.p.get("email").indexOf("@nyu") == -1)

                    }))
                    myVote= that.___.p.get("states.vote");
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
                            if(myVote == m.id)
                                that.$(".item[data-id='"+m.id+"']").addClass("active");
                        })
                    },data:{"group":"vote"}
                })
            },voteNow:function(e){
                var that    = this
                    ,id     = $(e.currentTarget).parents(".item").data("id")
                    ,m      = that.items.get(id)
                    ,myVote = that.___.p.get("states.vote");
                if(id == myVote){
                    var mv  = that.items.get(myVote);
                    that.$(".item.active").removeClass("active");
                    mv.save({"states.count":mv.get("states.count")-1})
                    that.___.p.save({"states.vote":null})

                }
                else if(_.isString(myVote)){
                    var mv  = that.items.get(myVote);
                    mv.save({"states.count":mv.get("states.count")-1})
                    that.___.p.save({"states.vote":id})
                    m.save({"states.count":m.get("states.count")+1})
                    that.$(".item.active").removeClass("active");
                    that.$(".item[data-id='"+m.id+"']").addClass("active")
                }else{
                    that.___.p.save({"states.vote":id})
                    m.save({"states.count":m.get("states.count")+1})
                    that.$(".item[data-id='"+m.id+"']").addClass("active")
                }
                    

            },updateCount:function(m){
                var that = this;

                that.$(".item[data-id='"+m.id+"'] .count").html(m.get("states.count"))
            },addItem:function(m){
                if(m.get("group") == "vote" && this.$('.item[data-id="'+m.id+'"]').length == 0)
                    this.$("ul.list").append(this.listVideo(m.toJSON()));

            },removeItem:function(m){
                this.$('.item[data-id="'+m.id+'"]').remove()
            }
    });
});

}).call(this);

