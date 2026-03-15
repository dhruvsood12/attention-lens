import { createContext, useContext, type ReactNode } from "react";

const TooltipProviderContext = createContext(null);

export function TooltipProvider({ children }: { children: ReactNode }) {
  return <TooltipProviderContext.Provider value={null}>{children}</TooltipProviderContext.Provider>;
}

export function useTooltip() {
  return useContext(TooltipProviderContext);
}
