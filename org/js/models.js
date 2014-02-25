define(["underscore","bb","bsend"]
	,function(_,Backbone,Bsend){
		var DeepModel = {}
		DeepModel.keyPathSeparator ='.';
		function objToPaths(obj) {
       		var ret = {},
	            separator = DeepModel.keyPathSeparator;

	       	for (var key in obj) {
	            var val = obj[key];

	            if (val && val.constructor === Object && !_.isEmpty(val)) {
	                //Recursion for embedded objects
	                var obj2 = objToPaths(val);

	                for (var key2 in obj2) {
	                    var val2 = obj2[key2];

	                    ret[key + separator + key2] = val2;
	                }
	            } else {
	                ret[key] = val;
	            }
	        }
	    	return ret;
   		}
		function getNested(obj, path, return_exists) {
        var separator = DeepModel.keyPathSeparator;

        var fields = path.split(separator);
	        var result = obj;
	        return_exists || (return_exists === false);
	        for (var i = 0, n = fields.length; i < n; i++) {
	            if (return_exists && !_.has(result, fields[i])) {
	                return false;
	            }
	            result = result[fields[i]];

	            if (result == null && i < n - 1) {
	                result = {};
	            }
	            
	            if (typeof result === 'undefined') {
	                if (return_exists)
	                {
	                    return true;
	                }
	                return result;
	            }
	        }
	        if (return_exists)
	        {
	            return true;
	        }
	        return result;
    	}
		function setNested(obj, path, val, options) {
	        options = options || {};

	        var separator = DeepModel.keyPathSeparator;

	        var fields = path.split(separator);
	        var result = (obj == null )? undefined : obj;
	        for (var i = 0, n = fields.length; i < n && result !== undefined ; i++) {
	            var field = fields[i];

	            //If the last in the path, set the value
	            if (i === n - 1) {
	                options.unset ? delete result[field] : result[field] = val;
	            } else {
	                //Create the child object if it doesn't exist, or isn't an object
	                if (typeof result[field] === 'undefined' || ! _.isObject(result[field])) {
	                    result[field] = {};
	                }

	                //Move onto the next part of the path
	                result = result[field];
	            }
	        }
    	}
	    function deleteNested(obj, path) {
	      setNested(obj, path, null, { unset: true });
	    }
		return Backbone.Model.extend({
			 idAttribute:"_id"
			,urlRoot:"models123456789"
			,initialize:function(attributes,options){
				if(_.has(options,"s"))
						this.socket = options.s;
					_.bindAll(this,"serverChange","serverDelete","modelCleanup");
					if(!this.noIoBind){
						this.ioBind("update",this.serverChange,this);
						this.ioBind("delete",this.serverDelete,this);
						this.ioBind("lock",this.serverLock,this);
						this.ioBind("unlock",this.serverUnlock,this)
					}
				
			},serverChange: function (data) {
		   		data.fromServer = true;
		   	//	console.log('serverChange', data)
		    	this.set(data);
		    },serverDelete: function (data) {
		    //	console.log("serverDelete",data)
		      if (typeof this.collection === 'object') {
		        this.collection.remove(this);
		      } else {
		        this.trigger('remove', this);
		      }
		    },serverLock: function (success) {
		      if (success) {
		        this.locked = true;
		        this.trigger('lock', this);
		      }
		    },serverUnlock: function (success) {
		      if (success) {
		        this.locked = false;
		      }
		    },modelCleanup: function () {
		      this.ioUnbindAll();
		      return this;
		    },locked: false
			,lock: function (options) {
		      if (!this._locked) {
		        options = options ? _.clone(options) : {};
		        var model = this
		          , success = options.success;
		        options.success = function (resp, status, xhr) {
		          model.locked = true;
		          if (success) {
		            success(model, resp);
		          } else {
		            model.trigger('lock', model, resp, options);
		          }
		        };
		        options.error = Backbone.wrapError(options.error, model, options);
		        return (this.sync || Backbone.sync).call(this, 'lock', this, options);
		      }
		    },unlock: function (options) {
		      if (this.locked) {
		        options = options ? _.clone(options) : {};
		        var model = this
		          , success = options.success;
		        options.success = function (resp, status, xhr) {
		          model._locked = false;
		          if (success) {
		            success(model, resp);
		          } else {
		            model.trigger('unlock', model, resp, options);
		          }
		        };
		        options.error = Backbone.wrapError(options.error, model, options);
		        return (this.sync || Backbone.sync).call(this, 'unlock', this, options);
		      }
		    },save: function(key, val, options) {
				var attrs, current, done;

				// Handle both `"key", value` and `{key: value}` -style arguments.
				if (key == null || _.isObject(key)) {
					attrs = key;
					options = val;
				} else if (key != null) {
					(attrs = {})[key] = val;
				}
				options = options ? _.clone(options) : {};
				if(_.isFunction(options.callback))
					options.wait = true;
				// If we're "wait"-ing to set changed attributes, validate early.
				if (options.wait) {
					if (attrs && !this._validate(attrs, options)) return false;
					current = _.clone(this.attributes);
				}

				// Regular saves `set` attributes before persisting to the server.
				var silentOptions = _.extend({}, options, {silent: true});
				if (attrs && !this.set(attrs, options.wait ? silentOptions : options)) {
					return false;
				}

				// Do not persist invalid models.
				if (!attrs && !this._validate(null, options)) return false;

				// After a successful server-side save, the client is (optionally)
				// updated with the server-side state.
				var model = this;
				var success = options.success;

				options.success = function(model, resp, options) {
					done = true;
					var serverAttrs = model.parse(resp);
					if (options.wait) serverAttrs = _.extend(attrs || {}, serverAttrs);
					if (!model.set(serverAttrs, options)) return false;
					if (success) success(model, resp, options);
					if(_.isFunction(options.callback))options.callback(resp,model);
		      		
				};

				// Finish configuring and sending the Ajax request.
				var method = this.isNew() ? 'create' : (options.all ? 'patch' : 'update');
				if (method == 'update') options.attrs = attrs;
				var xhr = Backbone.sync(method, this, options);

				// When using `wait`, reset attributes to original values unless
				// `success` has been called already.
				if (!done && options.wait) {
					this.clear(silentOptions);
					this.set(current, silentOptions);
				}

				return xhr;
		    },get:function(attr){
				return getNested(this.attributes, attr);
			},set: function(key, value, options) {
		        //<custom code>
		        var Model = Backbone.Model;
		        //</custom code>

		        var attrs, attr, val;

		        // Handle both `"key", value` and `{key: value}` -style arguments.
		        if (_.isObject(key) || key == null) {
		            attrs = key;
		            options = value;
		        } else {
		            attrs = {};
		            attrs[key] = value;
		        }

		        // Extract attributes and options.
		        options || (options = {});
		        if (!attrs) return this;
		        if (attrs instanceof Model) attrs = attrs.attributes;
		        if (options.unset) for (attr in attrs) attrs[attr] = void 0;

		        // Run validation.
		        if (!this._validate(attrs, options)) return false;

		        // Check for changes of `id`.
		        if (!_.isUndefined(getNested(attrs, this.idAttribute))) this.id = getNested(attrs, this.idAttribute);

		        var changes = options.changes = {};
		        var now = this.attributes;
		        var escaped = this._escapedAttributes  || {};
		        var prev = this._previousAttributes || {};


		        // <custom code>
		        attrs = objToPaths(attrs);

		        // For each `set` attribute...
		        for (attr in attrs) {
		          val = attrs[attr];

		          var currentValue = getNested(now, attr),
		              previousValue = getNested(prev, attr),
		              escapedValue = getNested(escaped, attr),
		              hasCurrentValue = _.isUndefined(currentValue),
		              hasPreviousValue = _.isUndefined(previousValue);

		          // If the new and current value differ, record the change.
		          if (!_.isEqual(currentValue, val) || (options.unset && hasCurrentValue)) {
		            deleteNested(escaped, attr);
		            setNested((options.silent ? this._silent : changes), attr, true);
		          }

		          // Update or delete the current value.
		          options.unset ? deleteNested(now, attr) : setNested(now, attr, val);

		          // If the new and previous value differ, record the change.  If not,
		          // then remove changes for this attribute.
		          if (!_.isEqual(previousValue, val) || (hasCurrentValue != hasPreviousValue)) {
		            setNested(this.changed, attr, _.clone(val));
		            if (!options.silent) setNested(this._pending, attr, true);
		          } else {
		            deleteNested(this.changed, attr);
		            deleteNested(this._pending, attr);
		          }
		        }

		        // Fire the `"change"` events.
		        if (!options.silent) this.change(options);
		        return this;
		    },has: function(attr) {
		          return getNested(this.attributes, attr) != null;
		    },change: function(options) {
		          options || (options = {});
		          var separator = DeepModel.keyPathSeparator,
		              ancestorPaths = {};
		              
		          var attr;
		          var changing = this._changing;
		          this._changing = true;

		          // Silent changes become pending changes.
		          for (attr in objToPaths(this._silent)) setNested(this._pending, attr, true);

		          // Silent changes are triggered.
		          var changes = _.extend({}, options.changes, this._silent);
		          this._silent = {};
		          for (attr in objToPaths(changes)) {
		            // Store 'ancestor' event paths to trigger later
		            var i, path = '', attrPath = attr.split(separator);
		            for (i=0 ; i<attrPath.length ; i++) {
		              ancestorPaths[path] = true;
		              path += attrPath[i] + separator;
		            }
		            // Trigger 'leaf' event
		      //      console.log('change:' + attr)
		            this.trigger('change:' + attr, this, this.get(attr), options);
		          }
		          if (changing) return this;

		          // Continue firing `"change"` events while there are pending changes.
		          while (!_.isEmpty(this._pending)) {
		            this._pending = {};
		            this.trigger('change', this, options);
		            // Pending and silent changes still remain.
		            for (attr in objToPaths(this.changed)) {
		              if (getNested(this._pending, attr) || getNested(this._silent, attr)) continue;
		              deleteNested(this.changed, attr);
		            }
		            this._previousAttributes = _.clone(this.attributes);
		          }

		          // Trigger change events for ancestors
		          for (var path in ancestorPaths) {
		            this.trigger('change:' + path + '*', this, this.get(path), options);
		          }

		          this._changing = false;
		          return this;
		        },hasChanged: function(attr) {
		          var self = this;

		          //Empty objects indicate no changes, so remove these first
		          _.each(this.changed, function(val, key) {
		            if (_.isObject(val) && _.isEmpty(val)) {
		              delete self.changed[key];
		            }
		          });

		          if (!arguments.length) return !_.isEmpty(this.changed);
		          return getNested(this.changed, attr) != null;
		        }, changedAttributes: function(diff) {
		          if (!diff) return this.hasChanged() ? _.clone(objToPaths(this.changed)) : false;
		          var val, changed = false, old = objToPaths(this._previousAttributes);
		          for (var attr in objToPaths(diff)) {
		            if (_.isEqual(old[attr], (val = diff[attr]))) continue;
		            (changed || (changed = {}))[attr] = val;
		          }

		          return changed;
		        }
		})
	})