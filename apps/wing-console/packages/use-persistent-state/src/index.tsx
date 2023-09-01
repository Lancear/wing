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

export const PersistentStateProvider = (props: PropsWithChildren) => {
  const state = useRef(new Map<string, any[]>());
  return (
    <PersistentStateContext.Provider value={{ state }}>
      {props.children}
    </PersistentStateContext.Provider>
  );
};

export const useCreatePersistentState = (prefix: string) => {
  let index = 0;
  return {
    usePersistentState: function <T>(
      initialValue: T | (() => T),
    ): [T, Dispatch<SetStateAction<T>>] {
      const { state: contextState } = usePersistentStateContext();
      const [value, setValue] = useState(initialValue);

      const [newIndex] = useState(index++);

      useEffect(() => {
        const values = contextState.current.get(prefix) ?? [];
        if (values.length > newIndex) {
          setValue(values[newIndex]);
          return;
        }
      }, []);

      useEffect(() => {
        if (index === -1) {
          return;
        }
        return () => {
          if (value === initialValue) {
            return;
          }
          const state = contextState.current.get(prefix) ?? [];
          state[newIndex] = value;
          contextState.current.set(prefix, state);
        };
      }, [contextState, value, newIndex, initialValue]);

      return [value, setValue];
    },
  };
};
