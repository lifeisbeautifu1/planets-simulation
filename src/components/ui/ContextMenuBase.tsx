import { useCallback } from "react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/ContextMenu";
import {
  usePlanetsContext,
  useSimulationInformationContext,
  useVisualContext,
} from "@/contexts";
import { SelectedMethod, RenderingType } from "@/lib/types";

export const ContextMenuBase = () => {
  const { start, stop, clear, finishedState, dispatch, selectedMethod } =
    usePlanetsContext();

  const { setIsSimulationInformationOpen } = useSimulationInformationContext();

  const { renderingType, setRenderingType, setIsPlanetsConfigurationOpen } =
    useVisualContext();

  const openSimulationInformation = useCallback(() => {
    setIsSimulationInformationOpen(true);
  }, [setIsSimulationInformationOpen]);

  const handleRenderingTypeChange = useCallback<
    React.MouseEventHandler<HTMLDivElement>
  >(
    (e) => {
      setRenderingType(e.currentTarget.dataset.methodName as RenderingType);
    },
    [setRenderingType]
  );

  const openPlanetsConfiguration = useCallback(() => {
    setIsPlanetsConfigurationOpen(true);
  }, [setIsPlanetsConfigurationOpen]);

  const handleSolvingMethodChange = useCallback<
    React.MouseEventHandler<HTMLDivElement>
  >(
    (e) => {
      dispatch({
        type: "SET_SELECTED_METHOD",
        method:
          (e.currentTarget.dataset.methodName as SelectedMethod) ||
          ("Euler-Kramer" as const),
      });
    },
    [dispatch]
  );

  return (
    <ContextMenu>
      <ContextMenuTrigger className="fixed z-10 inset-0" />
      <ContextMenuContent className="w-64 cursor-pointer">
        <ContextMenuItem onClick={stop} inset disabled={finishedState}>
          Stop
          <ContextMenuShortcut>⇧⌘1</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={start} inset disabled={!finishedState}>
          Start
          <ContextMenuShortcut>⇧⌘2</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={clear} inset>
          Clear
          <ContextMenuShortcut>⇧⌘3</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem onClick={openSimulationInformation}>
              Simulation Information
            </ContextMenuItem>
            <ContextMenuItem onClick={openPlanetsConfiguration}>
              Planets configuration
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuRadioGroup value={renderingType}>
          <ContextMenuLabel inset>Visual</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuRadioItem
            onClick={handleRenderingTypeChange}
            data-method-name="planets"
            value="planets"
          >
            Planets
          </ContextMenuRadioItem>
          <ContextMenuRadioItem
            onClick={handleRenderingTypeChange}
            data-method-name="circles"
            value="circles"
          >
            Circles
          </ContextMenuRadioItem>
          <ContextMenuRadioItem
            onClick={handleRenderingTypeChange}
            data-method-name="circles with traces"
            value="circles with traces"
          >
            Circles with traces
          </ContextMenuRadioItem>
          <ContextMenuSeparator />
        </ContextMenuRadioGroup>
        <ContextMenuRadioGroup value={selectedMethod}>
          <ContextMenuLabel inset>Methods</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuRadioItem
            onClick={handleSolvingMethodChange}
            data-method-name="Euler"
            value="Euler"
          >
            Euler
          </ContextMenuRadioItem>
          <ContextMenuRadioItem
            onClick={handleSolvingMethodChange}
            data-method-name="Euler-Kramer"
            value="Euler-Kramer"
          >
            Euler-Kramer
          </ContextMenuRadioItem>
          <ContextMenuRadioItem
            onClick={handleSolvingMethodChange}
            data-method-name="Verlet"
            value="Verlet"
          >
            Verlet
          </ContextMenuRadioItem>
          <ContextMenuRadioItem
            onClick={handleSolvingMethodChange}
            data-method-name="Beeman"
            value="Beeman"
          >
            Beeman
          </ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
};
