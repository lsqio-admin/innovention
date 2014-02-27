(function() {
    define(['require', 'jquery', 'underscore', 'bb', 'i/item/c','i/profile/c','text!/html/admin.html','text!/html/list-video-admin.html'], function(require, $, _, Backbone, Items,Profiles) {
        return Backbone.View.extend({
            id: 'index',
            initialize: function(options) {
                var that = this;
                this.___ = options.___;
                this.items = new Items(null,{ s: this.___.so});
                this.profiles = new Profiles(null,{ s: this.___.so});
                this.items.on("change:states.count",this.updateCount,this)
                this.items.on("remove",this.removeItem,this)
                this.items.on("add",this.addItem,this)
                this.home = _.template(require('text!/html/admin.html'));
                this.listVideo = _.template(require('text!/html/list-video-admin.html'));
                that.render();
            },
            events: {
                "click .create":"createItem"
                ,"click .list .delete":"deleteItem"
            },
            render:function(){
                var that       = this;
                if(_.isObject(that.___.p)){
                    var email = that.___.p.get("email")
                    that.$el.html(this.home({
                         name: that.___.p.get("title")
                        ,log: that.___.u.loggedIn
                        ,email: (email == "pellepelle3@gmail.com" || email == "vk542@nyu.edu" || email == "gmn233@nyu.edu")
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
                ,videoLink  = that.$(".createNewItem .videoLink").val()
                ,desc       = that.$(".createNewItem .desc").val();


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
                    //that.items.create({title:title,body:{video:videoLink,desc:desc},states:{count:0},group:"vote"},{wait:true})
                }
                var arr =  [{"body":{"desc":"","video":"https://fast.wistia.net/embed/iframe/hwkw4uzbq0?fullscreenButton=true"},"group":"vote","states":{"count":0},"title":"Steven Kuyan"},{"body":{"desc":"","video":"https://fast.wistia.net/embed/iframe/3mbec0b82f?fullscreenButton=true"},"group":"vote","states":{"count":0},"title":"Jonathan  Samudio"},{"body":{"desc":"","video":"https://fast.wistia.net/embed/iframe/pk7uwyv0za?fullscreenButton=true"},"group":"vote","states":{"count":0},"title":"Rebecca Hillegass"},{"body":{"desc":"","video":"https://fast.wistia.net/embed/iframe/eod6ncxul8?fullscreenButton=true"},"group":"vote","states":{"count":0},"title":"Frank Yao"},{"body":{"desc":"","video":"https://fast.wistia.net/embed/iframe/0yolko1dt9?fullscreenButton=true"},"group":"vote","states":{"count":0},"title":"Ross Kopelman"},{"body":{"desc":"","video":"https://fast.wistia.net/embed/iframe/8cr1in1ur6?fullscreenButton=true"},"group":"vote","states":{"count":0},"title":"Riccardo Vittoria"},{"body":{"desc":"","video":"https://fast.wistia.net/embed/iframe/oyinm0nzjp?fullscreenButton=true"},"group":"vote","states":{"count":0},"title":"Nikolas Vale"},{"body":{"desc":"","video":"https://fast.wistia.net/embed/iframe/np262y61li?fullscreenButton=true"},"group":"vote","states":{"count":0},"title":"Ameesha Somani"},{"body":{"desc":"","video":"https://fast.wistia.net/embed/iframe/fzr4p0e66l?fullscreenButton=true"},"group":"vote","states":{"count":0},"title":"Jay Suong"},{"body":{"desc":"","video":"https://fast.wistia.net/embed/iframe/6s3n4e2qc8?fullscreenButton=true"},"group":"vote","states":{"count":0},"title":"Jackson Vaughan"},{"body":{"desc":"","video":"https://fast.wistia.net/embed/iframe/lvwz02b98x?fullscreenButton=true"},"group":"vote","states":{"count":0},"title":"Libing Wang"},{"body":{"desc":"","video":"https://fast.wistia.net/embed/iframe/wtsrtk260c?fullscreenButton=true"},"group":"vote","states":{"count":0},"title":"Danielle Leong"},{"body":{"desc":"","video":"https://fast.wistia.net/embed/iframe/0xq5c1eg6v?fullscreenButton=true"},"group":"vote","states":{"count":0},"title":"Mitesh Shah"},{"body":{"desc":"","video":"https://fast.wistia.net/embed/iframe/ucnkxlscir?fullscreenButton=true"},"group":"vote","states":{"count":0},"title":"Danbee Jung"},{"body":{"desc":"","video":"https://fast.wistia.net/embed/iframe/7gz8z0igoq?fullscreenButton=true"},"group":"vote","states":{"count":0},"title":"Andrew Bennie"},{"body":{"desc":"","video":"https://fast.wistia.net/embed/iframe/zrrsiu94uc?fullscreenButton=true"},"group":"vote","states":{"count":0},"title":"Arif Azeez"},{"body":{"desc":"","video":"https://fast.wistia.net/embed/iframe/m4nspv6f20?fullscreenButton=true"},"group":"vote","states":{"count":0},"title":"Michael Karlesky"},{"body":{"desc":"","video":"https://fast.wistia.net/embed/iframe/06q6zuiuiq?fullscreenButton=true"},"group":"vote","states":{"count":0},"title":"Achintya Ashok"},{"body":{"desc":"","video":"https://fast.wistia.net/embed/iframe/ykm9rrcwx7?fullscreenButton=true"},"group":"vote","states":{"count":0},"title":"Jonathan Quincoses"},{"body":{"desc":"","video":"https://fast.wistia.net/embed/iframe/u6vu3hd637?fullscreenButton=true"},"group":"vote","states":{"count":0},"title":"Rucha  Patwardhan"},{"body":{"desc":"","video":"https://fast.wistia.net/embed/iframe/fvlze4s0vs?fullscreenButton=true"},"group":"vote","states":{"count":0},"title":"Nitin Prakash  Vunnam"},{"body":{"desc":"","video":"https://fast.wistia.net/embed/iframe/v4jm68fr9f?fullscreenButton=true"},"group":"vote","states":{"count":0},"title":"Koushik Paul"},{"body":{"desc":"","video":"https://fast.wistia.net/embed/iframe/pbhmn4559r?fullscreenButton=true"},"group":"vote","states":{"count":0},"title":"Christopher Hernandez"},{"body":{"desc":"","video":"https://fast.wistia.net/embed/iframe/djyzlaf0vp?fullscreenButton=true"},"group":"vote","states":{"count":0},"title":"Deepika Jangra"},{"body":{"desc":"","video":"https://fast.wistia.net/embed/iframe/vlfv6lc2hh?fullscreenButton=true"},"group":"vote","states":{"count":0},"title":"Richard  Day"},{"body":{"desc":"","video":"https://fast.wistia.net/embed/iframe/iyfk6urf1q?fullscreenButton=true"},"group":"vote","states":{"count":0},"title":"Daisy Lobo"},{"body":{"desc":"","video":"https://fast.wistia.net/embed/iframe/7cuyh1ktw2?fullscreenButton=true"},"group":"vote","states":{"count":0},"title":"daisy lobo"},{"body":{"desc":"","video":"https://fast.wistia.net/embed/iframe/zeqqqb8886?fullscreenButton=true"},"group":"vote","states":{"count":0},"title":"Kazi Yasin Helal"},{"body":{"desc":"","video":"https://fast.wistia.net/embed/iframe/1i6mb5htbe?fullscreenButton=true"},"group":"vote","states":{"count":0},"title":"Venkatesh Thallam"},{"body":{"desc":"","video":"https://fast.wistia.net/embed/iframe/dmx5idntbq?fullscreenButton=true"},"group":"vote","states":{"count":0},"title":"Terrence Agbi"},{"body":{"desc":"","video":"https://fast.wistia.net/embed/iframe/u2d23wab7w?fullscreenButton=true"},"group":"vote","states":{"count":0},"title":"Darrien Watson"},{"body":{"desc":"","video":"https://fast.wistia.net/embed/iframe/gnzyr6o86h?fullscreenButton=true"},"group":"vote","states":{"count":0},"title":"Billy Keefe"},{"body":{"desc":"","video":"https://fast.wistia.net/embed/iframe/1i255ux9ep?fullscreenButton=true"},"group":"vote","states":{"count":0},"title":"Mehmet Kaptan"},{"body":{"desc":"","video":"https://fast.wistia.net/embed/iframe/p35pe6by6u?fullscreenButton=true"},"group":"vote","states":{"count":0},"title":"Tarana Gupta"},{"body":{"desc":"","video":"https://fast.wistia.net/embed/iframe/rasryfj8n2?fullscreenButton=true"},"group":"vote","states":{"count":0},"title":"Mehul p"},{"body":{"desc":"","video":"https://fast.wistia.net/embed/iframe/zgvxmyvmau?fullscreenButton=true"},"group":"vote","states":{"count":0},"title":"Efe A"}]
                _.each(arr,function(m){
                    that.items.create(m,{wait:true})
                })
            },addItem:function(m){
                if(m.get("group") == "vote" && this.$('.item[data-id="'+m.id+'"]').length == 0)
                    this.$("ul.list").append(this.listVideo(m.toJSON()));

            },updateCount:function(m){
                var that = this;

                that.$(".item[data-id='"+m.id+"'] .count").html(m.get("states.count"))
            },deleteItem:function(e){
                var that= this
                ,id     = $(e.currentTarget).parents(".item").data("id")
                ,m      = that.items.get(id);
                
                m.destroy();
                that.profiles.fetch({
                    success:function(){
                        that.profiles.each(function(p){
                            p.save({"states.vote":null});
                        })
                    },data:{"states.vote":id}
                })

            },removeItem:function(m){
                this.$('.item[data-id="'+m.id+'"]').remove()
            }
    });
});

}).call(this);

