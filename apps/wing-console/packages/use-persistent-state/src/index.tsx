import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

interface StateContextProps {
  state: Map<string, Array<any>>;
  setState: (state: Map<string, Array<any>>) => void;
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

export const usePersistentState = (defaultValue?: any) => {
  const { prefix } = usePrefixStateContext();

  if (!prefix) {
    throw new Error("usePersistentState must be used within a StateProvider");
  }

  const { state, setState } = useStateContext();
  if (!state) {
    throw new Error("state must be defined");
  }

  const index = useMemo(() => {
    const value = state.get(prefix);
    if (value) {
      return value.length - 1;
    }
    return 0;
  }, [prefix, state]);

  const values = useMemo(() => {
    const value = state.get(prefix);
    if (value) {
      return value;
    }
    return [defaultValue];
  }, [defaultValue, prefix, state]);

  const updatedState = new Map(state);
  updatedState.set(prefix, values);

  const setValue = (value: any) => {
    const newValues = [...values];
    newValues[index] = value;

    const updatedState = new Map(state);
    updatedState.set(prefix, newValues);

    setState(updatedState);
  };

  const value = useMemo(() => values[index], [index, values]);

  return [value, setValue];
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
