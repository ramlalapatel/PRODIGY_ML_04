export type GestureId = 
  | '01_palm'
  | '02_l'
  | '03_fist'
  | '04_fist_moved'
  | '05_thumb'
  | '06_index'
  | '07_ok'
  | '08_palm_moved'
  | '09_c'
  | '10_down';

export interface GestureMeta {
  id: GestureId;
  name: string;
  code: string;
  shortName: string;
  folderName: string;
  description: string;
  kinematicDescription: string;
  hciAction: {
    system: string;
    mediaAction: string;
    cadAction: string;
    robotAction: string;
  };
  sampleCount: number;
  accuracy: number;
  svgIcon: string;
}

export interface HandLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface DetectionResult {
  gesture: GestureId;
  confidence: number;
  probabilities: Record<GestureId, number>;
  landmarks: HandLandmark[];
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  palmCenter: { x: number; y: number };
  fingerStates: {
    thumb: boolean;
    index: boolean;
    middle: boolean;
    ring: boolean;
    pinky: boolean;
  };
  pinchDistance: number;
  angleDegrees: number;
  motionVelocity: { dx: number; dy: number };
  fps: number;
  latencyMs: number;
}

export interface LeapSubjectSample {
  subjectId: string;
  gestureId: GestureId;
  frameIndex: number;
  filename: string;
  infraredIntensity: number;
}
