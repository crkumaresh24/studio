import { TreeItem, TreeView } from "@mui/lab";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CheckIcon from "@mui/icons-material/Check";
import ValueAssigner, { DATA } from "./ValueAssigner";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

export interface TreeNode {
  id: string;
  name: string | undefined;
  children?: TreeNode[];
}

interface ValueMapperProps {
  store: TreeNode;
  setStore: (store: TreeNode) => void;
  mappedFields: Record<string, DATA>;
  setMappedFields: (mappedFields: Record<string, DATA>) => void;
  levels?: number;
  title?: string;
  onlyLeafSelection?: boolean;
}

const ValueMapper = (props: ValueMapperProps) => {
  const [selected, setSelected] = useState<string>();
  const [expanded, setExpanded] = useState<string[]>(["0"]);
  const [newKey, setNewKey] = useState<string>("");

  const handleTreeAdd = (e: React.MouseEvent, selectedNode: TreeNode) => {
    e.stopPropagation();
    setSelected(undefined);
    setNewKey("");
    selectedNode.children = [
      ...(selectedNode.children || []),
      {
        id: selectedNode.id + "." + (selectedNode.children || []).length,
        name: undefined,
      },
    ];
    setExpanded([...expanded, selectedNode.id]);
    props.setStore({
      ...props.store,
    });
  };

  const setNodeName = (e: React.MouseEvent, selectedNode: TreeNode) => {
    e.stopPropagation();
    selectedNode.name = newKey;
    setExpanded([...expanded, selectedNode.id]);
    props.setStore({
      ...props.store,
    });
    setNewKey("");
  };

  const handleTreeRemove = (e: React.MouseEvent, selectedNode: TreeNode) => {
    e.stopPropagation();
    setSelected(undefined);
    setNewKey("");
    if (props.store.children) {
      props.setStore({
        ...props.store,
        children: findAndRemoveNode(props.store.children, selectedNode),
      });
    }
  };

  const findAndRemoveNode = (
    children: TreeNode[],
    modifyNode: TreeNode
  ): TreeNode[] => {
    const filtered = children.filter((c) => c.id !== modifyNode.id);
    if (filtered.length !== children.length) {
      return filtered;
    }
    children.forEach((c) => {
      if (c.children) {
        c.children = findAndRemoveNode(c.children, modifyNode);
      }
    });
    return filtered;
  };

  const findNode = (root: TreeNode[], nodeId: string) => {
    const found = root.filter((c) => c.id === nodeId)[0];
    if (found) {
      return found;
    } else {
      root.forEach((c) => {
        if (c.children) {
          const node = findNode(c.children, nodeId);
          if (node) {
            return node;
          }
        }
      });
    }
    return undefined;
  };

  const isLeaf = (node: TreeNode) => {
    return !node.children || node.children.length < 1;
  };

  const isRoot = (node: TreeNode) => {
    return node.id === "0" || node.name === "$";
  };

  const renderTree = (node: TreeNode, currentLevel: number) => (
    <TreeItem
      key={node.id}
      nodeId={node.id}
      label={
        <Box gap={1} sx={{ display: "flex" }}>
          {node.name ? (
            <>
              <span>{node.name}</span>
              {(!props.levels || currentLevel < props.levels) && (
                <IconButton
                  onClick={(e) => handleTreeAdd(e, node)}
                  aria-label="delete"
                  size="small"
                >
                  <AddIcon fontSize="inherit" />
                </IconButton>
              )}
              {!isRoot(node) && isLeaf(node) && (
                <IconButton
                  onClick={(e) => handleTreeRemove(e, node)}
                  aria-label="delete"
                  size="small"
                >
                  <DeleteIcon fontSize="inherit" />
                </IconButton>
              )}
            </>
          ) : (
            <Box gap={1} sx={{ display: "flex" }}>
              <TextField
                autoFocus
                value={newKey}
                onChange={(e) => {
                  setNewKey(e.target.value);
                }}
              />
              <IconButton
                disableRipple
                onClick={(e) => setNodeName(e, node)}
                aria-label="delete"
                size="small"
              >
                <CheckIcon fontSize="small" />
              </IconButton>
              <IconButton
                disableRipple
                onClick={(e) => handleTreeRemove(e, node)}
                aria-label="delete"
                size="small"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
      }
    >
      {Array.isArray(node.children)
        ? node.children.map((node) => renderTree(node, currentLevel + 1))
        : null}
    </TreeItem>
  );

  return (
    <Box gap={2} sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Typography variant="subtitle1">
        {props.title || "Value Mapper"}
      </Typography>
      <Box
        gap={2}
        sx={{
          display: "flex",
          paddingTop: 2,
          flex: 1,
          border: "1px solid rgb(133, 133, 133)",
          minHeight: 500,
        }}
      >
        <TreeView
          expanded={expanded}
          onNodeToggle={(e, expanded) => setExpanded(expanded)}
          selected={selected}
          onNodeSelect={(e: React.SyntheticEvent, n: string) => {
            setSelected(n);
          }}
          style={{ height: "100%" }}
          aria-label="rich object"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpanded={["root"]}
          defaultExpandIcon={<ChevronRightIcon />}
          sx={{ height: 110, flexGrow: 1, maxWidth: 500, overflowY: "auto" }}
        >
          {renderTree(props.store, 0)}
        </TreeView>
        {selected && selected !== "0" && (
          <Box sx={{ display: "flex", marginLeft: 8 }}>
            <ValueAssigner
              data={
                props.mappedFields[selected] || { type: "string", value: "" }
              }
              onDataChange={(data) =>
                props.setMappedFields({
                  ...props.mappedFields,
                  [selected]: data,
                })
              }
              requiredTypes={["string", "boolean", "number"]}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ValueMapper;
