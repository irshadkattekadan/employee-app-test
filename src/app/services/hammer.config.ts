import { Injectable } from '@angular/core';
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';
import * as Hammer from 'hammerjs';

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  override overrides = {
    swipe: { direction: Hammer.DIRECTION_HORIZONTAL }, // Only horizontal swipe
    pinch: { enable: false },
    rotate: { enable: false }
  };

  override options = {
    cssProps: {
      touchAction: 'pan-y'
    }
  };
}