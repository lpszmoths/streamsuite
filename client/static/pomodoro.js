const TIMER_DURATION = 25 * 60 * 1000 // milliseconds
const MARGIN = 16 // px
const LINE_THICKNESS = 1 // px
const LINE_HALOS = [1, 2, 3, 5, 9] // px
const INDICATOR_RADIUS = 2 // px

const startTime = (new Date()).getTime()
let isRunning = false
let textContainer
let canvas, ctx, buffer, bufferCtx
let w, h
let radius
let fgColor
let timeElapsed, timeRemaining

function start() {
  const hashProps = getHashProps()

  textContainer = document.getElementById('overlay')

  canvas = document.getElementById('c')
  ctx = canvas.getContext('2d')

  buffer = document.createElement('canvas')
  bufferCtx = buffer.getContext('2d')

  fgColor = getComputedStyle(textContainer).color
  console.log(fgColor)
  if (hashProps['fgColor']) {
    fgColor = hashProps['fgColor']
  }

  updateSize()
  window.addEventListener(
    'resize',
    () => {
      updateSize()
    }
  )

  isRunning = true
  step()
  microstep()
}

function getHashProps() {
  if (window.location.hash) {
    const hashParts = window.location.hash
      .replace(
        /^#/,
        ''
      )
      .split(',')
      .reduce(
        (
          prev,
          current,
          i
        ) => {
          const [k, v] = current.split('=')
          prev[k] = v
          return prev
        },
        {}
      )
    return hashParts
  }
  return {}
}

function step() {
  if (!isRunning) {
    return
  }

  const currentTime = (new Date()).getTime()
  timeElapsed = currentTime - startTime
  timeRemaining = TIMER_DURATION - timeElapsed
  
  if (timeRemaining > 0) {
    drawTimer(timeElapsed / TIMER_DURATION)
    drawTimerIndicator()
    updateText(timeRemaining)

    setTimeout(
      step, 1000
    )
  }
  else {
    clear()
    drawTimer(1)
    blitBuffer()
    setText('<small>BREAK</small>')
    isRunning = false
  }
}

function microstep() {
  if (!isRunning) {
    return
  }

  drawTimerIndicator()

  setTimeout(
    microstep,
    125
  )
}

function clear() {
  ctx.clearRect(
    0, 0,
    w, h
  )
}

function blitBuffer() {
  ctx.drawImage(
    buffer,
    0, 0
  )
}

function drawTimer(f) {
  bufferCtx.clearRect(
    0, 0,
    w, h
  )

  bufferCtx.save()
  bufferCtx.translate(w / 2, h / 2)
  bufferCtx.rotate(-Math.PI / 2)
  bufferCtx.translate(-w / 2, -h / 2)

  const angle = Math.PI * 2 * f
  
  forEachLineHalo((haloThickness, alpha) => {
    bufferCtx.strokeStyle = fgColor
    bufferCtx.lineWidth = LINE_THICKNESS + haloThickness
    bufferCtx.globalAlpha = alpha
    drawTimerArc(angle)
  })
  
  bufferCtx.lineWidth = LINE_THICKNESS
  bufferCtx.globalAlpha = 1
  drawTimerArc(angle)
  bufferCtx.beginPath()
  bufferCtx.arc(
    w / 2,
    h / 2,
    radius,
    angle,
    false
  )
  bufferCtx.strokeStyle = fgColor
  bufferCtx.lineWidth = LINE_THICKNESS
  bufferCtx.stroke()
  bufferCtx.restore()
  clear()
  blitBuffer()
}

function drawTimerIndicator() {
  const angle = Math.PI * 2 * (
    timeElapsed / TIMER_DURATION
  )
  const t = (new Date().getMilliseconds()) / 1000
  const scale = 1 + Math.abs(
    Math.sin(
      Math.PI * t
    )
  ) * 0.5

  clear()
  blitBuffer()

  ctx.save()
  ctx.translate(w / 2, h / 2)
  ctx.rotate(angle)

  ctx.fillStyle = fgColor
  forEachLineHalo((haloThickness, alpha) => {
    ctx.globalAlpha = alpha
    drawTimerIndicatorDot(
      INDICATOR_RADIUS + haloThickness,
      scale
    )
  })

  ctx.globalAlpha = 1
  drawTimerIndicatorDot(
    INDICATOR_RADIUS,
    scale
  )

  ctx.restore()
}

function forEachLineHalo(fn) {
  const numHalos = LINE_HALOS.length
  const baseAlpha = 0.5 / numHalos
  LINE_HALOS.forEach(
    (haloThickness, i) => {
      const f = (i + 1) / numHalos
      const alpha = baseAlpha / f
      fn(haloThickness, alpha)
    }
  )
}

function drawTimerArc(angle) {
  bufferCtx.beginPath()
  bufferCtx.arc(
    w / 2,
    h / 2,
    radius,
    angle,
    false
  )
  bufferCtx.stroke()
}

function drawTimerIndicatorDot(radius, scale) {
  ctx.save()
  ctx.translate(
    0,
    -(h / 2 - MARGIN)
  )
  ctx.scale(scale, scale)
  ctx.beginPath()
  ctx.arc(
    0,
    0,
    radius,
    Math.PI * 2,
    false
  )
  ctx.fillStyle = fgColor
  ctx.fill()
  ctx.restore()
}

function updateText(timeRemaining) {
  const minsRemaining = Math.floor(
    timeRemaining / (60 * 1000)
  )
  let text = minsRemaining
  if (minsRemaining < 1) {
    const secsRemaining = Math.floor(
      timeRemaining / 1000
    )
    text = secsRemaining
  }
  setText(text)
}

function updateSize() {
  w = canvas.clientWidth
  h = canvas.clientHeight
  canvas.width = w
  canvas.height = h
  radius = Math.min(w, h) / 2 - MARGIN
  buffer.width = w
  buffer.height = h
  console.log(
    `Size set to ${w}x${h}`
  )
}

function setText(text) {
  textContainer.innerHTML = text
}