import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useRef,
  MutableRefObject,
  useState,
} from "react";

const PersistentStateContext = createContext<{
  state: MutableRefObject<Map<string, any[]>>;
}>(undefined!);

const usePersistentStateContext = () => useContext(PersistentStateContext);

const usePersistentStateConsumerContext = () => {
  const context = useContext(PersistentStateConsumerContext);
  if (!context) {
    throw new Error(
      "usePersistentStateConsumerContext must be used within a PersistentStateConsumerProvider",
    );
  }
  return context;
};

export const PersistentStateProvider = (props: PropsWithChildren) => {
  const state = useRef(new Map<string, any[]>());
  return (
    <PersistentStateContext.Provider value={{ state }}>
      {props.children}
    </PersistentStateContext.Provider>
  );
};

interface PersistentStateConsumerProps {
  prefix: string;
  index?: MutableRefObject<number>;
}

const PersistentStateConsumerContext =
  createContext<PersistentStateConsumerProps>(undefined!);

export function PersistentStateConsumerProvider({
  prefix,
  children,
}: PropsWithChildren<{
  prefix: string;
}>) {
  const index = useRef(0);
  useEffect(() => {
    index.current = 0;
  }, []);
  return (
    <PersistentStateConsumerContext.Provider value={{ index, prefix: prefix }}>
      {children}
    </PersistentStateConsumerContext.Provider>
  );
}

export const usePersistentState = function <T>(
  initialValue: T | (() => T),
): [T, Dispatch<SetStateAction<T>>] {
  const { state: contextState } = usePersistentStateContext();
  const { index: contextIndex, prefix } = usePersistentStateConsumerContext();

  const [index, setIndex] = useState(-1);
  const [state, setState] = useState(initialValue);
  useEffect(() => {
    const newIndex = contextIndex!.current++;
    setIndex(newIndex);

    const values = contextState.current.get(prefix) ?? [];
    if (values.length > newIndex) {
      setState(values[newIndex]);
    }
  }, []);

  useEffect(() => {
    if (index === -1) {
      return;
    }
    return () => {
      const values = contextState.current.get(prefix) ?? [];
      values[index] = state;

      contextState.current.set(prefix, values);
    };
  }, [state, index, contextState, prefix]);

  return [state, setState];
};
