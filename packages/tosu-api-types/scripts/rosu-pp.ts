// This file is derived from @kotrikd/rosu-pp
// https://github.com/MaxOhn/rosu-pp-js

export enum GameMode {
  Osu = 0,
  Taiko = 1,
  Catch = 2,
  Mania = 3,
}

export interface DifficultyAttributes {
  mode: GameMode
  stars: number
  isConvert: boolean
  aim?: number
  aimDifficultSliderCount?: number
  speed?: number
  flashlight?: number
  sliderFactor?: number
  speedNoteCount?: number
  aimDifficultStrainCount?: number
  speedDifficultStrainCount?: number
  hp?: number
  nCircles?: number
  nSliders?: number
  nLargeTicks?: number
  nSpinners?: number
  stamina?: number
  rhythm?: number
  color?: number
  reading?: number
  nFruits?: number
  nDroplets?: number
  nTinyDroplets?: number
  nObjects?: number
  nHoldNotes?: number
  ar?: number
  od?: number
  greatHitWindow?: number
  okHitWindow?: number
  mehHitWindow?: number
  monoStaminaFactor?: number
  maxCombo: number
}

export interface ScoreState {
  maxCombo?: number
  osuLargeTickHits?: number
  osuSmallTickHits?: number
  sliderEndHits?: number
  nGeki?: number
  nKatu?: number
  n300?: number
  n100?: number
  n50?: number
  misses?: number
}

export interface PerformanceAttributes {
  difficulty: DifficultyAttributes
  state?: ScoreState
  pp: number
  ppAim?: number
  ppFlashlight?: number
  ppSpeed?: number
  ppAccuracy?: number
  effectiveMissCount?: number
  estimatedUnstableRate?: number
  speedDeviation?: number
  ppDifficulty?: number
}
