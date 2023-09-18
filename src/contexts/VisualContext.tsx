import { createContext, useContext, useState } from "react";

import type { RenderingType } from "@/lib/types";

interface VisualContext {
  renderingType: RenderingType;
  setRenderingType: React.Dispatch<React.SetStateAction<RenderingType>>;
  isPlanetsConfigurationOpen: boolean;
  setIsPlanetsConfigurationOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const VisualContext = createContext<VisualContext>({
  renderingType: "planets",
  setRenderingType: () => {},
  isPlanetsConfigurationOpen: false,
  setIsPlanetsConfigurationOpen: () => {},
});

const VisualContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [renderingType, setRenderingType] = useState<RenderingType>("planets");

  const [isPlanetsConfigurationOpen, setIsPlanetsConfigurationOpen] =
    useState(false);

  return (
    <VisualContext.Provider
      value={{
        renderingType,
        setRenderingType,
        isPlanetsConfigurationOpen,
        setIsPlanetsConfigurationOpen,
      }}
    >
      {children}
    </VisualContext.Provider>
  );
};

export default VisualContextProvider;

export const useVisualContext = () => useContext(VisualContext);
