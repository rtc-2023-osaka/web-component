
export const linesBlazePose = [
  { from: 'nose', to: 'left_eye_inner' },
  { from: 'nose', to: 'right_eye_inner' },
  { from: 'mouth_right', to: 'mouth_left' },
  { from: 'right_shoulder', to: 'left_shoulder' },
  { from: 'right_hip', to: 'left_hip' },

  ...['left', 'right'].map(prefix => [

    { from: '_eye_inner', to: '_eye' },
    { from: '_eye', to: '_eye_outer' },
    { from: '_eye_outer', to: '_ear' },

    { from: '_shoulder', to: '_elbow' },
    { from: '_elbow', to: '_wrist' },

    { from: '_wrist', to: '_thumb' },
    { from: '_wrist', to: '_index' },
    { from: '_wrist', to: '_pinky' },
    { from: '_index', to: '_pinky' },

    { from: '_shoulder', to: '_hip' },

    { from: '_hip', to: '_knee' },
    { from: '_knee', to: '_ankle' },
    { from: '_ankle', to: '_heel' },
    { from: '_ankle', to: '_foot_index' },
    { from: '_heel', to: '_foot_index' },
  ].map(keypoint => ({
    from: prefix + keypoint.from, to: prefix + keypoint.to
  }))).flat(),
]

export const drawBlazePose = (context, keypoints) => {
  /** Draw points */
  context.fillStyle = "#FF0000";
  keypoints.forEach(keypoint => {
    context.beginPath();
    context.arc(keypoint.x, keypoint.y, 10, 0, 2 * Math.PI);
    context.fill();
  })

  /** Draw lines */
  const mappedKeypoints = getMappedKeyPoints(keypoints.filter(keypoint => keypoint.score > 0.3));

  context.strokeStyle = "#FF0000";
  context.lineWidth = 5;
  linesBlazePose.filter(line => mappedKeypoints[line.from] && mappedKeypoints[line.to]).forEach(line => {
    context.beginPath();
    context.moveTo(mappedKeypoints[line.from].x, mappedKeypoints[line.from].y);
    context.lineTo(mappedKeypoints[line.to].x, mappedKeypoints[line.to].y);
    context.stroke();
  })
}

export const getAngle = (firstPoint, midPoint, lastPoint) => {
  debugger
  let result = Math.toDegrees(
    Math.atan2(
      lastPoint.y - midPoint.y,
      lastPoint.x - midPoint.x
    ) - Math.atan2(
      firstPoint.y - midPoint.y,
      firstPoint.x - midPoint.x
    )
  )
  result = Math.abs(result)

  if (result > 180) {
    result = 360.0 - result
  }
  return result
}

const opposite = side => side === 'left' ? 'right' : 'left'


const getMappedKeyPoints = keypointsArray => keypointsArray.reduce((o, keypoints) => {
  o[keypoints.name] = keypoints;
  return o
}, {});

const getBlazePoseFeatures = (pose) => {
  const result = {};

  const mappedKeypoints = getMappedKeyPoints(pose.keypoints3D.filter(keypoint => keypoint.score > 0.3));

  ['left', 'right'].forEach(side => {
    result[`angle_${side}_elbow_to_shoulder`] = get3DAngle(
      mappedKeypoints[`${opposite(side)}_shoulder`], mappedKeypoints[`${side}_shoulder`], mappedKeypoints[`${side}_elbow`]
    )

    result[`angle_${side}_elbow_to_hip`] = get3DAngle(
      mappedKeypoints[`${side}_hip`], mappedKeypoints[`${side}_shoulder`], mappedKeypoints[`${side}_elbow`]
    )

    result[`angle_${side}_wrist_to_shoulder`] = get3DAngle(
      mappedKeypoints[`${side}_shoulder`], mappedKeypoints[`${side}_elbow`], mappedKeypoints[`${side}_wrist`]
    )

    result[`angle_${side}_knee_to_hip`] = get3DAngle(
      mappedKeypoints[`${opposite(side)}_hip`], mappedKeypoints[`${side}_hip`], mappedKeypoints[`${side}_knee`]
    )

    result[`angle_${side}_knee_to_shoulder`] = get3DAngle(
      mappedKeypoints[`${side}_shoulder`], mappedKeypoints[`${side}_hip`], mappedKeypoints[`${side}_knee`]
    )

    result[`angle_${side}_ankle_to_hip`] = get3DAngle(
      mappedKeypoints[`${side}_hip`], mappedKeypoints[`${side}_knee`], mappedKeypoints[`${side}_ankle`]
    )
  })
  return result
}

const flatten = (obj) => {
  const flattened = {};

  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      const flatObject = flatten(obj[key]);
      Object.keys(flatObject).forEach((subKey) => {
        if (subKey === 'name') {
          return
        }
        flattened[`${key}_${subKey}`] = flatObject[subKey];
      });
    } else {
      flattened[key] = obj[key];
    }
  });

  return flattened;
}

export const poseToFeatures = pose => ({
  ...flatten(getMappedKeyPoints(pose.keypoints3D)),
  ...flatten(getBlazePoseFeatures(pose)),
})
const get3DDirectionRatio = (v1, v2) => {
  return {
    x: v1.x - v2.x,
    y: v1.y - v2.y,
    z: v1.z - v2.z,
  }
}

const get3DDotProduct = (v1, v2) => v1.x * v2.x + v1.y * v2.y + v1.z * v2.z

function angleBetweenVectors(vector1, vector2) {
  const dotProduct = get3DDotProduct(vector1, vector2); //vector1.x * vector2.x + vector1.y * vector2.y + vector1.z * vector2.z;
  const magnitude1 = Math.sqrt(vector1.x ** 2 + vector1.y ** 2 + vector1.z ** 2);
  const magnitude2 = Math.sqrt(vector2.x ** 2 + vector2.y ** 2 + vector2.z ** 2);
  const cosTheta = dotProduct / (magnitude1 * magnitude2);
  const theta = Math.acos(cosTheta);
  return theta * (180 / Math.PI);
}
const get3DAngle = (point1, point2, point3) => {
  if (!point1 || !point2 || !point3) {
    return undefined
  }
  // Find direction ratio of line AB
  const AB = get3DDirectionRatio(point1, point2)

  // Find direction ratio of line BC
  const BC = get3DDirectionRatio(point3, point2)

  return angleBetweenVectors(AB, BC)
}

// const get3DAngle = (point1, point2, point3) => {
//   // Find direction ratio of line AB
//   const AB = get3DDirectionRatio(point1, point2)

//   // Find direction ratio of line BC
//   const BC = get3DDirectionRatio(point3, point2)


//   // Find the dotProduct
//   // of lines AB & BC
//   const dotProduct = get3DDotProduct(AB, BC)

//   // Find magnitude of
//   // line AB and BC
//   const magnitudeAB = get3DDotProduct(AB, AB)
//   const magnitudeBC = get3DDotProduct(BC, BC)

//   // Find the cosine of
//   // the angle formed
//   // by line AB and BC

//   const angle = dotProduct / Math.sqrt(magnitudeAB * magnitudeBC)

//   // const angle = (
//   //   (
//   //     dotProduct / Math.sqrt(magnitudeAB * magnitudeBC)
//   //   ) * 180
//   // ) / Math.PI;

//   return angle

// }