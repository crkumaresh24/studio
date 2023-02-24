import { AddCircle, Delete } from "@mui/icons-material";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CONTAINER_HEIGHT, SHRINK_SIZE } from "../../Constants";
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
    <Stack margin={0.25} alignItems={"center"}>
      <Paper
        sx={{
          padding: 1,
          minHeight: CONTAINER_HEIGHT,
          minWidth: SHRINK_SIZE,
        }}
      >
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
