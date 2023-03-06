import { AddCircle, Delete } from "@mui/icons-material";
import { Box, Button, Drawer, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CONTAINER_HEIGHT } from "../../Constants";
import Explorer, { Row, Action } from "../../libs/Explorer";
import { listActions, readApp, removeAction, saveAction } from "../../services";
import ActionRunReponse from "./ActionRunResponse";
import CreateAction from "./CreateAction";
import { executeAction } from "./executors/ActionExecutor";

let logs: string[] = [];

const ActionsExplorer = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<"list" | "create" | "edit">("list");
  const [responseRefreshTime, setResponseRefreshTime] = useState<
    number | undefined
  >(undefined);
  const [selected, setSelected] = useState<string[]>([]);
  const [list, setList] = useState<string[]>([]);

  const refresh = () => {
    listActions(setList, () => {});
  };

  useEffect(() => {
    refresh();
  }, []);

  const log = (log: string) => {
    logs.push(log);
    setResponseRefreshTime(new Date().getTime());
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
        {page === "create" && (
          <CreateAction
            onSave={(name) => {
              saveAction({ nodes: [], edges: [] }, name, refresh, () => {});
            }}
            onBack={() => setPage("list")}
          />
        )}
        {page === "list" && (
          <Box gap={2} sx={{ display: "flex", flexDirection: "column" }}>
            <Stack gap={2} direction={"row"}>
              <Button
                onClick={(e) => {
                  setPage("create");
                }}
                startIcon={<AddCircle />}
                variant="contained"
              >
                Create Action
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
              title="Actions"
              selected={selected}
              onSelectionChange={setSelected}
              secondaryExpanded
              secondaryActions={[
                { id: "run", title: "Run", startIcon: "play" },
                { id: "delete", title: "Delete", startIcon: "delete" },
              ]}
              onSecondaryAction={(row: Row, action: Action) => {
                if (action.id === "delete") {
                  removeAction(row.id, refresh, () => {});
                } else if (action.id === "run") {
                  readApp(
                    (app) => {
                      executeAction(app, [row.id], "Hello ! Actions", log);
                    },
                    () => {}
                  );
                }
              }}
              onClick={(row: Row) => {
                navigate("/designer?action=" + row.id);
              }}
              rows={list.map((c) => ({
                id: c,
                title: c,
                subTitle: "action",
              }))}
            />
          </Box>
        )}
      </Stack>
      <Drawer
        anchor={"bottom"}
        open={responseRefreshTime !== undefined}
        onClose={() => {
          logs = [];
          setResponseRefreshTime(undefined);
        }}
      >
        {responseRefreshTime && (
          <ActionRunReponse
            key={responseRefreshTime}
            store={undefined}
            logs={logs}
          />
        )}
      </Drawer>
    </Paper>
  );
};

export default ActionsExplorer;
