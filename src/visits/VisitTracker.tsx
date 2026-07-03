import { useEffect } from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { recordVisit } from './EntityVisitStorage';

/**
 * Records a visit whenever the surrounding entity changes. Call this from any
 * component that already lives inside an `EntityLayout`/`EntityProvider`.
 */
export function useRecordEntityVisit(): void {
  const { entity } = useEntity();
  useEffect(() => {
    if (entity) recordVisit(stringifyEntityRef(entity));
  }, [entity]);
}

/**
 * Drop-in, render-nothing component that records a visit for the current
 * entity. Mount it once inside an entity page, e.g. at the top of
 * `entityPage` in `EntityPage.tsx`:
 *
 * ```tsx
 * const entityPage = (
 *   <>
 *     <VisitTracker />
 *     <EntitySwitch>{...}</EntitySwitch>
 *   </>
 * );
 * ```
 */
export const VisitTracker = (): JSX.Element | null => {
  useRecordEntityVisit();
  return null;
};
