export type GestureState = "IDLE" | "CANDIDATE" | "CONFIRMED" | "COOLDOWN";
export type DetectedGesture = "SWIPE_RIGHT" | "SWIPE_LEFT" | "PINCH" | "SCROLL_UP" | "SCROLL_DOWN" | "NONE";

export interface Landmark {
  x: number;
  y: number;
  z: number;
}

// MediaPipe landmarks scale from 0 to 1 (relative to image width/height)
const THRESHOLD_SWIPE_X = 0.08;
const THRESHOLD_SWIPE_Y = 0.20; 

export class GestureEngine {
  private state: GestureState = "IDLE";
  private candidateGesture: DetectedGesture = "NONE";
  private startLandmarks: Landmark[] | null = null;
  private smoothedWrist: { x: number; y: number } | null = null;
  private startTime: number = 0;
  
  // Timings (in ms)
  private readonly CANDIDATE_DURATION = 180;
  private readonly COOLDOWN_DURATION = 1000; 
  private readonly POSITION_SMOOTHING = 0.35;

  private lastActionTime: number = 0;

  // Helper to check if hand is open (fingers extended)
  private isOpenPalm(landmarks: Landmark[]): boolean {
    // Check if tips are higher (smaller Y) than their respective base joints
    // Note: This assumes hand is pointing upwards. 
    const indexExtended = landmarks[8].y < landmarks[5].y;
    const middleExtended = landmarks[12].y < landmarks[9].y;
    const ringExtended = landmarks[16].y < landmarks[13].y;
    const pinkyExtended = landmarks[20].y < landmarks[17].y;
    
    return indexExtended && middleExtended && ringExtended && pinkyExtended;
  }

  public processFrame(
    landmarks: Landmark[], 
    onAction: (action: DetectedGesture) => void
  ) {
    const now = Date.now();

    if (this.state === "COOLDOWN") {
      if (now - this.lastActionTime > this.COOLDOWN_DURATION) {
        this.transitionTo("IDLE");
      }
      return; 
    }

    if (this.state === "IDLE") {
      this.startLandmarks = landmarks;
      this.smoothedWrist = { x: landmarks[0].x, y: landmarks[0].y };
      this.startTime = now;
      this.transitionTo("CANDIDATE");
      return;
    }

    if (this.state === "CANDIDATE") {
      if (!this.startLandmarks) return;

      const wrist = landmarks[0];
      const previousWrist = this.smoothedWrist ?? wrist;
      this.smoothedWrist = {
        x: previousWrist.x + (wrist.x - previousWrist.x) * this.POSITION_SMOOTHING,
        y: previousWrist.y + (wrist.y - previousWrist.y) * this.POSITION_SMOOTHING,
      };

      const timeElapsed = now - this.startTime;
      if (timeElapsed < this.CANDIDATE_DURATION) {
        return;
      }

      const filteredLandmarks = landmarks.map((landmark, index) =>
        index === 0
          ? { ...landmark, x: this.smoothedWrist!.x, y: this.smoothedWrist!.y }
          : landmark
      );
      const gesture = this.evaluateMath(this.startLandmarks, filteredLandmarks);

      if (gesture !== "NONE") {
        this.candidateGesture = gesture;
        this.transitionTo("CONFIRMED");
      } else {
        this.transitionTo("IDLE");
      }
      return;
    }

    if (this.state === "CONFIRMED") {
      onAction(this.candidateGesture);
      this.lastActionTime = now;
      this.transitionTo("COOLDOWN");
    }
  }

  private evaluateMath(start: Landmark[], current: Landmark[]): DetectedGesture {
    const wristStart = start[0];
    const wristCurrent = current[0];

    const deltaX = wristCurrent.x - wristStart.x;
    const deltaY = wristCurrent.y - wristStart.y;

    // 1. Check Horizontal Swipes (Next/Prev step)
    // REQUIREMENT: Hand must be an Open Palm to trigger swipe (avoids accidental swipes while cooking)
    if (this.isOpenPalm(current) && Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > THRESHOLD_SWIPE_X) {
      if (deltaX > 0) return "SWIPE_RIGHT";
      if (deltaX < 0) return "SWIPE_LEFT";
    }

    // 2. Check 2-Finger Vertical Swipe (Index 8 and Middle 12)
    const indexTipCurr = current[8];
    const middleTipCurr = current[12];
    
    const fingersCloseInX = Math.abs(indexTipCurr.x - middleTipCurr.x) < 0.1;
    // Ensure only 2 fingers are up (Ring and Pinky are down)
    const ringDown = current[16].y > current[13].y;
    const pinkyDown = current[20].y > current[17].y;
    
    if (fingersCloseInX && ringDown && pinkyDown && Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > THRESHOLD_SWIPE_Y) {
      if (deltaY > 0) return "SCROLL_DOWN";
      if (deltaY < 0) return "SCROLL_UP";
    }

    // 3. Pinch gesture removed temporarily as requested

    return "NONE";
  }

  private transitionTo(newState: GestureState) {
    this.state = newState;
    if (newState === "IDLE") {
      this.candidateGesture = "NONE";
      this.startLandmarks = null;
      this.smoothedWrist = null;
    }
  }

  public getState() {
    return this.state;
  }
}
