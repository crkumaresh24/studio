import { AddCircle, Delete } from "@mui/icons-material";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Explorer, { Row, Action } from "../../libs/Explorer";
import { listActions, removeAction, saveAction } from "../../services";
import CreateAction from "./CreateAction";

const ActionsExplorer = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<"list" | "create" | "edit">("list");
  const [selected, setSelected] = useState<string[]>([]);
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
              secondaryActions={[
                { id: "delete", title: "Delete", startIcon: "delete" },
              ]}
              onSecondaryAction={(row: Row, action: Action) => {
                if (action.id === "delete") {
                  removeAction(row.id, refresh, () => {});
                }
              }}
              onClick={(row: Row) => {
                navigate("/designer?action=" + row.id);
                // window.open("/designer?action=" + row.id, "_blank");
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
