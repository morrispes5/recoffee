import { LazyMotion, MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

const muatFitur = () => import('./motionFeatures').then((mod) => mod.default);

/**
 * Semua animasi memakai komponen `m` (bukan `motion`) dan fitur dimuat belakangan,
 * jadi pustaka tidak menambah bundle awal. `reducedMotion="user"` mematikan gerak
 * transform bila perangkat meminta kurangi gerakan (PRD 15.9).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={muatFitur} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
