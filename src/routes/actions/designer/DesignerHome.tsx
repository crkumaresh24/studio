import {
  Button,
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
import { saveAction } from "../../../services";
import { CONTAINER_HEIGHT, SnackMessage } from "../../../Constants";
import MuiAlert from "@mui/material/Alert";
import { useNodesState, useEdgesState } from "reactflow";

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

const DesignerHome = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const action = query.get("action");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [snackMessage, setSnackMessage] = useState<SnackMessage | undefined>();

  const handleClose = (e: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackMessage(undefined);
  };

  const save = () => {
    if (action) {
      saveAction(
        { nodes, edges },
        action,
        () => {
          setSnackMessage({
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
    </Paper>
  );
};

export default DesignerHome;
