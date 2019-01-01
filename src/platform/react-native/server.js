// @flow

import { Bridge, emit } from 'yaob'

import { addEdgeCorePlugins, lockEdgeCorePlugins } from '../../modules/root.js'
import { serverApi } from './server-api.js'

window.addEdgeCorePlugins = addEdgeCorePlugins
window.lockEdgeCorePlugins = lockEdgeCorePlugins

// Display the debug heartbeat:
let status = 'loaded'
let errorStatus = ''
function showStatus () {
  const body = document.body
  if (body == null) return

  const div = document.createElement('div')
  body.appendChild(div)
  body.style.background = '#444'
  body.style.color = '#fff'
  body.style.margin = '0'
  body.style.padding = '0'

  let step = 0
  function updateStatus () {
    const steps = ['⠇', '⠋', '⠙', '⠸', '⠴', '⠦']
    step = (step + 1) % steps.length
    div.innerHTML = `${steps[step]} ${status} ${errorStatus}`
    setTimeout(updateStatus, 100)
  }
  updateStatus()
}
if (/debug=true/.test(window.location)) showStatus()

// Capture script-level errors and display them:
window.onerror = function (message, source, line, column, error) {
  errorStatus = `${source}:${line}:${column} ${message}`
  if (error != null) emit(serverApi, 'error', error)
  return false
}

// Start the object bridge:
function sendRoot () {
  if (window.originalPostMessage != null) {
    const reactPostMessage = window.postMessage
    window.postMessage = window.originalPostMessage

    window.bridge = new Bridge({
      sendMessage: message => reactPostMessage(JSON.stringify(message))
    })
    window.bridge.sendRoot(serverApi)
    status = 'sent root'
  } else {
    setTimeout(sendRoot, 100)
    status = 'waiting'
  }
}
sendRoot()
