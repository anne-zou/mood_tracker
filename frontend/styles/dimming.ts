/**
 * Dimming style for edit mode
 *
 * IMPORTANT: When adding new UI components to the app, you MUST apply this dimming
 * pattern to ensure visual consistency during message edit mode.
 *
 * ## How to use:
 *
 * 1. Import the DIMMED_OPACITY constant and createDimmedStyle helper
 * 2. Add a `dimmed?: boolean` prop to your component
 * 3. Apply the dimmed style conditionally in your component
 * 4. Pass `dimmed={!!editingEntryId}` (or equivalent) from the parent
 *
 * ## Example:
 *
 * ```typescript
 * import { DIMMED_OPACITY, createDimmedStyle } from '../../styles/dimming';
 *
 * type MyComponentProps = {
 *   content: string;
 *   dimmed?: boolean;
 * };
 *
 * export default function MyComponent({ content, dimmed = false }: MyComponentProps) {
 *   return (
 *     <View style={[styles.container, dimmed && styles.dimmed]}>
 *       <Text>{content}</Text>
 *     </View>
 *   );
 * }
 *
 * const styles = StyleSheet.create({
 *   container: {
 *     padding: 10,
 *   },
 *   dimmed: createDimmedStyle(),
 * });
 * ```
 *
 * ## Which components need dimming?
 *
 * ALL leaf-level UI components that are visible during edit mode should support dimming:
 * - Input fields (except the one being edited)
 * - Buttons (except the save button for the edited entry)
 * - Message bubbles (except the one being edited)
 * - Timestamps and metadata
 * - Date separators
 * - Navigation elements (header, menu)
 * - Any other interactive or visible elements
 *
 * ## When NOT to apply dimming:
 *
 * - The input being actively edited (check `isEditing` state)
 * - Action buttons for the edited entry (save, cancel)
 *
 * ## Pattern for message list items:
 *
 * For components in message lists, use this pattern:
 * ```typescript
 * const isEditing = editingId === item.id;
 * const isAnotherEditing = editingId !== null && !isEditing;
 *
 * <MyComponent dimmed={isAnotherEditing} />
 * ```
 */

export const DIMMED_OPACITY = 0.3;

export const createDimmedStyle = () => ({
  opacity: DIMMED_OPACITY,
});
