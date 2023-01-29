import { AddCircle } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { DATA_SOURCE_TYPE, mergeDefaultValues } from "../../Constants";
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
  const [datasource, setDatasource] = useState<DataSource>({
    type: props.type,
    props: {},
  });
  const [list, setList] = useState<string[]>([]);
  const [clickedRow, setClickedRow] = useState<Row>();

  const refresh = () => {
    listDatasources(props.type, setList, (e) => {});
  };

  useEffect(() => {
    refresh();
  }, []);

  const onSave = (name: string, d: DataSource) => {
    const json = {};
    const keys = {};
    mergeDefaultValues(d.props.bodyTree, d.props.bodyDefaultValues, json, keys);
    console.log(json);
    console.log(keys);
    saveDatasource(d, props.type, name, refresh, () => {});
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
        <Box gap={2} sx={{ display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex" }}>
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
          </Box>
          <Explorer
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
        </Box>
      )}
    </Box>
  );
};

export default DatasourceExplorer;
