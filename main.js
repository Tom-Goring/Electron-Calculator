const {app, BrowserWindow} = require('electron')
const url = require('url')
const path = require('path')

let win

app.commandLine.appendSwitch(
	'enable-experimental-web-platform-features'
);

function createWindow() {
   win = new BrowserWindow({width: 429, height: 500})
   win.setMenuBarVisibility(false);
   win.setResizable(false);
   win.loadURL(url.format ({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
   }))
}

app.on('ready', createWindow)

