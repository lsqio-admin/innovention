/*!
 * backbone.iobind - Model
 * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */


/*!
 * backbone.iobind - Backbone.sync replacement
 * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

define(['underscore','backbone','bsend','conf'],function(_,Backbone,Bsend,Conf){
/*!
 * Version
 */
Backbone.Model.prototype.ioBindVersion = '0.4.3';

var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'patch':  'PATCH',
    'delete': 'DELETE',
    'read':   'GET'
  };


Backbone.Model.prototype.ioBind = function (eventName, io, callback, context) {
  var ioEvents = this._ioEvents || (this._ioEvents = {})
    , globalName = this.url() + ':' + eventName
    , self = this;
  if ('function' == typeof io) {
    context = callback;
    callback = io;
    io = this.socket || this.collection.socket || window.socket || Backbone.socket;
  }
  var event = {
    name: eventName,
    global: globalName,
    cbLocal: callback,
    cbGlobal: function (data) {
      var msg = (data.length > 0) ? Bsend.jd(data) :'';
      msg = Conf.decode ? msg : data;
      self.trigger(eventName, msg);

    }
  };

  this.bind(event.name, event.cbLocal, (context || self));
  io.on(event.global, event.cbGlobal);
  if (!ioEvents[event.name]) {
    ioEvents[event.name] = [event];
  } else {
    ioEvents[event.name].push(event);
  }
  return this;
};

Backbone.Model.prototype.ioUnbind = function (eventName, io, callback) {
  var ioEvents = this._ioEvents || (this._ioEvents = {})
    , globalName = this.url() + ':' + eventName;
  if ('function' == typeof io) {
    callback = io;
    io = this.socket ||  window.socket || Backbone.socket;
  }

  var events = ioEvents[eventName];
  if (!_.isEmpty(events)) {
    if (callback && 'function' === typeof callback) {
      for (var i = 0, l = events.length; i < l; i++) {
        if (callback == events[i].cbLocal) {
          this.unbind(events[i].name, events[i].cbLocal);
          io.removeListener(events[i].global, events[i].cbGlobal);
          events[i] = false;
        }
      }
      events = _.compact(events);
    } else {
      this.unbind(eventName);
      io.removeAllListeners(globalName);
    }
    if (events.length === 0) {
      delete ioEvents[eventName];
    }
  }
  return this;
};


Backbone.Model.prototype.ioUnbindAll = function (io) {
  var ioEvents = this._ioEvents || (this._ioEvents = {});
  if (!io) io = this.socket || window.socket || Backbone.socket;
  for (var ev in ioEvents) {
    this.ioUnbind(ev, io);
  }
  return this;
};


/*!
 * backbone.iobind - Collection
 * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Version
 */

Backbone.Collection.prototype.ioBindVersion = '0.4.3';

Backbone.Collection.prototype.ioBind = function (eventName, io, callback, context) {
  var ioEvents = this._ioEvents || (this._ioEvents = {})
    , globalName = this.url + ':' + eventName
    , self = this;
  if ('function' == typeof io) {
    context = callback;
    callback = io;
    io = this.socket || window.socket || Backbone.socket;
  }
  var event = {
    name: eventName,
    global: globalName,
    cbLocal: callback,
    cbGlobal: function (data) {
      var msg = (data.length > 0) ? Bsend.jd(data) :'';
      msg = Conf.decode ? msg : data;

      self.trigger(eventName, msg);
    }
  };
  this.bind(event.name, event.cbLocal, context);
  io.on(event.global, event.cbGlobal);
  if (!ioEvents[event.name]) {
    ioEvents[event.name] = [event];
  } else {
    ioEvents[event.name].push(event);
  }
  return this;
};

Backbone.Collection.prototype.ioUnbind = function (eventName, io, callback) {
  var ioEvents = this._ioEvents || (this._ioEvents = {})
    , globalName = this.url + ':' + eventName;
  if ('function' == typeof io) {
    callback = io;
    io = this.socket || window.socket || Backbone.socket;
  }
  var events = ioEvents[eventName];
  if (!_.isEmpty(events)) {
    if (callback && 'function' === typeof callback) {
      for (var i = 0, l = events.length; i < l; i++) {
        if (callback == events[i].cbLocal) {
          this.unbind(events[i].name, events[i].cbLocal);
          io.removeListener(events[i].global, events[i].cbGlobal);
          events[i] = false;
        }
      }
      events = _.compact(events);
    } else {
      this.unbind(eventName);
      io.removeAllListeners(globalName);
    }
    if (events.length === 0) {
      delete ioEvents[eventName];
    }
  }
  return this;
};


Backbone.Collection.prototype.ioUnbindAll = function (io) {
  var ioEvents = this._ioEvents || (this._ioEvents = {});
  if (!io) io = this.socket || window.socket || Backbone.socket;
  for (var ev in ioEvents) {
    this.ioUnbind(ev, io);
  }
  return this;
};


  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];
    var io;
    options  =  options || (options = {});
    options.attrs =  options.attrs || (options.attrs = {});
 
    //check for socket other wise send through ajax
    if(_.has(model,'socket'))
      io = model.socket;
    else if(_.has(model,'collection')){
      if(_.has(model.collection,'socket'))
        io = model.collection.socket
      else
      io = false;
    }
    else
     io = false;

    if(!io)
      options.ajax = true;

    // Default options, unless specified.
    _.defaults(options || (options = {}), {
      emulateHTTP: Backbone.emulateHTTP
      ,emulateJSON: Backbone.emulateJSON
      ,ajax : false
      ,skip : 0
      ,limit: 0
      ,select: null
      ,sort :{}
    });


    // Default JSON-request options.
    var params = {type: type, dataType: 'json'};

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = _.result(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    if(method === 'read'){
      params.data = options.data;
    }
    if( model &&( method === 'delete' || method === 'update' || method === 'patch' || method === 'allow' || method === 'lock' || method === 'unlock')){
      //console.log("id = ",model.id)
       options.attrs._id = model.id;
    }
    if (options.data == null && model && ( method === 'delete' || method === 'create' || method === 'update' || method === 'patch')) {
      params.contentType = 'application/json';
      if(_.isEmpty(options.attrs))
        params.data = JSON.stringify( model.toJSON());
      else
        params.data = JSON.stringify(options.attrs);
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (options.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }
    
    //console.log(params.data)
    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
      params.type = 'POST';
 
      if (options.emulateJSON) params.data._method = type;
      var beforeSend = options.beforeSend;
      options.beforeSend = function(xhr) {
        xhr.setRequestHeader('X-HTTP-Method-Override', type);
        if (beforeSend) return beforeSend.apply(this, arguments);
      };
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !options.emulateJSON) {
      params.processData = false;
    }

    var success = options.success;
    options.success = function(resp) {
      resp = Bsend.jd(resp)
      //console.log("the response in success",resp,options)
      if (success) success(model, resp, options);
      model.trigger('sync', model, resp, options);
    
    };

    var error = options.error;
    options.error = function(resp) {
      resp = Bsend.jd(resp)
      if (error) error(model, resp, options);
      model.trigger('error', model, resp, options);
       if(_.isFunction(options.callback)){
         options.callback(resp,model)
       }
    };

    if(io){
       io.emit( params.url.split('/')[0]+ ':' + method,{data:Bsend.je(params.data),limit:options.limit,sort:options.sort,skip:options.skip,select:options.select,decode:Conf.decode} , function (err, resp) {
        if (err) {
          options.error(err);
        } else {
          options.success(resp);
        }
        var xhr = io;
      });
    }else{
    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
    }
    model.trigger('request', model, xhr, options);
    return xhr;
  }
 

 
 


return Backbone;

})