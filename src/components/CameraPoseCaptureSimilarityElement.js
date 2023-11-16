import { poseSimilarity } from '../index.js';
import { CameraPoseCaptureElement } from './CameraPoseCaptureElement.js';

class CameraPoseCaptureSimilarityElement extends CameraPoseCaptureElement {
  constructor() {
    super()
    this.initialized = new Promise(resolve => (this.initializationResolved = resolve))
  }

  async initialize() {
    await super.initialize()
    this.src = this.getAttribute('src')
    this.initializationResolved()
  }
  set src(value) {
    this.setAttribute('src', value)
    const img = new Image();
    img.src = value
    img.onload = (async () => {
      this.canvas.width = img.width
      this.canvas.height = img.height
      await this.initialized;
      this.poseCompare = (await CameraPoseDetectionElement.detector.estimatePoses(img)).pop()

      const loadEvent = new CustomEvent('load', {
        bubbles: true,
        cancelable: false,
        composed: true,
      })

      this.dispatchEvent(loadEvent)
    }).bind(this)
  }

  get src() {
    return this.getAttribute('src')
  }

  capture() {
    const result = super.capture()
    result.score = poseSimilarity(this.poseCompare, result)
    return result
  }
}

export {
  CameraPoseCaptureSimilarityElement,
}
