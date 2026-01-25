/**
 * Special ID used when the emoji editor is being edited.
 * This allows us to use the same editingEntryId field for both
 * mood entries and the emoji selector.
 */
export const EDITING_EMOJI_SELECTOR_ID = '__EMOJI_SELECTOR__';

// State type for the app-wide reducer
export type AppState = {
  userId: string | null;
  mainInput: string;
  editingEntryId: string | null;
  editingEntryText: string;
  shouldFocusInput: boolean;
};

// Action types for the app-wide reducer
export type AppAction =
  | { type: 'SET_USER_ID'; payload: string | null }
  | { type: 'SET_MAIN_INPUT'; payload: string }
  | { type: 'ADD_EMOJI_TO_MAIN_INPUT'; payload: string }
  | { type: 'CLEAR_MAIN_INPUT' }
  | { type: 'SUBMIT_MAIN_INPUT' }
  | { type: 'START_EDIT_ENTRY'; payload: { entryId: string; content: string } }
  | { type: 'SET_ENTRY_TEXT'; payload: string }
  | { type: 'SAVE_EDIT_ENTRY' }
  | { type: 'CANCEL_EDIT_ENTRY'; payload: { originalContent: string } }
  | { type: 'DELETE_ENTRY' }
  | { type: 'START_EDIT_EMOJIS' }
  | { type: 'FINISH_EDIT_EMOJIS' }
  | { type: 'CLEAR_FOCUS_FLAG' };

// Initial state
export const initialAppState: AppState = {
  userId: null,
  mainInput: '',
  editingEntryId: null,
  editingEntryText: '',
  shouldFocusInput: false,
};

// Reducer function
export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER_ID':
      return { ...state, userId: action.payload };

    case 'SET_MAIN_INPUT':
      return { ...state, mainInput: action.payload };

    case 'ADD_EMOJI_TO_MAIN_INPUT':
      return {
        ...state,
        mainInput: state.mainInput ? `${state.mainInput} ${action.payload}` : action.payload,
        shouldFocusInput: true,
      };

    case 'CLEAR_MAIN_INPUT':
      return { ...state, mainInput: '', shouldFocusInput: true };

    case 'SUBMIT_MAIN_INPUT':
      return { ...state, mainInput: '', shouldFocusInput: true };

    case 'START_EDIT_ENTRY':
      return {
        ...state,
        editingEntryId: action.payload.entryId,
        editingEntryText: action.payload.content,
      };

    case 'SET_ENTRY_TEXT':
      return { ...state, editingEntryText: action.payload };

    case 'SAVE_EDIT_ENTRY':
      return {
        ...state,
        editingEntryId: null,
        editingEntryText: '',
        shouldFocusInput: true,
      };

    case 'CANCEL_EDIT_ENTRY':
      return {
        ...state,
        editingEntryId: null,
        editingEntryText: action.payload.originalContent,
        shouldFocusInput: true,
      };

    case 'DELETE_ENTRY':
      // Clear editing state if we're deleting the entry being edited
      return {
        ...state,
        editingEntryId: null,
        editingEntryText: '',
        shouldFocusInput: true,
      };

    case 'START_EDIT_EMOJIS':
      return {
        ...state,
        editingEntryId: EDITING_EMOJI_SELECTOR_ID,
      };

    case 'FINISH_EDIT_EMOJIS':
      return {
        ...state,
        editingEntryId: null,
        shouldFocusInput: true,
      };

    case 'CLEAR_FOCUS_FLAG':
      return { ...state, shouldFocusInput: false };

    default:
      return state;
  }
}
