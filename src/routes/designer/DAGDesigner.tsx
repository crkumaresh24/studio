import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import MuiAlert from "@mui/material/Alert";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Background,
  Connection,
  Node,
  Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import NodeProperties from "./NodeProperties";
import { nodeTypes } from "./DAGNode";
import { readAction, saveAction } from "../../services";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

interface DAGDesignerProps {
  name: string;
}

interface SnackMessage {
  severity: "error" | "warning" | "info" | "success";
  message: string;
}

const DAGDesigner = (props: DAGDesignerProps) => {
  const theme = useTheme();
  const reactFlowWrapper = useRef<any>(null);
  const [openProperties, setOpenProperties] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node>();
  const [reactFlowInstance, setReactFlowInstance] = useState<any | undefined>();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackMessage, setSnackMessage] = useState<SnackMessage | undefined>();

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
    setSnackMessage(undefined);
  };

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const onConnect = useCallback(
    (params: Edge<any> | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const getNodeContext = (n: Node) => {
    const nodeId = n.id;
    return {
      remove: () => {
        setNodes((nds) => nds.filter((n) => n.id !== nodeId));
        setEdges((edges) =>
          edges.filter((e) => e.source !== nodeId && e.target !== nodeId)
        );
      },
    };
  };

  const handleContextMenu = (event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    if (!contextMenu) {
      setContextMenu({
        mouseX: event.clientX + 2,
        mouseY: event.clientY - 6,
      });
      setSelectedNode(node);
    } else {
      setContextMenu(null);
      setSelectedNode(node);
    }
  };

  const handleContextClose = () => {
    setContextMenu(null);
  };

  const refresh = () => {
    readAction(
      props.name,
      (action) => {
        setNodes(action.nodes || []);
        setEdges(action.edges || []);
      },
      () => {}
    );
  };

  const save = () => {
    if (props.name) {
      saveAction(
        { nodes, edges },
        props.name,
        () => {
          setSnackMessage({
            severity: "success",
            message: "saved successfully",
          });
          setOpenSnackBar(true);
        },
        () => {
          setSnackMessage({
            severity: "error",
            message: "error while saving",
          });
          setOpenSnackBar(true);
        }
      );
    }
  };

  useEffect(() => {
    refresh();
  }, [props.name]);

  return (
    <Paper
      ref={reactFlowWrapper}
      sx={{ width: "100%", margin: 1, overflow: "auto" }}
    >
      <ReactFlow
        nodes={nodes.map((n) => {
          return {
            ...n,
            data: {
              ...(n.data || {}),
              context: getNodeContext(n),
            },
          };
        })}
        edges={edges}
        nodeTypes={nodeTypes}
        onInit={setReactFlowInstance}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={(event: any) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = "move";
        }}
        onNodeContextMenu={(e, node) => {
          handleContextMenu(e, node);
        }}
        onDrop={(event) => {
          event.preventDefault();
          if (
            reactFlowWrapper &&
            reactFlowInstance &&
            reactFlowWrapper.current
          ) {
            const reactFlowBounds =
              reactFlowWrapper.current.getBoundingClientRect();
            const position = reactFlowInstance.project({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            });

            const group = event.dataTransfer.getData("group");
            if (group === "action") {
              const payload = event.dataTransfer.getData("payload");
              if (payload) {
                let node = JSON.parse(payload);
                if (
                  node.data.actionType &&
                  node.data.actionType.toLowerCase() === "start"
                ) {
                  node = {
                    ...node,
                    id: "testAction",
                  };
                }
                setNodes((nds) =>
                  nds.concat({
                    ...node,
                    position,
                  })
                );
              }
            }
          }
        }}
      >
        <Stack padding={1}>
          <Box>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                save();
              }}
              sx={{ zIndex: 1000 }}
              variant="contained"
            >
              Save
            </Button>
          </Box>
        </Stack>
        <Controls />
        <Background />
      </ReactFlow>
      <Menu
        open={contextMenu !== null}
        onClose={handleContextClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem
          onClick={(e) => {
            setOpenProperties(true);
            handleContextClose();
          }}
        >
          Properties
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleContextClose();
            if (selectedNode) {
              setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
              setEdges((edges) =>
                edges.filter(
                  (e) =>
                    e.source !== selectedNode.id && e.target !== selectedNode.id
                )
              );
            }
          }}
        >
          Remove Node
        </MenuItem>
      </Menu>
      <Drawer
        sx={{
          width: 400,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 400,
          },
        }}
        anchor="right"
        open={openProperties}
        onClose={() => setOpenProperties(false)}
      >
        <DrawerHeader>
          <IconButton onClick={() => setOpenProperties(false)}>
            {theme.direction === "rtl" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
          <Typography sx={{ marginLeft: 2 }} variant="subtitle1">
            {selectedNode && selectedNode.data.actionType.toUpperCase()}
          </Typography>
        </DrawerHeader>
        <Divider />
        {selectedNode && <NodeProperties node={selectedNode} />}
      </Drawer>
      {snackMessage && (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={openSnackBar}
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

export default DAGDesigner;
