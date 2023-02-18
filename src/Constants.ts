import { TreeNode } from "./libs/PayloadMapper";
import { DATA_TYPE } from "./libs/ValueAssigner";

export const WEB_FS_URL = "http://localhost:9099";

export interface Settings {
  theme: string;
  buildPaths: KeyValueEntry[];
  apis: KeyValueEntry[];
  queries: KeyValueEntry[];
}

export enum DATA_SOURCE_TYPE {
  OPENQUERY,
  OPENAPI,
  HTTP,
}

export interface DATA_VALUE {
  type: DATA_TYPE;
  value: any | undefined;
}

export interface SnackMessage {
  severity: "error" | "warning" | "info" | "success";
  message: string;
}

export interface KeyValueEntry {
  key: string;
  value?: string;
}

export const resolveData = (data: DATA_VALUE) => {
  if (data.type === "store") {
  }
  return data.value;
};

export const inHandleColor = "black";
export const out0HandleColor = "black";
export const out1HandleColor = "black";
export const handleSize = 10;
export const handleSideGap = 24;
export const boxHeight = 48;
export const boxWidth = 180;

export const getRootTree = (name?: string): TreeNode => {
  return {
    id: "0",
    name: name || "$",
    children: [],
    path: "",
  };
};

const isLeaf = (node: TreeNode) => {
  return !node.children || node.children.length < 1;
};

export const mergeDefaultValues = (
  tree: TreeNode,
  values: Record<string, DATA_VALUE>,
  json: any,
  keys?: Record<string, string>,
  parent: string = ""
) => {
  if (tree) {
    if (isLeaf(tree)) {
      if (keys) {
        keys[tree.id] = parent + "." + tree.name;
      }
      stringToObj(
        tree.path,
        values[tree.id] || { type: "string", value: "" },
        json
      );
    } else {
      (tree.children || []).forEach((c) => {
        mergeDefaultValues(
          c,
          values,
          json,
          keys,
          parent ? parent + "." + tree.name : tree.name
        );
      });
    }
  }
};

export const stringToObj = (key: string, value: any, obj: any) => {
  const parts = key.split(".");
  const lastKey = parts.pop();
  if (lastKey) {
    let part;
    while ((part = parts.shift())) {
      if (typeof obj[part] != "object") obj[part] = {};
      obj = obj[part];
    }
    obj[lastKey] = resolveData(value);
  }
  return obj;
};

export const oneLevelTreeToJSON = (
  tree: TreeNode,
  defaultValues: Record<string, DATA_VALUE>
) => {
  let json = {};
  (tree.children || []).forEach((c) => {
    json = {
      ...json,
      [c.name || c.id]: defaultValues[c.id],
    };
  });
  return json;
};

export const oneLevelJSONToTree = (json: any, name?: string) => {
  return {
    id: "0",
    name: name || "$",
    path: "",
    children: Object.keys(json).map((p, i) => {
      return {
        id: "0." + i,
        name: p,
        children: [],
        path: p,
      };
    }),
  };
};

export const treeToJSON = (
  tree: TreeNode[],
  defaultValues: Record<string, any>,
  keys: Record<string, string>[] = [{}],
  parsedObj: any = {},
  parent: string = ""
): any => {
  tree &&
    tree.forEach((t) => {
      if (isLeaf(t) && t.name) {
        const valueItem: DATA_VALUE = defaultValues[t.id] || {
          value: "",
          type: "string",
        };
        let value = valueItem.value;
        if (valueItem.type === "number") {
          value = Number(value);
        }
        if (valueItem.type === "boolean") {
          value = value === "true";
        }
        stringToObj(t.id, value, parsedObj);
        keys[0] = {
          ...keys[0],
          [parent.concat(".").concat(t.name.toString()).substring(3)]: t.id
            .toString()
            .substring(2),
        };
      } else {
        if (t.name && t.children) {
          treeToJSON(
            t.children,
            defaultValues,
            keys,
            parsedObj,
            parent.concat(".").concat(t.name.toString())
          );
        }
      }
    });
  return { parsed: parsedObj["0"], keys: keys[0] };
};

export const jsonToTree = (json: any, parentTree: TreeNode): TreeNode => {
  if (json) {
    Object.keys(json).forEach((k, i) => {
      const tree = {
        id: parentTree.id + "." + i,
        name: k,
        children: [],
        path: (parentTree.path || "$") + "." + k,
      };
      parentTree.children?.push(tree);
      if (typeof json[k] === "object" && !Array.isArray(json[k])) {
        jsonToTree(json[k], tree);
      }
    });
  }
  return parentTree;
};
