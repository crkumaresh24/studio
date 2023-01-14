import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { WEB_FS_URL } from "../../Constants";
import Explorer, { Action, Row } from "../../libs/Explorer";
import { DATA } from "../../libs/ValueAssigner";
import { TreeNode } from "../../libs/ValueMapper";
import CreateComponent from "./CreateComponent";
import EditComponent from "./EditComponent";

const initialState: TreeNode = {
  id: "0",
  name: "$",
  children: [],
};

interface ComponentsExplorerProps {}

const ComponentsExplorer = (props: ComponentsExplorerProps) => {
  const [tree, setTree] = useState<TreeNode>(initialState);
  const [defaultValues, setDefaultValues] = useState<Record<string, DATA>>({});
  const [page, setPage] = useState<"list" | "create" | "edit">("list");
  const [clickedRow, setClickedRow] = useState<Row>();

  const saveStore = (
    content: any,
    onSuccess: () => void,
    onError: () => void
  ) => {
    fetch(WEB_FS_URL + "/store", {
      method: "POST",
      body: JSON.stringify(content),
    }).then((req) => {
      onSuccess();
    });
  };

  const fetchStore = (
    onSuccess: (store: any) => void,
    onError: (message: string) => void
  ) => {
    fetch(WEB_FS_URL + "/store")
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          console.log("store content not defined yet");
        }
      })
      .then((store) => {
        onSuccess(store || {} || {});
      });
  };

  const saveComponent = (node: TreeNode) => {
    const index = parseInt(node.id);
    (tree.children || [])[index] = node;
    saveStore(
      {
        store: {},
        keys: {},
        tree,
        defaultValues,
      },
      () => {
        fetchStore(
          (s) => {
            setTree(s.tree);
            setDefaultValues(s.defaultValues);
          },
          () => {}
        );
      },
      () => {}
    );
  };

  const deleteComponent = (nodeId: string) => {
    saveStore(
      {
        store: {},
        keys: {},
        tree: {
          ...tree,
          children: (tree.children || []).filter((c) => c.id !== nodeId),
        },
        defaultValues,
      },
      () => {
        fetchStore(
          (s) => {
            setTree(s.tree);
            setDefaultValues(s.defaultValues);
          },
          () => {}
        );
      },
      () => {}
    );
  };

  useEffect(() => {
    fetchStore(
      (s) => {
        setTree(s.tree);
        setDefaultValues(s.defaultValues);
      },
      () => {}
    );
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", padding: 2, flex: 1 }}>
      {page === "create" && (
        <CreateComponent
          rootNode={{
            id: (tree.children || []).length.toString(),
            name: "$",
            children: [],
          }}
          defaultValues={defaultValues}
          setDefaultValues={setDefaultValues}
          onSave={saveComponent}
          onBack={() => setPage("list")}
        />
      )}
      {page === "edit" && (
        <EditComponent
          rootNode={{
            ...(tree.children || [])?.filter((c) => c.id === clickedRow?.id)[0],
            name: "$",
          }}
          name={
            (tree.children || [])?.filter((c) => c.id === clickedRow?.id)[0]
              .name || ""
          }
          defaultValues={defaultValues}
          setDefaultValues={setDefaultValues}
          onSave={saveComponent}
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
              size="small"
              variant="contained"
            >
              Create
            </Button>
          </Box>
          <Explorer
            onClick={(r) => {
              setClickedRow(r);
              setPage("edit");
            }}
            secondaryActions={[
              { id: "delete", title: "Delete", startIcon: "delete" },
            ]}
            onSecondaryAction={(row: Row, action: Action) => {
              if (action.id === "delete") {
                deleteComponent(row.id);
              }
            }}
            rows={(tree.children || []).map((c) => ({
              id: c.id,
              title: c.name || c.id,
            }))}
          />
        </Box>
      )}
    </Box>
  );
};

export default ComponentsExplorer;
