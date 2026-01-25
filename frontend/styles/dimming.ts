/**
 * Dimming style for edit mode
 *
 * IMPORTANT: When adding new UI components to the app, you MUST apply this dimming
 * pattern to ensure visual consistency during message edit mode.
 *
 * ## Recommended approach: Use the useDimming hook
 *
 * The `useDimming` hook centralizes all dimming logic - no need to manually check
 * editingEntryId in every component:
 *
 * ```typescript
 * import { useDimming } from '../hooks/useDimming';
 * import { createDimmedStyle } from '../../styles/dimming';
 *
 * export default function MyComponent() {
 *   const dimmed = useDimming();
 *
 *   return (
 *     <View style={[styles.container, dimmed && styles.dimmed]}>
 *       <Text>Content</Text>
 *     </View>
 *   );
 * }
 *
 * const styles = StyleSheet.create({
 *   container: { padding: 10 },
 *   dimmed: createDimmedStyle(),
 * });
 * ```
 *
 * ## For list items that can be edited:
 *
 * Pass the item ID to prevent dimming the item being edited:
 *
 * ```typescript
 * const dimmed = useDimming(message.id);
 * <MessageBubble dimmed={dimmed} />
 * ```
 *
 * ## Benefits of useDimming:
 *
 * - ✅ Single source of truth for edit state
 * - ✅ Automatically handles all edge cases
 * - ✅ No manual calculations in every component
 * - ✅ Consistent behavior across the app
 *
 * ## Which components need dimming?
 *
 * ALL visible UI components should support dimming:
 * - Input fields (except the one being edited)
 * - Buttons (except save/cancel for the edited entry)
 * - Message bubbles (except the one being edited)
 * - Timestamps and metadata
 * - Date separators
 * - Navigation elements (header, menu)
 * - Any other interactive or visible elements
 */

export const DIMMED_OPACITY = 0.3;

export const createDimmedStyle = () => ({
  opacity: DIMMED_OPACITY,
});
