module.exports = function(nforce, pluginName) {

  // plugin definition
  var plugin = nforce.plugin(pluginName || 'express');

  plugin.fn('oauth', function(opts){

    var self = this;
    var matchUrl = url.parse(this.redirectUri);

    if(opts.onSuccess && opts.onSuccess.substring(0,1) !== '/') {
      opts.onSuccess = '/' + opts.onSuccess;
    }

    if(opts.onError && opts.onError.substring(0,1) !== '/') {
      opts.onError = '/' + opts.onError;
    }

    // return the middleware
    return function(req, res, next) {

      if(req.session && req.query.code) {
        var url = req.url.replace(/\?.*/i, '').replace(/\/$/, '');
        if(matchUrl.pathname == url) {
          // its an oauth callback
          self.authenticate({ code: req.query.code}, function(err, resp){
            if(!err) {
              req.session.oauth = resp;
              if(opts.onSuccess) {
                res.redirect(opts.onSuccess);
              } else {
                res.redirect('/');
              }
            } else {
              if(opts.onError) {
                res.redirect(opts.onError);
              } else {
                next();
              }
            }
          });
        }
      } else {
        next();
      }
    };
  });

};
