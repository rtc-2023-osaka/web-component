import { CameraBasicElement } from './components/CameraBasicElement.js'
import { CameraSampledProcessingElement } from './components/CameraSampledProcessingElement.js'
import { CameraPoseDetectionElement } from './components/CameraPoseDetectionElement.js'
import { CameraPoseCaptureElement } from './components/CameraPoseCaptureElement.js'
import { CanvasPoseDetectionElement } from './components/CanvasPoseDetectionElement.js'
import { CameraPoseCaptureSimilarityElement } from './components/CameraPoseCaptureSimilarityElement.js'
import { CameraPoseClassifierElement } from './components/CameraPoseClassifierElement.js'
import * as poseUtilities from './lib/pose-utilities.js'

import { poseSimilarity as ps } from 'posenet-similarity'

import KNN from 'ml-knn';

const mapPoseKeypoints = pose => {
  return {
    keypoints: pose.keypoints.map(point => ({
      score: point.score,
      position: {
        x: point.x,
        y: point.y,
        z: point.z,
      }
    }))
  }
}

const poseSimilarity = (pose1, pose2) => (1 - ps(mapPoseKeypoints(pose1), mapPoseKeypoints(pose2), { strategy: 'cosineDistance' }))

if (window) {
  window.CameraPoseDetectionElement = CameraPoseDetectionElement;
  window.CameraPoseCaptureElement = CameraPoseCaptureElement;
  window.CanvasPoseDetectionElement = CanvasPoseDetectionElement;
  window.CameraPoseCaptureSimilarityElement = CameraPoseCaptureSimilarityElement;
  window.CameraPoseClassifierElement = CameraPoseClassifierElement;

  window.poseSimilarity = poseSimilarity;
  window.poseUtilities = poseUtilities;

  /* Expose just for demo purposes */
  window.KNN = KNN;
}

if (!customElements.get('rtc-camera-pose-capture-similarity')) {
  customElements.define('rtc-camera-pose-capture-similarity', CameraPoseCaptureSimilarityElement);
}
if (!customElements.get('rtc-camera-pose-capture')) {
  customElements.define('rtc-camera-pose-capture', CameraPoseCaptureElement);
}
if (!customElements.get('rtc-camera-pose-detection')) {
  customElements.define('rtc-camera-pose-detection', CameraPoseDetectionElement);
}

if (!customElements.get('rtc-camera-pose-classifier')) {
  customElements.define('rtc-camera-pose-classifier', CameraPoseClassifierElement);
}
if (!customElements.get('rtc-canvas-pose-detection')) {
  customElements.define('rtc-canvas-pose-detection', CanvasPoseDetectionElement);
}

export {
  CameraBasicElement,
  CameraSampledProcessingElement,
  CameraPoseDetectionElement,
  CameraPoseCaptureElement,
  CanvasPoseDetectionElement,
  CameraPoseCaptureSimilarityElement,
  poseSimilarity,
  poseUtilities,
  KNN,
}
