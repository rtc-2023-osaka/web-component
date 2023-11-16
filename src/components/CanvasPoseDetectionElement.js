import { drawBlazePose } from "../lib/pose-utilities.js"

import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';

const model = poseDetection.SupportedModels.BlazePose

class CanvasPoseDetectionElement extends HTMLElement {
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

    this.shadow = this.attachShadow({ mode: 'open' })
    this.canvas = document.createElement('canvas')

    this.shadow.appendChild(this.canvas)
    this.shadow.appendChild(style)
  }

  connectedCallback() {
    this.initialize()
  }

  async initialize() {
    await tf.setBackend('webgl');
    this.detector = await poseDetection.createDetector(model, { runtime: 'tfjs' });
    this.src = this.getAttribute('src')
  }
  get src() {
    return this.getAttribute('src')
  }
  set src(value) {
    this.setAttribute('src', value)
    const context = this.canvas.getContext("2d")
    const img = new Image();
    img.src = value
    img.onload = (async () => {
      this.canvas.width = img.width
      this.canvas.height = img.height
      context.drawImage(img, 0, 0);

      this.pose = (await this.detector.estimatePoses(this.canvas)).pop()

      drawBlazePose(context, this.pose.keypoints)

      const loadEvent = new CustomEvent('load', {
        bubbles: true,
        cancelable: false,
        composed: true,
      })

      this.dispatchEvent(loadEvent)

    }).bind(this)
  }
}

export {
  CanvasPoseDetectionElement,
}
