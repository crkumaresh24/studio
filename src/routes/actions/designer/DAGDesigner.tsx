import {
  Divider,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";

import ReactFlow, {
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
import { readAction } from "../../../services";
import { Delete, Settings } from "@mui/icons-material";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

interface DAGDesignerProps {
  actionName: string;
  nodes: Node[];
  edges: Edge[];
  setNodes: any;
  setEdges: any;
  onNodesChange: any;
  onEdgesChange: any;
}

const DAGDesigner = (props: DAGDesignerProps) => {
  const theme = useTheme();
  const reactFlowWrapper = useRef<any>(null);
  const [openProperties, setOpenProperties] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node>();
  const [reactFlowInstance, setReactFlowInstance] = useState<any | undefined>();

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const onConnect = useCallback(
    (params: Edge<any> | Connection) =>
      props.setEdges((eds: Edge[]) => addEdge(params, eds)),
    [props.setEdges]
  );

  const getNodeContext = (n: Node) => {
    const nodeId = n.id;
    return {
      remove: () => {
        props.setNodes((nds: Node[]) => nds.filter((n) => n.id !== nodeId));
        props.setEdges((edges: Edge[]) =>
          props.edges.filter((e) => e.source !== nodeId && e.target !== nodeId)
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
      props.actionName,
      (action) => {
        props.setNodes(action.nodes || []);
        props.setEdges(action.edges || []);
      },
      () => {}
    );
  };

  useEffect(() => {
    refresh();
  }, [props.actionName]);

  return (
    <Paper ref={reactFlowWrapper} sx={{ width: "100%", overflow: "auto" }}>
      <ReactFlow
        nodes={props.nodes.map((n: Node) => {
          return {
            ...n,
            data: {
              ...(n.data || {}),
              action: props.actionName,
              context: getNodeContext(n),
            },
          };
        })}
        onNodeClick={(e, node) => {
          setSelectedNode(node);
          setOpenProperties(true);
        }}
        edges={props.edges}
        nodeTypes={nodeTypes}
        onInit={setReactFlowInstance}
        onNodesChange={props.onNodesChange}
        onEdgesChange={props.onEdgesChange}
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
                    id: props.actionName,
                  };
                }
                props.setNodes((nds: Node[]) =>
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
          <Stack gap={2} direction={"row"}>
            <Settings />
            Properties
          </Stack>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleContextClose();
            if (selectedNode) {
              props.setNodes((nds: Node[]) =>
                nds.filter((n) => n.id !== selectedNode.id)
              );
              props.setEdges((edges: Edge[]) =>
                props.edges.filter(
                  (e) =>
                    e.source !== selectedNode.id && e.target !== selectedNode.id
                )
              );
            }
          }}
        >
          <Stack gap={2} direction={"row"}>
            <Delete />
            Remove Node
          </Stack>
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
        {selectedNode && (
          <NodeProperties
            onNodeChange={(node) => {
              props.setNodes((nds: Node[]) =>
                nds.map((n) => (n.id === node.id ? node : n))
              );
              setSelectedNode(node);
            }}
            actionName={props.actionName}
            node={selectedNode}
          />
        )}
      </Drawer>
    </Paper>
  );
};

export default DAGDesigner;
