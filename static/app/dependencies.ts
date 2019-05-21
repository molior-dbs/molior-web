// Mandatory Angular Stuff
import 'angular';
import 'angular-animate';
import 'angular-aria';
import 'angular-material';
import 'angular-material-icons';
import 'angular-material/angular-material.css';
import 'angular-messages';
import 'angular-sanitize';

// Mandatory ui router
import '@uirouter/angularjs';

// Angular Data table
import 'angular-material-data-table';
import 'angular-material-data-table/dist/md-data-table.css';

// FIXME: Really needed?
import 'chart.js';
import 'angular-chart.js';

// Stepper in material design for angular
import 'material-steppers';
import 'material-steppers/dist/material-steppers.css';

// FIXME: Implement yourself
import 'ngclipboard';
// Websocket for angular
import 'ngSocket/dist/ngSocket';
// Sticky element for angular
import 'ngsticky';
import 'rx';
import 'rx-angular';

// Markdown to HTML
import 'showdown';
import 'ng-showdown';

// FIXME: Refactor to angular-material toasts
import 'toastr/build/toastr.css';

// Code syntax highlighting
import 'codemirror';
import '../../node_modules/codemirror/lib/codemirror.css';
import 'angular-ui-codemirror';
import * as CodeMirror from 'codemirror';
(window as any).CodeMirror = CodeMirror;
