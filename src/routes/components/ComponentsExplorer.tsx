import { AddCircle } from "@mui/icons-material";
import { Box, Button, Paper, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { rootTree } from "../../Constants";
import Explorer, { Action, Row } from "../../libs/Explorer";
import { DATA } from "../../libs/ValueAssigner";
import { TreeNode } from "../../libs/PayloadMapper";
import {
  listComponents,
  readComponent,
  removeComponent,
  saveComponent,
} from "../../services";
import SaveComponent from "./SaveComponent";

export interface Component {
  tree: TreeNode;
  defaultValues: Record<string, DATA>;
}

const ComponentsExplorer = () => {
  const [page, setPage] = useState<"list" | "create" | "edit">("list");
  const [component, setComponent] = useState<Component>({
    tree: rootTree,
    defaultValues: {},
  });
  const [list, setList] = useState<string[]>([]);
  const [clickedRow, setClickedRow] = useState<Row>();

  const refresh = () => {
    listComponents(setList, (e) => {});
  };

  useEffect(() => {
    refresh();
  }, []);

  const onSave = (name: string, c: Component) => {
    saveComponent(c, name, refresh, () => {});
  };

  return (
    <Stack sx={{ maxWidth: "60%", margin: "auto" }}>
      <Paper sx={{ minHeight: "calc(100vh - 64px)", padding: 3 }}>
        {page === "create" && (
          <SaveComponent
            name=""
            component={component}
            onSave={onSave}
            onBack={() => {
              setComponent({
                tree: rootTree,
                defaultValues: {},
              });
              setPage("list");
            }}
          />
        )}
        {page === "edit" && clickedRow && (
          <SaveComponent
            name={clickedRow.id}
            component={component}
            onSave={onSave}
            onBack={() => {
              setComponent({
                tree: rootTree,
                defaultValues: {},
              });
              setPage("list");
            }}
          />
        )}
        {page === "list" && (
          <Box gap={2} sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex" }}>
              <Button
                onClick={(e) => {
                  setPage("create");
                }}
                variant="contained"
                startIcon={<AddCircle />}
              >
                Create Container
              </Button>
            </Box>
            <Explorer
              onClick={(r) => {
                readComponent(
                  r.id,
                  (c) => {
                    setComponent(c);
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
                  removeComponent(row.id, refresh, () => {});
                }
              }}
              rows={(list || []).map((c) => ({
                id: c,
                title: c,
              }))}
            />
          </Box>
        )}
      </Paper>
    </Stack>
  );
};

export default ComponentsExplorer;
