import {
  Button,
  Drawer,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DAGDesigner from "./DAGDesigner";
import BackIcon from "@mui/icons-material/ArrowBack";
import DesignerTools from "./DesignerTools";
import { readApp, saveAction } from "../../../services";
import { CONTAINER_HEIGHT, SnackMessage } from "../../../Constants";
import MuiAlert from "@mui/material/Alert";
import { useNodesState, useEdgesState } from "reactflow";
import { PlayArrow } from "@mui/icons-material";
import Save from "@mui/icons-material/Save";
import { executeAction } from "../executors/ActionExecutor";
import ActionRunReponse from "../ActionRunResponse";

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

let logs: string[] = [];

const DesignerHome = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const action = query.get("action");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [responseRefreshTime, setResponseRefreshTime] = useState<
    number | undefined
  >(undefined);
  const [snackMessage, setSnackMessage] = useState<SnackMessage | undefined>();

  const handleClose = (e: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackMessage(undefined);
  };

  const save = (onSuccess?: () => void) => {
    if (action) {
      saveAction(
        {
          nodes,
          edges,
        },
        action,
        () => {
          onSuccess
            ? onSuccess()
            : setSnackMessage({
                severity: "success",
                message: "action saved",
              });
        },
        () => {
          setSnackMessage({
            severity: "error",
            message: "error while saving action",
          });
        }
      );
    }
  };

  const log = (log: string) => {
    logs.push(log);
    setResponseRefreshTime(new Date().getTime());
  };

  return (
    <Paper
      sx={{
        minHeight: CONTAINER_HEIGHT,
        width: "90%",
      }}
    >
      {action ? (
        <Stack>
          <Stack
            margin={1}
            paddingRight={2}
            gap={2}
            direction={"row"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <IconButton
              size="small"
              onClick={(e) => {
                navigate("/actions");
              }}
            >
              <BackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ margin: "auto" }}>
              {action}
            </Typography>
            <Typography>{" Nodes: " + nodes.length}</Typography>
            <Button
              startIcon={<Save />}
              onClick={(e) => {
                e.stopPropagation();
                save();
              }}
              sx={{ zIndex: 1000 }}
              size="small"
              variant="contained"
            >
              Save changes
            </Button>
            <Button
              startIcon={<PlayArrow />}
              onClick={(e) => {
                e.stopPropagation();
                logs = [];
                save(() => {
                  readApp(
                    (app) => {
                      console.log(app.store);
                      executeAction(app, [action], "Hello ! Actions", log);
                    },
                    () => {}
                  );
                });
              }}
              sx={{ zIndex: 1000 }}
              size="small"
              variant="contained"
            >
              Run
            </Button>
          </Stack>

          <Stack
            margin={1}
            gap={1}
            direction={"row"}
            sx={{ height: "calc(100vh - 120px)" }}
          >
            <DesignerTools />
            <DAGDesigner
              actionName={action}
              nodes={nodes}
              edges={edges}
              setNodes={setNodes}
              setEdges={setEdges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
            />
          </Stack>
        </Stack>
      ) : (
        "No action selected"
      )}
      {snackMessage && (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={snackMessage !== undefined}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <MuiAlert severity={snackMessage.severity}>
            {snackMessage.message}
          </MuiAlert>
        </Snackbar>
      )}
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

export default DesignerHome;
