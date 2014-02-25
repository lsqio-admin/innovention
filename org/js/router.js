(function() {
	define(['require', 'jquery', 'underscore', 'backbone','conf','views/appView', 'vm', 'ga'], function(require, $, _, Backbone,Conf, AppView, Vm, _ga) {
		var AppRouter, initialize;
		AppRouter = Backbone.Router.extend({
			routes: {
				 '!_=_'				: 'index'
				,'!/'				: 'index'
				,'*actions'			: 'index' //catch all 
				
			},
			loadCss: function(url, keep) {
				var link;
				if ($('link[href="' + url + '"]').length === 0) {
					link = document.createElement("link");
					link.type = "text/css";
					link.rel = "stylesheet";
					link.href = url;
					document.getElementsByTagName("head")[0].appendChild(link);
					return $('link[href="' + url + '"]').attr("data-keep", keep);
				}
			},
			dontHaveAccess: function(to) {
				return $('#content').html('\
					<center>\
					<div id=error class="ui-state-error ui-corner-all">\
					<p><img src="/images/error/warning.png" />\
					<span class="error-text" >You dont have access to #{to} </span>\
					</p>\
					</div>\
					</center>');
			},
			pageError: function(err) {
				return $('#content').html('\
					<center>\
					<div id=error class="ui-state-error ui-corner-all">\
					<p>\
					<img src="/images/error/warning.png" />\
					<span class="error-text" > #{err}</span>\
					</p>\
					</div>\
					</center>');
			},
			pagePermission: function(module, err, query, role, ___, callback) {},
			onPageStart: function(page, ___) {
				___.ga('send', 'pageview', page);
				___.c.save({page: page});
				___.i.save({page: page});

				$('a').removeClass("active");
				$('a[href="#!' + page + '"]').addClass("active");
				return ___;
			}
		});
		initialize = function(options) {
			var ___ = options.___;
     		___.ga = _ga.Apply();
     		___.view = Vm.create({}, 'AppView', AppView);
            ___.vm = Vm;
			___.route = this;
			___.router = new AppRouter(options);
			___.view.$el.append('<div id=content></div>');
			$('#___spin').hide();
			$('#content').hide();

			___.router.on('route:index', function() {
					var path = 'index';
					___ = ___.router.onPageStart(path, ___);
					require(['views/index'], function(Page) {
						___.router.loadCss('/less/index.css');
						if(___.view.$('#content #index').length >0)
						 	___.view.$('#content #index').show()
						else{
							page = ___.vm.create(___.view, 'index', Page, {___: ___ });
							___.view.$('#content').append(page.$el)
						}
					});
					return;
				});
			
			require(['views/topPage'], function(Page) {
				var page;
				page = ___.vm.create(___.view, 'top', Page, {
					___: ___
				});
				___.view.$el.prepend(page.$el);
			});
			Backbone.history.start();
			return this;
		};
		return {
			initialize: initialize
		};
	});

}).call(this);