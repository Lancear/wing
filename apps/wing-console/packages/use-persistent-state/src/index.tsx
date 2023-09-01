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

export const PersistentStateProvider = (props: PropsWithChildren) => {
  const state = useRef(new Map<string, any[]>());
  return (
    <PersistentStateContext.Provider value={{ state }}>
      {props.children}
    </PersistentStateContext.Provider>
  );
};

export const createPersistentState = (prefix: string) => {
  let index = 0;
  return {
    usePersistentState: function <T>(
      initialValue: T | (() => T),
    ): [T, Dispatch<SetStateAction<T>>] {
      const [value, setValue] = useState(initialValue);
      const currentIndex = useRef(index++);

      const { state } = useContext(PersistentStateContext);
      if (!state) {
        throw new Error(
          "usePersistentState must be used within a PersistentStateProvider",
        );
      }

      useEffect(() => {
        const values = state.current.get(prefix) ?? [];
        if (values.length > currentIndex.current) {
          setValue(values[currentIndex.current]);
        }
      }, [state, currentIndex, initialValue]);

      useEffect(() => {
        return () => {
          // PROBLEM: this useEffect is called more than once
          console.log("useEffect return", { prefix, currentIndex, value });

          const newState = state.current.get(prefix) ?? [];
          newState[currentIndex.current] = value;
          state.current.set(prefix, newState);
        };
      }, [state, currentIndex, value, initialValue]);

      return [value, setValue];
    },
  };
};

export const PersistentWrapper = ({
  usePersistentState,
  value,
  children,
}: {
  usePersistentState: (value: any) => [any, Dispatch<SetStateAction<any>>];
  value: any;
  children: (value: any) => JSX.Element;
}) => {
  const [state, setState] = usePersistentState(value);

  useEffect(() => {
    if (value === state) {
      return;
    }
    return () => {
      setState(value);
    };
  }, [value, setState, state]);

  return children(state);
};
