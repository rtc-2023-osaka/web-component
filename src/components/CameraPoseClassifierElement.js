import { CameraPoseDetectionElement } from './CameraPoseDetectionElement.js';
import { poseToFeatures } from '../lib/pose-utilities.js';
import KNN from 'ml-knn';

class CameraPoseClassifierElement extends CameraPoseDetectionElement {
  constructor() {
    super()
    this.classification = null
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.model) {
      this.updateModelFromPath(this.model);
    }
  }

  set model(value) {
    this.setAttribute('model', value)
    if (!value) {
      this.classifier = undefined
      return
    }
    this.updateModelFromPath(value)
  }

  get model() {
    return this.getAttribute('model')
  }

  async updateModelFromPath(path) {
    const response = await fetch(path);
    const modelJson = await response.json();
    this.updateModel(modelJson)
  }
  async updateModel(modelJson) {
    this.featureArray = modelJson.featureArray;
    this.labelArray = modelJson.labelArray;
    this.classifier = KNN.load(modelJson);
  }

  async process(canvas) {
    const pose = await super.process(canvas);
    if (!pose || !this.classifier) {
      return
    }
    const features = poseToFeatures(pose)

    const classification = this.labelArray[
      this.classifier.predict(this.featureArray.map(feature => features[feature]))
    ]

    if (this.classification !== classification) {
      const classificationEvent = new CustomEvent('classification', {
        bubbles: true,
        cancelable: false,
        composed: true,
        detail: {
          classification,
        },
      })
      this.classification = classification;
      this.dispatchEvent(classificationEvent);
    }
    return pose
  }

  draw(pose, canvas, context) {
    super.draw(pose, canvas, context);
  }
}

export {
  CameraPoseClassifierElement,
}
