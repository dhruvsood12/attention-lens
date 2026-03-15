import { createContext, useContext } from "react";

const ToasterContext = createContext(null);

export function Toaster() {
  return null;
}

export function useToast() {
  const c = useContext(ToasterContext);
  return c ?? { toast: () => {} };
}
