import { DATA } from "./libs/ValueAssigner";
import { TreeNode } from "./libs/ValueMapper";

export const WEB_FS_URL = "http://localhost:9099";

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

const isLeaf = (node: TreeNode) => {
  return !node.children || node.children.length < 1;
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
