
export enum AnimationPhase {
  IDLE = 'IDLE',
  COUNTDOWN_3 = '3',
  COUNTDOWN_2 = '2',
  COUNTDOWN_1 = '1',
  HAPPY_NEW_YEAR = 'HAPPY_NEW_YEAR',
  NAME = 'NAME',
  ATTRIBUTES = 'ATTRIBUTES',
  WISH_1 = 'WISH_1',
  WISH_2 = 'WISH_2',
  HEART = 'HEART',
  FINAL_MESSAGE = 'FINAL_MESSAGE'
}

export interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  targetX: number;
  targetY: number;
  color: string;
  size: number;
  vx: number;
  vy: number;
  friction: number;
  ease: number;
}
