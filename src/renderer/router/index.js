import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const { ipcRenderer } = require('electron')

let router =  new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '/element/table',
      name: 'element-table',
      component: require('@/pages/element/Table').default
    },
    {
      path: '/element/form',
      name: 'element-form',
      component: require('@/pages/element/Form').default
    },
    {
      path: '/excel',
      name: 'excel',
      component: require('@/pages/excel/Excel').default
    },
    {
      path: '/terminal/cmd',
      name: 'terminal-cmd',
      component: require('@/pages/terminal/Cmd').default
    },
    {
      path: '/terminal/telnet',
      name: 'terminal-telnet',
      component: require('@/pages/terminal/Telnet').default
    },
    {
      path: '/terminal/ssh',
      name: 'terminal-ssh',
      component: require('@/pages/terminal/Ssh').default
    },
    {
      path: '/terminal/serialPort',
      name: 'terminal-serialPort',
      component: require('@/pages/terminal/SerialPort').default
    },
    {
      path: '/db/nedb',
      name: 'db-nedb',
      component: require('@/pages/db/Nedb').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

ipcRenderer.on('href', (event, arg) => {
  if (arg) {
      router.push({ name: arg });
  }
});

export default router;