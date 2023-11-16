import { CameraSampledProcessingElement } from './CameraSampledProcessingElement.js';
import { drawBlazePose } from '../lib/pose-utilities.js';

import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';

const model = poseDetection.SupportedModels.BlazePose


class CameraPoseDetectionElement extends CameraSampledProcessingElement {
  static detector = null
  constructor() {
    super()
    this.initialize()
  }

  async initialize() {
    if (CameraPoseDetectionElement.detector) {
      return
    }

    await tf.setBackend('webgl');
    CameraPoseDetectionElement.detector = await poseDetection.createDetector(model, { runtime: 'tfjs' });
  }

  async process(canvas) {
    super.process();

    if (!canvas.width || !canvas.height || !CameraPoseDetectionElement.detector) {
      return
    }

    const pose = (await CameraPoseDetectionElement.detector.estimatePoses(canvas)).pop()
    if (!pose) {
      return
    }
    return {
      keypoints: pose.keypoints,
      keypoints3D: pose.keypoints3D,
    }
  }

  draw(pose, canvas, context) {
    if (!pose || !pose.keypoints) {
      console.log('Returning due to empty keypoints')
      return
    }

    drawBlazePose(context, pose.keypoints);
  }

  capture() {

  }
}

export {
  CameraPoseDetectionElement,
}
