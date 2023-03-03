import { AddCircle, Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  Drawer,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useEffect, useState } from "react";
import { SnackMessage } from "../../Constants";
import { executeHTTP } from "../../executors/HTTPExecutor";
import { executeOpenAPI } from "../../executors/OpenAPIExecutor";
import Explorer, { Action, Row } from "../../libs/Explorer";
import JsonEditor from "../../libs/JsonEditor";
import {
  listDatasources,
  readDatasource,
  readStore,
  removeDatasource,
  saveDatasource,
} from "../../services";
import SaveDatasource from "./SaveDataSource";

export interface DataSource {
  type: string;
  props: any;
}

interface DatasourceExplorerProps {
  name: string;
  setName: (name: string) => void;
  type: string;
  page: "list" | "create" | "edit";
  setPage: (page: "list" | "create" | "edit") => void;
  datasource: DataSource;
  setDatasource: (datasource: DataSource) => void;
}

const DatasourceExplorer = (props: DatasourceExplorerProps) => {
  const [snackMessage, setSnackMessage] = useState<SnackMessage | undefined>();
  const [list, setList] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [showRes, setShowRes] = useState<boolean>(false);
  const [output, setOutput] = useState<any>("");

  const handleSnackClose = (
    e: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackMessage(undefined);
  };

  const refresh = () => {
    listDatasources(props.type, setList, (e) => {
      setList([]);
    });
  };

  useEffect(() => {
    refresh();
  }, [props.type]);

  const onSave = (name: string, d: DataSource) => {
    saveDatasource(
      {
        ...d,
        props: {
          ...d.props,
          settings: undefined,
          mode: undefined,
        },
      },
      props.type,
      name,
      () => {
        setSnackMessage({
          message: "changes saved",
          severity: "success",
        });
        refresh();
      },
      (e) => {
        setSnackMessage({
          message: e.message,
          severity: "error",
        });
      }
    );
  };

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

  const getType = () => {
    if (props.type.toString() === "2") {
      return "HTTP";
    } else if (props.type.toString() === "0") {
      return "OpenQuery";
    } else {
      return "OpenAPI";
    }
  };

  return (
    <Stack padding={1}>
      {props.page === "list" ? (
        <Stack gap={3}>
          <Stack gap={2} direction={"row"}>
            <Button
              onClick={(e) => {
                props.setDatasource({
                  type: props.type,
                  props: {},
                });
                props.setPage("create");
              }}
              startIcon={<AddCircle />}
              variant="contained"
            >
              {"Create " + getType() + " Datasource"}
            </Button>
            <Button
              disabled={selected.length === 0}
              onClick={(e) => {}}
              startIcon={<Delete />}
              variant="contained"
            >
              {"Delete Selected"}
            </Button>
            <Typography sx={{ marginLeft: "auto" }}>
              {selected.length + " selected"}
            </Typography>
          </Stack>
          <Explorer
            selectable
            showSearch
            title="Services"
            selected={selected}
            onSelectionChange={setSelected}
            onClick={(r) => {
              readDatasource(
                props.type,
                r.id,
                (d) => {
                  props.setPage("edit");
                  props.setDatasource(d);
                  props.setName(r.id);
                },
                () => {}
              );
            }}
            secondaryExpanded
            secondaryActions={[
              { id: "run", title: "Run", startIcon: "play" },
              { id: "delete", title: "Delete", startIcon: "delete" },
            ]}
            onSecondaryAction={(row: Row, action: Action) => {
              console.log(action);
              if (action.id === "delete") {
                removeDatasource(props.type, row.id, refresh, () => {});
              } else if (action.id === "run") {
                readDatasource(
                  props.type,
                  row.id,
                  (datasource) => {
                    readStore(
                      (store) => {
                        if (datasource.type === "1") {
                          executeOpenAPI(
                            datasource,
                            store,
                            onRunResponse,
                            onRunError
                          );
                        } else if (datasource.type === "0") {
                          executeHTTP(
                            datasource,
                            store,
                            onRunResponse,
                            onRunError
                          );
                        } else if (datasource.type === "3") {
                        }
                      },
                      () => {}
                    );
                  },
                  () => {}
                );
              }
            }}
            rows={list.map((c) => ({
              id: c,
              title: c,
            }))}
          />
        </Stack>
      ) : (
        <SaveDatasource
          name={props.page === "edit" ? props.name : ""}
          mode={props.page}
          datasource={props.datasource}
          onBack={() => {
            refresh();
            props.setPage("list");
          }}
          onSave={onSave}
        />
      )}
      {snackMessage && (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={snackMessage.message !== undefined}
          autoHideDuration={3000}
          onClose={handleSnackClose}
        >
          <MuiAlert severity={snackMessage.severity}>
            {snackMessage.message}
          </MuiAlert>
        </Snackbar>
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

export default DatasourceExplorer;
