import { Stack } from "@mui/material";
import { useState } from "react";
import { StyledTab, StyledTabs } from "../../App";
import PayloadMapper from "../../libs/PayloadMapper";
import { Component } from "./ComponentsExplorer";
import muiElements from "../../specs/MuiElements.json";

interface UiComponentProps {
  component: Component;
  uiType: string;
  setComponent: (component: Component) => void;
  selectedPath: string;
  setSelectedPath: (path: string) => void;
}

const UiComponent = (props: UiComponentProps) => {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  console.log(props.uiType);

  //@ts-ignore
  console.log((muiElements[props.uiType] || {}).props || []);

  return (
    <Stack gap={1}>
      <StyledTabs
        value={selectedTab}
        onChange={(_, value) => setSelectedTab(value)}
      >
        <StyledTab label="Properties" />
        <StyledTab label="Actions" />
        <StyledTab label="Styles" />
      </StyledTabs>
      {selectedTab === 0 && (
        <PayloadMapper
          onlyLeafSelection
          readonly
          tree={{
            id: "0",
            name: "props",
            path: "",
            //@ts-ignore
            children: (muiElements[props.uiType] || {}).props || [],
          }}
          setTree={(tree) =>
            props.setComponent({
              ...props.component,
              tree,
            })
          }
          selected={props.selectedPath}
          setSelected={props.setSelectedPath}
          mappedFields={props.component.defaultValues}
          setMappedFields={(defaultValues) =>
            props.setComponent({
              ...props.component,
              defaultValues,
            })
          }
          requiredTypes={["json", "string", "boolean", "number"]}
        />
      )}
    </Stack>
  );
};

export default UiComponent;
