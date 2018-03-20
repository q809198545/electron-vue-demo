import {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  shell,
  dialog
} from 'electron'
import {
  autoUpdater
} from "electron-updater"
var config = require('../../package.json');
autoUpdater.autoDownload = false; //默认true，禁止自动更新
var downloading = false;

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080` :
  `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

const template = [{
    label: 'landing-page',
    click() {
       mainWindow.webContents.send('href', 'landing-page');
    }
  }, {
    label: 'element ui',
    submenu: [{
        label: 'Table 表格',
        click() {
           mainWindow.webContents.send('href', 'element-table');
        }
      },
      {
        label: 'Form 表单',
        click() {
           mainWindow.webContents.send('href', 'element-form');
        }
      },
      {
        label: '更多组件',
        click() {
          shell.openExternal('http://element-cn.eleme.io/#/zh-CN/component/');
        }
      }
    ]
  },
  {
    label: 'Excel',
    click() {
      mainWindow.webContents.send('href', 'excel');
    }
  },
  {
    label: '终端',
    submenu: [{
        label: 'cmd',
        click() {
           mainWindow.webContents.send('href', 'terminal-cmd');
        }
      },
      {
        label: 'telnet',
        click() {
           mainWindow.webContents.send('href', 'terminal-telnet');
        }
      },
      {
        label: 'ssh',
        click() {
           mainWindow.webContents.send('href', 'terminal-ssh');
        }
      },
      {
        label: '串口',
        click() {
           mainWindow.webContents.send('href', 'terminal-serialPort');
        }
      }
    ]
  },
  {
    label: '存储',
    submenu: [{
        label: '本地存储',
        click() {}
      },
      {
        label: '数据库nedb',
        click() {}
      }
    ]
  },
  {
    label: '调试',
    submenu: [{
        label: '刷新',
        role: 'reload'
      },
      {
        label: '全屏',
        role: 'togglefullscreen'
      },
      {
        label: '用户数据',
        click() {
          shell.showItemInFolder(app.getPath('userData'));
        }
      },
      {
        label: '开发者工具',
        role: 'toggledevtools'
      }
    ]
  },
  {
    label: '帮助',
    submenu: [{
        label: '检查更新',
        click() {
          if (!downloading && process.env.NODE_ENV !== 'development') {
            autoUpdater.checkForUpdates();
          }
        }
      },
      {
        label: '关于',
        click() {
          let message = '    作者：' + config.author + '\n  CSDN：' + config.license + '\n    版本：' + app.getVersion();
          dialog.showMessageBox({
            type: 'info',
            title: config.description,
            message: message
          })
        }
      }
    ]
  }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

// 检查更新
function updateHandle() {
  // 监听检查更新出错事件
  autoUpdater.on('error', function (error) {
    sendUpdateMessage('检查更新出错');
  });
  // 监听正在检查更新事件
  autoUpdater.on('checking-for-update', function () {
    //sendUpdateMessage('正在检查更新……');
  });
  // 监听不需要更新事件
  autoUpdater.on('update-not-available', function (info) {
    sendUpdateMessage('已经是最新版本' + info.version);
  });
  // 监听需要更新事件
  autoUpdater.on('update-available', function (info) {
    mainWindow.webContents.send('updateAvailable', '<h3>检测到新版本' + info.version + '，需要升级？</h3>' + info.releaseNotes);
  });
  // 监听下载进度事件
  autoUpdater.on('download-progress', function (progressObj) {
    downloading = true;
    mainWindow.webContents.send('downloadProgress', progressObj);
  })
  //监听下载完成事件
  autoUpdater.on('update-downloaded', function (info) {
    downloading = false;
    //监听渲染线程中用户是否应用更新
    ipcMain.on('isUpdateNow', () => {
      autoUpdater.quitAndInstall();
    });
    mainWindow.webContents.send('isUpdateNow');
  });
  //监听渲染线程中用户是否同意下载
  ipcMain.on("isDownload", () => {
    autoUpdater.downloadUpdate();
  })

  ipcMain.on("checkForUpdate", () => {
    if (process.env.NODE_ENV !== 'development') {
      //执行自动检查更新
      autoUpdater.checkForUpdates();
    }
  })
}

function sendUpdateMessage(text) {
  mainWindow.webContents.send('message', text);
}