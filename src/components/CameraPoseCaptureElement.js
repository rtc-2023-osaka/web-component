import { CameraPoseDetectionElement } from './CameraPoseDetectionElement.js';

class CameraPoseCaptureElement extends CameraPoseDetectionElement {
  constructor() {
    super()
  }

  capture() {
    this.pause()
    return this.processState
  }
}

export {
  CameraPoseCaptureElement,
}
