require('./static/app/app.module');
require('./node_modules/angular-mocks/angular-mocks');

// Include *.spec.js files
var context = require.context('./static/app', true, /.+\.spec\.js$/);
context.keys().forEach(context);