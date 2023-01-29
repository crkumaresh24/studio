import { DATA } from "./libs/ValueAssigner";
import { TreeNode } from "./libs/PayloadMapper";

export const WEB_FS_URL = "http://localhost:9099";

export enum DATA_SOURCE_TYPE {
  OPENQUERY,
  OPENAPI,
  HTTP,
}

export const inHandleColor = "black";
export const out0HandleColor = "black";
export const out1HandleColor = "black";
export const handleSize = 10;
export const handleSideGap = 24;
export const boxHeight = 48;
export const boxWidth = 180;

export const rootTree: TreeNode = {
  id: "0",
  name: "$",
  children: [],
};

const isLeaf = (node: TreeNode) => {
  return !node.children || node.children.length < 1;
};

export const mergeDefaultValues = (
  tree: TreeNode,
  values: Record<string, DATA>,
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
        tree.id,
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
    obj[lastKey] = value;
  }
  return obj;
};

export const oneLevelTreeToJSON = (
  tree: TreeNode,
  defaultValues: Record<string, DATA>
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

export const treeToJSON = (
  tree: TreeNode[],
  defaultValues: Record<string, any>,
  keys: Record<string, string>[] = [{}],
  parsedObj: any = {},
  parent: string = ""
): any => {
  tree.forEach((t) => {
    if (isLeaf(t) && t.name) {
      const valueItem: DATA = defaultValues[t.id] || {
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
