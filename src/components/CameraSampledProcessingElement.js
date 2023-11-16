import { CameraBasicElement } from './CameraBasicElement.js'

class CameraSampledProcessingElement extends CameraBasicElement {
  constructor() {
    super()
    const style = document.createElement('style')
    style.textContent = `
            canvas {
              grid-area: 1 / 1 / 2 / 2;
              background-color:black;
              min-width: 100%;
              min-height: 100%;
              max-width: 100%;
              max-height: 100%;
              width: 100%;
              height: 100%;
              object-fit: cover;
              justify-self: center;
              align-self: center;
            }
            `
    this.shadow.appendChild(style)
    super.addEventListener('load', this.drawFrame.bind(this))
    this.canvas = document.createElement('canvas')
    this.canvas.width = this.width
    this.canvas.height = this.height
    // window.addEventListener('resize', this.resize.bind(this))

    this.context = this.canvas.getContext('2d')
    this.div.appendChild(this.canvas)

    this.lastProcessTime = 0

  }

  connectedCallback() {
    // this.resize()
    super.connectedCallback()
  }
  // Rate (per second) at which samples are read from the camera
  get sampleRate() {
    const sampleRate = Number(this.getAttribute('sample-rate'))
    if (!sampleRate) {
      return 24
    }
    return sampleRate
  }

  set sampleRate(value) {
    this.setAttribute('sample-rate', value)
  }

  // resize() {
  //   this.canvas.width = this.width // this.offsetWidth
  //   this.canvas.height = this.height //this.offsetHeight
  //   console.log(`resize ${this.canvas.width},${this.canvas.height}`)
  // }
  async drawFrame() {
    this.lastDrawTime = Date.now()

    // this.context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

    // const responsiveResize = (sourceCanvas, targetWidth, targetHeight) => {
    // const targetCanvas = document.createElement('canvas')
    // const targetContext = targetCanvas.getContext('2d')

    const factorWidth = this.video.videoWidth / this.canvas.width
    const factorHeight = this.video.videoHeight / this.canvas.height

    const factorResize = Math.min(factorWidth, factorHeight)

    const sourceWidth = this.video.videoWidth / (factorWidth / factorResize)
    const sourceHeight = this.video.videoHeight / (factorHeight / factorResize)

    const offsetX = (
      this.video.videoWidth - sourceWidth
    ) / 2
    const offsetY = (
      this.video.videoHeight - sourceHeight
    ) / 2

    if (!this.video.paused && (Date.now() - this.lastProcessTime) > (1000 / this.sampleRate)) {
      this.processState = await this.process(this.canvas)
      this.lastProcessTime = Date.now()
    }

    this.context.drawImage(
      this.video,
      offsetX, offsetY,
      sourceWidth, sourceHeight,
      0, 0,
      this.canvas.width, this.canvas.height,
    )
    this.draw(this.processState, this.canvas, this.context)

    requestAnimationFrame(this.drawFrame.bind(this))
  }

  async process() {
    /* Let child classes decide how to implement this */
  }

  async draw(state, canvas, context) {
    /* Let child classes decide how to implement this */
  }
}

export {
  CameraSampledProcessingElement,
}
