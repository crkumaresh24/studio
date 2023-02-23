import {
  Box,
  Button,
  Drawer,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import BackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import OpenQueryDataSource from "./openquery/OpenQueryDataSource";
import { DataSource } from "./DatasourceExplorer";
import HTTPDataSource from "./http/HTTPDataSource";
import OpenAPIDataSource from "./openapi/OpenAPIDataSource";
import { useEffect, useState } from "react";
import { DATA_SOURCE_TYPE, Settings } from "../../Constants";
import { PlayArrow } from "@mui/icons-material";
import { executeOpenAPI } from "../../executors/OpenAPIExecutor";
import { readSettings, readStore } from "../../services";
import JsonEditor from "../../libs/JsonEditor";
import { executeHTTP } from "../../executors/HTTPExecutor";
import { executeOpenQuery } from "../../executors/OpenQueryExecutor";

interface SaveDatasourceProps {
  mode: "create" | "edit";
  name: string;
  datasource: DataSource;
  onSave: (name: string, datasource: DataSource) => void;
  onBack: () => void;
}

const SaveDatasource = (props: SaveDatasourceProps) => {
  const [datasource, setDatasource] = useState<DataSource>(props.datasource);
  const [settings, setSettings] = useState<Settings | undefined>();
  const [store, setStore] = useState<any | undefined>();
  const [name, setName] = useState<string>(props.name);
  const [showRes, setShowRes] = useState<boolean>(false);
  const [output, setOutput] = useState<any>("");

  useEffect(() => {
    readSettings(setSettings, () => {});
    readStore(setStore, () => {});
  }, []);

  const onRunResponse = (response: string) => {
    let out = response;
    try {
      out = JSON.parse(out);
    } catch (e) {}
    setOutput(out);
    setShowRes(true);
  };

  const onRunError = (
    statusCode: number,
    statusText: string,
    response: string
  ) => {
    let out = response;
    try {
      out = JSON.parse(out);
    } catch (e) {}
    if (out) {
      setOutput(out);
    } else {
      setOutput(statusCode + " - " + statusText);
    }
    setShowRes(true);
  };

  return (
    <Stack gap={4} direction="column">
      <Stack gap={2} direction="row" alignItems={"center"}>
        <IconButton onClick={props.onBack}>
          <BackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ margin: "auto" }}>
          {props.mode === "edit" ? props.name : ""}
        </Typography>
        <Button
          disabled={!name}
          onClick={() => props.onSave(name, datasource)}
          startIcon={<SaveIcon />}
          size="small"
          variant="contained"
        >
          Save Changes
        </Button>
        <Button
          onClick={() => {
            if (
              datasource.type.toString() === DATA_SOURCE_TYPE.OPENAPI.toString()
            ) {
              settings &&
                executeOpenAPI(datasource, store, onRunResponse, onRunError);
            } else if (
              datasource.type.toString() === DATA_SOURCE_TYPE.HTTP.toString()
            ) {
              executeHTTP(datasource, store, onRunResponse, onRunError);
            } else if (
              datasource.type.toString() ===
              DATA_SOURCE_TYPE.OPENQUERY.toString()
            ) {
              executeOpenQuery(
                datasource,
                store,
                settings,
                onRunResponse,
                onRunError
              );
            }
          }}
          startIcon={<PlayArrow />}
          size="small"
          variant="contained"
        >
          Run
        </Button>
      </Stack>
      {props.mode === "create" && (
        <TextField
          autoFocus
          label={"Name"}
          placeholder={"data source name"}
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}
      {props.datasource.type.toString() ===
        DATA_SOURCE_TYPE.OPENQUERY.toString() &&
        settings && (
          <OpenQueryDataSource
            onChange={(props) => setDatasource({ ...datasource, props })}
            mode={props.mode}
            {...datasource.props}
            settings={settings}
          />
        )}
      {props.datasource.type.toString() ===
        DATA_SOURCE_TYPE.HTTP.toString() && (
        <HTTPDataSource
          onChange={(props) => setDatasource({ ...datasource, props })}
          mode={props.mode}
          {...datasource.props}
        />
      )}
      {props.datasource.type.toString() ===
        DATA_SOURCE_TYPE.OPENAPI.toString() &&
        settings && (
          <OpenAPIDataSource
            onChange={(props) => setDatasource({ ...datasource, props })}
            {...datasource.props}
            mode={props.mode}
            settings={settings}
          />
        )}

      <Drawer
        anchor={"bottom"}
        open={showRes}
        onClose={() => {
          setShowRes(false);
        }}
      >
        <Box padding={2} sx={{ minHeight: 500 }}>
          <div className="jse-theme-dark">
            <JsonEditor
              className={"json-output"}
              mode={"text"}
              content={{
                json: output || {},
              }}
              readOnly={true}
            />
          </div>
        </Box>
      </Drawer>
    </Stack>
  );
};

export default SaveDatasource;
