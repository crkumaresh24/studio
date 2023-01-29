import { AddCircle } from "@mui/icons-material";
import { Box, Button, Paper, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import Explorer, { Row, Action } from "../../libs/Explorer";
import { listActions, removeAction, saveAction } from "../../services";
import CreateAction from "./CreateAction";

const ActionsExplorer = () => {
  const [page, setPage] = useState<"list" | "create" | "edit">("list");
  const [list, setList] = useState<string[]>([]);

  const refresh = () => {
    listActions(setList, () => {});
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <Stack margin={"auto"} sx={{ maxWidth: "60%" }}>
      <Paper sx={{ minHeight: "calc(100vh - 64px)", padding: 3 }}>
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
            <Box sx={{ display: "flex" }}>
              <Button
                onClick={(e) => {
                  setPage("create");
                }}
                startIcon={<AddCircle />}
                variant="contained"
              >
                Create Action
              </Button>
            </Box>
            <Explorer
              secondaryActions={[
                { id: "design", title: "Design", startIcon: "design" },
                { id: "delete", title: "Delete", startIcon: "delete" },
              ]}
              onSecondaryAction={(row: Row, action: Action) => {
                if (action.id === "delete") {
                  removeAction(row.id, refresh, () => {});
                } else if (action.id === "design") {
                  window.open("/designer?action=" + row.id, "_blank");
                }
              }}
              rows={list.map((c) => ({
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

export default ActionsExplorer;
