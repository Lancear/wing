import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface StateContextProps {
  state?: Map<string, Array<any>>;
  setState?: (state: Map<string, Array<any>>) => void;
}

const StateContext = createContext<StateContextProps>({
  state: new Map<string, Array<any>>(),
  setState: () => {},
});

const useStateContext = () => useContext(StateContext);

export const StateProvider = ({
  children,
}: PropsWithChildren<StateContextProps>) => {
  const [state, setState] = useState<Map<string, Array<any>>>(new Map());

  return (
    <StateContext.Provider
      value={{
        state,
        setState,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const usePersistentState = function <T>(
  defaultValue?: T | (() => T),
  index: number = 0,
): [T, Dispatch<SetStateAction<T>>] {
  const { prefix } = usePrefixStateContext();

  if (!prefix) {
    throw new Error("usePersistentState must be used within a StateProvider");
  }

  const { state, setState } = useStateContext();
  if (!state || !setState) {
    throw new Error("usePersistentState must be used within a StateProvider");
  }

  const setValue = useCallback(
    (value: SetStateAction<T>) => {
      const updatedState = new Map(state);
      const currentValue = updatedState.get(prefix);

      if (currentValue) {
        currentValue[index] = value;
      }
      updatedState.set(prefix, currentValue || [value]);
      setState(updatedState);
    },
    [prefix, index, state, setState],
  );

  const value = useMemo(() => {
    return state.get(prefix)?.[index] || defaultValue;
  }, [index, prefix, state, defaultValue]);

  return [value as T, setValue];
};

interface PrefixStateProviderProps {
  prefix: string;
}

const PrefixStateContext = createContext<PrefixStateProviderProps | undefined>(
  undefined,
);

const usePrefixStateContext = () => {
  const context = useContext(PrefixStateContext);
  if (!context) {
    throw new Error(
      "usePrefixStateContext must be used within a PrefixStateProvider",
    );
  }
  return context;
};

export const PrefixStateProvider = ({
  prefix,
  children,
}: PropsWithChildren<PrefixStateProviderProps>) => {
  return (
    <PrefixStateContext.Provider value={{ prefix }}>
      {children}
    </PrefixStateContext.Provider>
  );
};
