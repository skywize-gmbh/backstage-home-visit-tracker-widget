import { createPlugin } from '@backstage/core-plugin-api';
import { createCardExtension } from '@backstage/plugin-home-react';

import { MostVisitedContent } from './components/MostVisitedContent';
import { RecentlyVisitedContent } from './components/RecentlyVisitedContent';

// Registers this plugin's "Visited entities" row in the shared Local data tab.
import './localData/registerVisitedReset';

/**
 * Legacy (classic frontend system) plugin for the "visited entities" feature.
 */
export const visitedPlugin = createPlugin({
  id: 'visited',
});

/**
 * "Top Visited" homepage card — entities ordered by visit count.
 * Add it to your home page grid like any other `@backstage/plugin-home` card.
 */
export const MostVisitedCard = visitedPlugin.provide(
  createCardExtension({
    name: 'MostVisitedCard',
    title: 'Top Visited',
    components: async () => ({ Content: MostVisitedContent }),
    layout: {
      width: { minColumns: 4, defaultColumns: 6 },
      height: { minRows: 3, defaultRows: 6 },
    },
  }),
);

/**
 * "Recently Visited" homepage card — entities ordered by most recent visit.
 */
export const RecentlyVisitedCard = visitedPlugin.provide(
  createCardExtension({
    name: 'RecentlyVisitedCard',
    title: 'Recently Visited',
    components: async () => ({ Content: RecentlyVisitedContent }),
    layout: {
      width: { minColumns: 4, defaultColumns: 6 },
      height: { minRows: 3, defaultRows: 6 },
    },
  }),
);
