import { AddCircle, Delete } from "@mui/icons-material";
import { Button, Paper, Snackbar, Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import {
  CONTAINER_HEIGHT,
  getRootTree,
  mergeDefaultValues,
  SnackMessage,
} from "../../Constants";
import Explorer, { Action, Row } from "../../libs/Explorer";
import { DATA_VALUE } from "../../libs/ValueAssigner";
import { TreeNode } from "../../libs/PayloadMapper";
import MuiAlert from "@mui/material/Alert";
import {
  listComponents,
  readComponent,
  removeComponent,
  saveComponent,
} from "../../services";
import SaveComponent from "./SaveComponent";
import { useLocation } from "react-router-dom";

export interface Component {
  tree: TreeNode;
  defaultValues: Record<string, DATA_VALUE>;
}

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

const ComponentsExplorer = () => {
  const query = useQuery();
  const componentName = query.get("name") || "";
  const [name, setName] = useState<string>(componentName);
  const [page, setPage] = useState<"list" | "create" | "edit">("list");
  const [snackMessage, setSnackMessage] = useState<SnackMessage | undefined>();
  const [component, setComponent] = useState<Component>({
    tree: getRootTree("props"),
    defaultValues: {},
  });
  const [list, setList] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

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
    listComponents(setList, (e) => {
      setList([]);
    });
  };

  useEffect(() => {
    readComponent(
      name,
      (c) => {
        setComponent(c);
        setPage("edit");
      },
      () => {}
    );
  }, [name]);

  useEffect(() => {
    refresh();
  }, []);

  const onSave = (c: Component) => {
    let json: any = {};
    let keys: any = {};
    mergeDefaultValues(c.tree, c.defaultValues, json, {}, keys);
    let sanitizedKeys: any = {};
    Object.keys(keys || {}).forEach((k) => {
      sanitizedKeys[k.replace("props", name)] = keys[k];
    });
    name &&
      saveComponent(
        {
          ...c,
          json: json["$"],
          keys: sanitizedKeys,
        },
        name,
        () => {
          refresh();
          setSnackMessage({
            message: "changes saved",
            severity: "success",
          });
        },
        (e) => {
          setSnackMessage({
            message: e.message,
            severity: "error",
          });
        }
      );
  };

  return (
    <Paper
      sx={{
        padding: 1,
        margin: "auto",
        minHeight: CONTAINER_HEIGHT,
        width: "70%",
      }}
    >
      <Stack padding={2}>
        {page === "list" ? (
          <Stack gap={2}>
            <Stack gap={2} direction={"row"}>
              <Button
                onClick={(e) => {
                  setName("");
                  setPage("create");
                }}
                variant="contained"
                startIcon={<AddCircle />}
              >
                Create Component
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
              title={"Components"}
              selected={selected}
              onSelectionChange={setSelected}
              onClick={(r) => {
                readComponent(
                  r.id,
                  (c) => {
                    setComponent(c);
                    setName(r.id);
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
          </Stack>
        ) : (
          <SaveComponent
            mode={page}
            name={name}
            setName={setName}
            component={component}
            onSave={onSave}
            onBack={() => {
              setComponent({
                tree: getRootTree("props"),
                defaultValues: {},
              });
              setPage("list");
            }}
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
      </Stack>
    </Paper>
  );
};

export default ComponentsExplorer;
