const {app, BrowserWindow} = require('electron')
const url = require('url')
const path = require('path')

var cp = require('child_process');



var handleSquirrelEvent = function() {

   if (process.platform != 'win32') {

      return false;

   }



   function executeSquirrelCommand(args, done) {

      var updateDotExe = path.resolve(path.dirname(process.execPath), 

         '..', 'update.exe');

      var child = cp.spawn(updateDotExe, args, { detached: true });

      child.on('close', function(code) {

         done();

      });

   };



   function install(done) {

      var target = path.basename(process.execPath);

      executeSquirrelCommand(["--createShortcut", target], done);

   };



   function uninstall(done) {

      var target = path.basename(process.execPath);

      executeSquirrelCommand(["--removeShortcut", target], done);

   };



   var squirrelEvent = process.argv[1];

   switch (squirrelEvent) {

      case '--squirrel-install':

         install(app.quit);

         return true;

      case '--squirrel-updated':

         install(app.quit);

         return true;

      case '--squirrel-obsolete':

         app.quit();

         return true;

      case '--squirrel-uninstall':

         uninstall(app.quit);

         return true;

   }



   return false;

};



if (handleSquirrelEvent()) {

   return;
}

let win

app.commandLine.appendSwitch(
	'enable-experimental-web-platform-features'
);

function createWindow() {
	win = new BrowserWindow({width: 429, height: 443})
	win.setMenuBarVisibility(false);
	win.setResizable(false);
   	win.loadURL(url.format ({
    	pathname: path.join(__dirname, 'index.html'),
      	protocol: 'file:',
      	slashes: true
	   }))
}

app.on('ready', createWindow)

