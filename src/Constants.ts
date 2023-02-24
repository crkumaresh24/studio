import { TreeNode } from "./libs/PayloadMapper";
import { DATA_TYPE } from "./libs/ValueAssigner";

export const SHRINK_SIZE = "72%";
export const CONTAINER_HEIGHT = "calc(100vh - 80px)";

export const WEB_FS_URL = "http://192.168.1.10:9099";

export interface HTTPProps {
  url: string;
  method: string;
  headers: any;
  pathParams: any;
  queryParams: any;
  body: any;
}

export interface Settings {
  theme: string;
  buildPaths: string[];
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

export const resolveData = (data: DATA_VALUE, store: any) => {
  if (store && data.value && data.type === "store") {
    const { name, path } = data.value;
    try {
      return (((store[name] || {}).values || {})[path] || {}).value;
    } catch {}
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

export const executeHTTPCall = (
  props: HTTPProps,
  onResponse: (text: string) => void,
  onError: (status: number, statusText: string, e: string) => void
) => {
  console.log(props);
  const method = props.method || "get";
  let modifiedURL = props.url;

  Object.keys(props.pathParams || {}).forEach((k) => {
    modifiedURL = modifiedURL.replaceAll(
      "{" + k + "}",
      String(props.pathParams[k] || "")
    );
  });

  let queryString: string = "";

  Object.keys(props.queryParams || {}).forEach((k) => {
    queryString =
      (queryString ? "&" : "?") + k + "=" + String(props.queryParams[k] || "");
  });

  modifiedURL = modifiedURL + queryString;

  fetch(modifiedURL, {
    method: props.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(props.headers || {}),
    },
    body:
      method.toLowerCase() === "get" || method.toLowerCase() === "head"
        ? undefined
        : JSON.stringify(props.body),
  })
    .then((res) => {
      if (res.ok) {
        res.text().then(onResponse);
      } else {
        res.text().then((resContent) => {
          onError(res.status, res.statusText, resContent);
        });
      }
    })
    .catch((e) => onError(500, "error", e.message));
};

export const mergeDefaultValues = (
  tree: TreeNode,
  values: Record<string, DATA_VALUE>,
  json: any,
  store: any,
  keys?: Record<string, string>,
  parent: string = ""
) => {
  if (tree) {
    if (isLeaf(tree)) {
      if (keys) {
        keys[parent + "." + tree.name] = tree.id;
      }
      stringToObj(
        tree.path,
        values[tree.id] || { type: "string", value: "" },
        json,
        store
      );
    } else {
      (tree.children || []).forEach((c) => {
        mergeDefaultValues(
          c,
          values,
          json,
          store,
          keys,
          parent ? parent + "." + tree.name : tree.name
        );
      });
    }
  }
};

export const stringToObj = (
  key: string,
  value: DATA_VALUE,
  obj: any,
  store: any
) => {
  const parts = key.split(".");
  const lastKey = parts.pop();
  if (lastKey) {
    let part;
    while ((part = parts.shift())) {
      if (typeof obj[part] != "object") obj[part] = {};
      obj = obj[part];
    }
    obj[lastKey] = resolveData(value, store);
  }
  return obj;
};

export const mergeJSONWithValues = (
  json: any,
  values: any,
  store: any,
  parent: string = ""
) => {
  Object.keys(json).forEach((k, i) => {
    if (json[k] && typeof json[k] === "object" && !Array.isArray(json[k])) {
      mergeJSONWithValues(
        json[k],
        values,
        store,
        parent ? parent + "." + i : "" + i
      );
    } else {
      if (values && values[parent + "." + i]) {
        json[k] = resolveData(values[parent + "." + i], store);
      } else {
        json[k] = undefined;
      }
    }
  });
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
