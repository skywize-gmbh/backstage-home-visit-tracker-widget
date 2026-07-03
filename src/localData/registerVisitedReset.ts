import { registerLocalDataReset } from './registry';
import { clearAll } from '../visits/EntityVisitStorage';

/**
 * Registers this plugin's own row in the shared "Local data" settings tab.
 * Imported for its side effect by both the legacy and New-Frontend-System
 * entry points, so the row appears however the plugin is installed.
 */
registerLocalDataReset({
  id: 'visited-entities',
  title: 'Visited entities',
  description:
    'The data behind the “Top Visited” and “Recently Visited” homepage widgets.',
  buttonLabel: 'Clear',
  successMessage: 'Visited entities cleared.',
  order: 10,
  action: () => clearAll(),
});
