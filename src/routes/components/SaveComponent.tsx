import {
  Button,
  FormControlLabel,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import PayloadMapper from "../../libs/PayloadMapper";
import { useState } from "react";
import BackIcon from "@mui/icons-material/ArrowBack";
import { Component } from "./ComponentsExplorer";
import muiElements from "../../specs/MuiElements.json";
import UiComponent from "./UiComponent";

interface SaveComponentProps {
  mode: "create" | "edit" | "list";
  name: string;
  setName: (name: string) => void;
  component: Component;
  onSave: (component: Component) => void;
  onBack: () => void;
}

const SaveComponent = (props: SaveComponentProps) => {
  const [component, setComponent] = useState<Component>(props.component);
  const [type, setType] = useState<"ui" | "other">(props.component.type);
  const [subType, setSubType] = useState<string | undefined>(
    props.component.subType
  );
  const [selectedPath, setSelectedPath] = useState<string>("");
  return (
    <Stack gap={4}>
      <Stack gap={2} direction="row">
        <IconButton size="small" onClick={(e) => props.onBack()}>
          <BackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ margin: "auto" }}>
          {props.mode === "edit" ? props.name : ""}
        </Typography>
        <Button
          onClick={(e) => {
            props.onSave({
              ...component,
              type,
              subType,
            });
          }}
          startIcon={<SaveIcon />}
          size="small"
          variant="contained"
        >
          Save Changes
        </Button>
      </Stack>
      {props.mode === "create" && (
        <Stack gap={2}>
          <TextField
            autoFocus
            size="small"
            label={"Component Name"}
            placeholder={"component name"}
            variant="outlined"
            value={props.name}
            onChange={(e) => props.setName(e.target.value)}
          />
          <RadioGroup
            row
            aria-labelledby="component-type-selection"
            name="component-type-selection-group"
            value={type}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const type = (event.target as HTMLInputElement).value as
                | "ui"
                | "other";
              setType(type);
            }}
          >
            <FormControlLabel value="ui" control={<Radio />} label="Ui" />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
          </RadioGroup>
          {type === "ui" && (
            <Stack gap={2}>
              <Select
                size="small"
                labelId="subtype-select-label"
                id="subtype-select"
                value={subType}
                onChange={(e) => {
                  setSubType(e.target.value);
                }}
              >
                {Object.keys(muiElements).map((a) => (
                  <MenuItem value={a}>{a}</MenuItem>
                ))}
              </Select>
            </Stack>
          )}
        </Stack>
      )}
      {type === "other" ? (
        <PayloadMapper
          onlyLeafSelection
          tree={component.tree}
          setTree={(tree) =>
            setComponent({
              ...component,
              tree,
            })
          }
          selected={selectedPath}
          setSelected={setSelectedPath}
          mappedFields={component.defaultValues}
          setMappedFields={(defaultValues) =>
            setComponent({
              ...component,
              defaultValues,
            })
          }
          requiredTypes={["json", "string", "boolean", "number"]}
        />
      ) : subType ? (
        <UiComponent
          component={component}
          setComponent={setComponent}
          uiType={subType}
          selectedPath={selectedPath}
          setSelectedPath={setSelectedPath}
        />
      ) : (
        <></>
      )}
    </Stack>
  );
};

export default SaveComponent;
