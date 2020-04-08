let canvas
let markets
let eventsServerClient

let APP_SCHEMA_MAP = new Map()
let APP_SCHEMA_ARRAY = []

function newDashboard () {
  const MODULE_NAME = 'Dashboard'
  const ERROR_LOG = true
  const INTENSIVE_LOG = false
  const logger = newWebDebugLog()
  logger.fileName = MODULE_NAME

  let thisObject = {
    start: start
  }

  const DEBUG_START_UP_DELAY = 0 // 3000; // This is a waiting time in case there is a need to debug the very first steps of initialization, to be able to hit F12 on time.

  return thisObject

  function start () {
    try {
      setBrowserEvents()

      eventsServerClient = newEventsServerClient()
      eventsServerClient.initialize(setUpAppSchema)

      function setUpAppSchema () {
        APP_SCHEMA_ARRAY = getAppSchema()
        for (let i = 0; i < APP_SCHEMA_ARRAY.length; i++) {
          let nodeDefinition = APP_SCHEMA_ARRAY[i]
          let key = nodeDefinition.type

          APP_SCHEMA_MAP.set(key, nodeDefinition)
        }

        startCanvas()
      }

      function startCanvas () {
        /* If this method is executed for a second time, it should finalize the current execution structure */

        if (canvas !== undefined) { canvas.finalize() }

        setTimeout(delayedStart, DEBUG_START_UP_DELAY)
      }
    } catch (err) {
      if (ERROR_LOG === true) { logger.write('[ERROR] start -> err = ' + err.stack) }
    }
  }

  function delayedStart () {
    try {
            /* For now, we are supporting only one market. */

      let market = {
        id: 2,
        baseAsset: 'USDT',
        quotedAsset: 'BTC'
      }

      markets = new Map()

      markets.set(market.id, market)

      canvas = newCanvas()
      canvas.initialize()
    } catch (err) {
      if (ERROR_LOG === true) { logger.write('[ERROR] delayedStart -> err = ' + err.stack) }
    }
  }

  function setBrowserEvents () {
    window.onbeforeunload = onBrowserClosed
    function onBrowserClosed () {
      // canvas.designSpace.workspace.stopAllRunningTasks()
    }
  }
}
