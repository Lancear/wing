import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface StateContextProps {
  storeNewState?: (prefix: string, value: any) => number;
  getState?: (prefix: string, index?: number) => any;
  setState?: (prefix: string, index: number, value: any) => void;
}

const StateContext = createContext<StateContextProps>({
  storeNewState: () => 0,
  getState: () => {},
  setState: () => {},
});

const useStateContext = () => useContext(StateContext);

export const StateProvider = ({
  children,
}: PropsWithChildren<StateContextProps>) => {
  const [internalState, setInternalState] = useState<Map<string, Array<any>>>(
    new Map(),
  );

  const setState = useCallback(
    (prefix: string, index: number, value: any) => {
      const updatedState = new Map(internalState);
      const currentValue = updatedState.get(prefix);

      if (currentValue) {
        currentValue[index] = value;
      }
      updatedState.set(prefix, currentValue || [value]);
      setInternalState(updatedState);
    },
    [internalState],
  );

  const getState = useCallback(
    (prefix: string, index?: number) => {
      const value = internalState.get(prefix);
      if (value) {
        return index === undefined ? value : value[index];
      }
      return;
    },
    [internalState],
  );

  const storeNewState = useCallback(
    (prefix: string, value?: string) => {
      const state = getState(prefix);
      const index = state ? state.length - 1 : 0;
      setState(prefix, index, value);
      return index;
    },
    [getState, setState],
  );

  return (
    <StateContext.Provider
      value={{
        getState,
        setState,
        storeNewState,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const usePersistentState = function <T>(
  defaultValue?: T | (() => T),
): [T, Dispatch<SetStateAction<T>>] {
  const { prefix } = usePrefixStateContext();

  if (!prefix) {
    throw new Error("usePersistentState must be used within a StateProvider");
  }

  const { getState, setState, storeNewState } = useStateContext();
  if (!getState || !setState || !storeNewState) {
    throw new Error("usePersistentState must be used within a StateProvider");
  }

  const [index] = useState(() => {
    return storeNewState(prefix, defaultValue);
  });

  const setValue: Dispatch<SetStateAction<T>> = (value: SetStateAction<T>) => {
    setState(prefix, index, value);
  };

  const value = useMemo(() => {
    return getState(prefix, index) ?? defaultValue;
  }, [index, prefix, getState, defaultValue]);
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
