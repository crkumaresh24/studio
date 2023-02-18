import { TreeItem, TreeView } from "@mui/lab";
import { IconButton, Stack, TextField } from "@mui/material";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CheckIcon from "@mui/icons-material/Check";
import ValueAssigner, { DATA_VALUE } from "./ValueAssigner";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

export interface TreeNode {
  id: string;
  name: string | undefined;
  path: string;
  children?: TreeNode[];
}

interface PayloadMapperProps {
  tree: TreeNode;
  setTree: (tree: TreeNode) => void;
  selected: string;
  setSelected: (selected: string) => void;
  readonly?: boolean;
  onlyTree?: boolean;
  mappedFields: Record<string, DATA_VALUE>;
  setMappedFields: (mappedFields: Record<string, DATA_VALUE>) => void;
  levels?: number;
  onlyLeafSelection?: boolean;
}

const PayloadMapper = (props: PayloadMapperProps) => {
  const [expanded, setExpanded] = useState<string[]>(["0"]);
  const [newKey, setNewKey] = useState<string>("");

  const handleTreeAdd = (e: React.MouseEvent, selectedNode: TreeNode) => {
    e.stopPropagation();
    props.setSelected("");
    setNewKey("");
    selectedNode.children = [
      ...(selectedNode.children || []),
      {
        id: selectedNode.id + "." + (selectedNode.children || []).length,
        path: (selectedNode.path || "$") + ".undefined",
        name: undefined,
      },
    ];
    setExpanded([...expanded, selectedNode.id]);
    props.setTree({
      ...props.tree,
    });
  };

  const handleTreeRemove = (e: React.MouseEvent, selectedNode: TreeNode) => {
    e.stopPropagation();
    props.setSelected("");
    setNewKey("");
    if (props.tree.children) {
      props.setTree({
        ...props.tree,
        children: findAndRemoveNode(props.tree.children, selectedNode),
      });
    }
  };

  const setNodeName = (e: React.MouseEvent, selectedNode: TreeNode) => {
    e.stopPropagation();
    selectedNode.name = newKey;
    selectedNode.path = selectedNode.path.replace(".undefined", "." + newKey);
    setExpanded([...expanded, selectedNode.id]);
    props.setTree({
      ...props.tree,
    });
    setNewKey("");
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

  const setLeafNodes = (root: TreeNode, nodesMap: Record<string, TreeNode>) => {
    if (root) {
      if (isLeaf(root)) {
        nodesMap[root.id] = root;
      } else {
        root.children &&
          root.children.forEach((c) => {
            setLeafNodes(c, nodesMap);
          });
      }
    }
  };

  const isLeaf = (node: TreeNode) => {
    return !node.children || node.children.length < 1;
  };

  const isRoot = (node: TreeNode) => {
    return node.id === "0";
  };

  const renderTree = (node: TreeNode, currentLevel: number) => (
    <TreeItem
      key={node.id}
      nodeId={node.id}
      label={
        <Stack padding={0.5} direction={"row"} gap={1}>
          {node.name ? (
            <>
              <span>
                {node.name +
                  (currentLevel === 0
                    ? " (" + (node.children || []).length + ") "
                    : "")}
              </span>
              {(!props.levels || currentLevel < props.levels) &&
                !props.readonly && (
                  <IconButton
                    onClick={(e) => handleTreeAdd(e, node)}
                    aria-label="delete"
                    size="small"
                  >
                    <AddIcon fontSize="inherit" />
                  </IconButton>
                )}
              {!isRoot(node) && isLeaf(node) && !props.readonly && (
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
            <Stack margin={1} gap={1} direction={"row"}>
              <TextField
                size="small"
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
            </Stack>
          )}
        </Stack>
      }
    >
      {Array.isArray(node.children)
        ? node.children.map((node) => renderTree(node, currentLevel + 1))
        : null}
    </TreeItem>
  );

  let leafNodes: Record<string, TreeNode> = {};
  setLeafNodes(props.tree, leafNodes);

  let selectedParent = "";
  if (props.selected) {
    const parts = props.selected.split(".");
    parts.pop();
    selectedParent = parts.join(".");
  }

  return (
    <Stack gap={4} direction="row">
      <TreeView
        expanded={[...expanded, selectedParent]}
        onNodeToggle={(e, expanded) => setExpanded(expanded)}
        selected={props.selected}
        onNodeSelect={(e: React.SyntheticEvent, n: string) => {
          if (n === props.selected) {
            props.setSelected("");
          } else {
            if (props.onlyLeafSelection) {
              if (leafNodes[n]) {
                props.setSelected(n);
              }
            } else {
              props.setSelected(n);
            }
          }
        }}
        style={{ height: "100%" }}
        aria-label="rich object"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        sx={{ height: 110, flexGrow: 1, maxWidth: 500, overflowY: "auto" }}
      >
        {renderTree(props.tree, 0)}
      </TreeView>
      {!props.onlyTree &&
        props.selected &&
        props.selected !== "0" &&
        !newKey && (
          <ValueAssigner
            data={
              props.mappedFields[props.selected] || {
                type: "string",
                value: "",
              }
            }
            onDataChange={(data) =>
              props.setMappedFields({
                ...props.mappedFields,
                [props.selected]: data,
              })
            }
            requiredTypes={["json", "store", "string", "boolean", "number"]}
          />
        )}
    </Stack>
  );
};

export default PayloadMapper;
