nforce-express
==============

express.js plugin for nforce. This plugin provides an express/connnect
middleware factory that automatically handles the OAuth 2.0 callback
from Salesforce.

## Usage

Installation

```
npm install nforce nforce-express
```

```js
var nforce = require('nforce');

// load the plugin
require('nforce-express')(nforce);

var org = nforce.createConnection({
  clientId: '{{clientId}}',
  clientSecret: '{{clientId}}',
  redirectUri: 'http://localhost:3000/oauth/_callback',
  plugins: ['express']
});
```

Then when your express application is set up, you can load
the middleware. The middleware listens for OAuth callbacks from
a web server flow and will automatically complete the required
POST request for an `access_token`.

```js
// add the middleware to the stack
app.use(org.express.oauth({
  onSuccess: '/test/query',
  onError: '/oauth/error'
}));

// create a route to start the flow
app.get('/oauth/authorize', function(req, res){
  return res.redirect(org.getAuthUri());
});
```

The resulting OAuth object will be stored on the session. This means that
**you must be using sessions in your express app**!

## API

### express.oauth(opts)

Returns express/connect middleware for handling the OAuth callback from
Salesforce.

opts:

* `onSuccess`: (String:Optional) A URI to the route to redirect to when
the OAUth callback and POST is successful
* `onError`: (String:Optional) A URI to the route to redirect to when
the OAUth callback and POST is not successful
