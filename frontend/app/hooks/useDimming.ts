import { useAppContext } from '../context/AppContext';

/**
 * Custom hook to centralize dimming logic
 *
 * Returns whether the current component should be dimmed based on edit state.
 *
 * @param itemId - Optional ID of the item this component represents.
 *                 If provided, the component won't be dimmed when this item is being edited.
 * @returns boolean indicating if the component should be dimmed
 *
 * @example
 * // For components that should always dim when anything is being edited
 * const dimmed = useDimming();
 * <View style={[styles.container, dimmed && styles.dimmed]} />
 *
 * @example
 * // For items that shouldn't dim themselves when they're being edited
 * const dimmed = useDimming(message.id);
 * <MessageBubble dimmed={dimmed} />
 */
export function useDimming(itemId?: string | null): boolean {
  const { state } = useAppContext();

  // If nothing is being edited, nothing should be dimmed
  if (!state.editingEntryId) {
    return false;
  }

  // If an itemId is provided and it matches the editing entry, don't dim
  if (itemId && state.editingEntryId === itemId) {
    return false;
  }

  // Otherwise, dim the component
  return true;
}
