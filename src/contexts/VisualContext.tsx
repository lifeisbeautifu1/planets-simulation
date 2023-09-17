import { createContext, useContext, useState } from "react";

import type { RenderingType } from "@/lib/types";

interface VisualContext {
  renderingType: RenderingType;
  setRenderingType: React.Dispatch<React.SetStateAction<RenderingType>>;
}

const VisualContext = createContext<VisualContext>({
  renderingType: "planets",
  setRenderingType: () => {},
});

const VisualContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [renderingType, setRenderingType] = useState<RenderingType>("planets");

  return (
    <VisualContext.Provider
      value={{
        renderingType,
        setRenderingType,
      }}
    >
      {children}
    </VisualContext.Provider>
  );
};

export default VisualContextProvider;

export const useVisualContext = () => useContext(VisualContext);
