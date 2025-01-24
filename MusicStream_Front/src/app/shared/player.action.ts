import { createAction, props } from '@ngrx/store';
import {PlayerState} from "../core/models/track.model";


export const setPlayerState = createAction(
  '[Player] Set State',
  props<{ state: PlayerState }>()
);

export const playTrack = createAction(
  '[Player] Play Track',
  props<{ trackId: string }>()
);

export const pauseTrack = createAction('[Player] Pause Track');
export const stopTrack = createAction('[Player] Stop Track');
export const setVolume = createAction(
  '[Player] Set Volume',
  props<{ volume: number }>()
);
