import React, { createContext, useContext, useReducer, useRef, useEffect, ReactNode } from 'react';
import { appReducer, initialAppState, AppState, AppAction } from '../reducers/appReducer';

type AppContextType = {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  mainInputRef: React.RefObject<any>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

type ContextProviderProps = {
  children: ReactNode;
};

export function ContextProvider({ children }: ContextProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialAppState);
  const mainInputRef = useRef<any>(null);

  const focusMainInput = () => {
    requestAnimationFrame(() => {
      mainInputRef.current?.focus();
    });
  };

  /**
   * Focus on the main input when the reducer sets the flag
   */
  useEffect(() => {
    if (state.shouldFocusInput) {
      focusMainInput();
      dispatch({ type: 'CLEAR_FOCUS_FLAG' });
    }
  }, [state.shouldFocusInput]);

  return (
    <AppContext.Provider value={{ state, dispatch, mainInputRef }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
