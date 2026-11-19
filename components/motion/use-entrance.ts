'use client';

import { useEffect, useRef, useState } from 'react';
import {
  useAnimationControls,
  useInView,
  type TargetAndTransition,
  type Transition,
} from 'motion/react';
import { useFinePointer } from '@/hooks/use-fine-pointer';

type Pose = TargetAndTransition;

/**
 * In-view entrance with one pose for touch and one for a desktop pointer.
 *
 * The server and hydration always render the touch pose (both poses start invisible),
 * and a desktop pointer swaps to its own pose after mount, before the element enters.
 * So phones get a short rise while desktop keeps sideways slides and power-ons, with no
 * hydration mismatch. `settled` turns true once the entrance has finished.
 */
export function useEntrance<T extends Element = HTMLDivElement>({
  touch,
  desktop,
  show,
  transition,
  amount = 0.3,
  once = true,
}: {
  touch: Pose;
  desktop: Pose;
  show: Pose;
  transition: Transition;
  amount?: number;
  once?: boolean;
}) {
  const ref = useRef<T>(null);
  const controls = useAnimationControls();
  const inView = useInView(ref, { once, amount });
  const fine = useFinePointer();
  const shown = useRef(false);
  const [settled, setSettled] = useState(false);
  const hidden = fine ? desktop : touch;

  // Until the element has entered, hold it in the hidden pose for the current input.
  useEffect(() => {
    if (!shown.current) controls.set(hidden);
    // `hidden` only changes when the input type does.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fine, controls]);

  useEffect(() => {
    if (inView && !shown.current) {
      shown.current = true;
      controls.start({ ...show, transition }).then(() => setSettled(true));
    } else if (!inView && shown.current && !once) {
      shown.current = false;
      setSettled(false);
      controls.start({ ...hidden, transition });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, controls]);

  return { ref, controls, initial: hidden, settled };
}
