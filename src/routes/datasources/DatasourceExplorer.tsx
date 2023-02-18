import { AddCircle, Delete } from "@mui/icons-material";
import { Box, Button, Snackbar, Stack, Typography } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useEffect, useState } from "react";
import { DATA_SOURCE_TYPE, SnackMessage } from "../../Constants";
import Explorer, { Action, Row } from "../../libs/Explorer";
import {
  listDatasources,
  readDatasource,
  removeDatasource,
  saveDatasource,
} from "../../services";
import SaveDatasource from "./SaveDataSource";

export interface DataSource {
  type: DATA_SOURCE_TYPE;
  props: any;
}

interface DatasourceExplorerProps {
  type: DATA_SOURCE_TYPE;
}

const DatasourceExplorer = (props: DatasourceExplorerProps) => {
  const [page, setPage] = useState<"list" | "create" | "edit">("list");
  const [snackMessage, setSnackMessage] = useState<SnackMessage | undefined>();
  const [datasource, setDatasource] = useState<DataSource>({
    type: props.type,
    props: {},
  });
  const [list, setList] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [clickedRow, setClickedRow] = useState<Row>();

  const refresh = () => {
    listDatasources(props.type, setList, (e) => {});
  };

  const handleSnackClose = (
    e: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackMessage(undefined);
  };

  useEffect(() => {
    refresh();
  }, []);

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
    <Box sx={{ display: "flex", flexDirection: "column", padding: 2, flex: 1 }}>
      {page === "create" && (
        <SaveDatasource
          name={""}
          mode={"create"}
          datasource={datasource}
          onBack={() => {
            refresh();
            setPage("list");
          }}
          onSave={onSave}
        />
      )}
      {page === "edit" && clickedRow && (
        <SaveDatasource
          name={clickedRow.id}
          mode={"edit"}
          datasource={datasource}
          onBack={() => {
            refresh();
            setPage("list");
          }}
          onSave={onSave}
        />
      )}
      {page === "list" && (
        <Stack gap={3} justifyContent="center">
          <Stack gap={2} direction={"row"}>
            <Button
              onClick={(e) => {
                setDatasource({
                  type: props.type,
                  props: {},
                });
                setPage("create");
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
                  setDatasource(d);
                  setClickedRow(r);
                  setPage("edit");
                },
                () => {}
              );
            }}
            secondaryActions={[
              { id: "delete", title: "Delete", startIcon: "delete" },
            ]}
            onSecondaryAction={(row: Row, action: Action) => {
              if (action.id === "delete") {
                removeDatasource(props.type, row.id, refresh, () => {});
              }
            }}
            rows={list.map((c) => ({
              id: c,
              title: c,
            }))}
          />
        </Stack>
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
    </Box>
  );
};

export default DatasourceExplorer;
