import { DATA_SOURCE_TYPE, WEB_FS_URL } from "./Constants";

const workspace = "/workspace";

const saveComponent = (
  content: any,
  name: string,
  onSuccess: () => void,
  onError: (e: Error) => void
) => {
  fetch(
    WEB_FS_URL + "/save?path=" + workspace + "/ide/components&name=" + name,
    {
      method: "POST",
      body: JSON.stringify(content),
    }
  )
    .then((res) =>
      res.ok ? onSuccess() : onError(new Error("received status " + res.status))
    )
    .catch(onError);
};

const readComponent = (
  name: string,
  onSuccess: (content: any) => void,
  onError: (e: Error) => void
) => {
  fetch(WEB_FS_URL + "/read?path=" + workspace + "/ide/components/" + name)
    .then((req) => req.json())
    .then(onSuccess)
    .catch(onError);
};

const listComponents = (
  onSuccess: (actions: string[]) => void,
  onError: (e: Error) => void
) => {
  fetch(WEB_FS_URL + "/list?path=" + workspace + "/ide/components")
    .then((req) => req.json())
    .then(onSuccess)
    .catch(onError);
};

const removeComponent = (
  name: string,
  onSuccess: (content: any) => void,
  onError: (e: Error) => void
) => {
  fetch(WEB_FS_URL + "/remove?path=" + workspace + "/ide/components/" + name, {
    method: "DELETE",
  })
    .then(onSuccess)
    .catch(onError);
};

const saveStore = (
  content: any,
  onSuccess: () => void,
  onError: (e: Error) => void
) => {
  fetch(WEB_FS_URL + "/save?path=" + workspace + "/ide&name=store.json", {
    method: "POST",
    body: JSON.stringify(content),
  })
    .then(onSuccess)
    .catch(onError);
};

const readStore = (
  onSuccess: (content: any) => void,
  onError: (e: Error) => void
) => {
  fetch(WEB_FS_URL + "/store?workspace=" + workspace)
    .then((req) => req.json())
    .then(onSuccess)
    .catch(onError);
};

const saveDatasource = (
  content: any,
  type: DATA_SOURCE_TYPE,
  name: string,
  onSuccess: () => void,
  onError: (e: Error) => void
) => {
  fetch(
    WEB_FS_URL +
      "/save?path=" +
      workspace +
      "/ide/datasources/" +
      type +
      "&name=" +
      name,
    {
      method: "POST",
      body: JSON.stringify(content),
    }
  )
    .then(onSuccess)
    .catch(onError);
};

const readDatasource = (
  type: DATA_SOURCE_TYPE,
  name: string,
  onSuccess: (content: any) => void,
  onError: (e: Error) => void
) => {
  fetch(
    WEB_FS_URL +
      "/read?path=" +
      workspace +
      "/ide/datasources/" +
      type +
      "/" +
      name
  )
    .then((req) => req.json())
    .then(onSuccess)
    .catch(onError);
};

const listDatasources = (
  type: DATA_SOURCE_TYPE,
  onSuccess: (list: string[]) => void,
  onError: (e: Error) => void
) => {
  fetch(WEB_FS_URL + "/list?path=" + workspace + "/ide/datasources/" + type)
    .then((req) => req.json())
    .then(onSuccess)
    .catch(onError);
};

const removeDatasource = (
  type: DATA_SOURCE_TYPE,
  name: string,
  onSuccess: (content: any) => void,
  onError: (e: Error) => void
) => {
  fetch(
    WEB_FS_URL +
      "/remove?path=" +
      workspace +
      "/ide/datasources/" +
      type +
      "/" +
      name,
    {
      method: "DELETE",
    }
  )
    .then(onSuccess)
    .catch(onError);
};

const saveAction = (
  content: any,
  name: string,
  onSuccess: () => void,
  onError: (e: Error) => void
) => {
  fetch(WEB_FS_URL + "/save?path=" + workspace + "/ide/actions&name=" + name, {
    method: "POST",
    body: JSON.stringify(content),
  })
    .then((res) =>
      res.ok ? onSuccess() : onError(new Error("received status " + res.status))
    )
    .catch(onError);
};

const readAction = (
  name: string,
  onSuccess: (content: any) => void,
  onError: (e: Error) => void
) => {
  fetch(WEB_FS_URL + "/read?path=" + workspace + "/ide/actions/" + name)
    .then((req) => req.json())
    .then(onSuccess)
    .catch(onError);
};

const listActions = (
  onSuccess: (actions: string[]) => void,
  onError: (e: Error) => void
) => {
  fetch(WEB_FS_URL + "/list?path=" + workspace + "/ide/actions")
    .then((req) => req.json())
    .then(onSuccess)
    .catch(onError);
};

const removeAction = (
  name: string,
  onSuccess: (content: any) => void,
  onError: (e: Error) => void
) => {
  fetch(WEB_FS_URL + "/remove?path=" + workspace + "/ide/actions/" + name, {
    method: "DELETE",
  })
    .then(onSuccess)
    .catch(onError);
};

const saveSettings = (
  content: any,
  onSuccess: () => void,
  onError: (e: Error) => void
) => {
  fetch(WEB_FS_URL + "/save?path=" + workspace + "/ide&name=settings.json", {
    method: "POST",
    body: JSON.stringify(content),
  })
    .then(onSuccess)
    .catch(onError);
};

const readSettings = (
  onSuccess: (content: any) => void,
  onError: (e: Error) => void
) => {
  fetch(WEB_FS_URL + "/read?path=" + workspace + "/ide/settings.json")
    .then((req) => req.json())
    .then(onSuccess)
    .catch(onError);
};

const publish = (
  targetPaths: string[],
  onSuccess: (res: string) => void,
  onError: (e: Error) => void
) => {
  fetch(WEB_FS_URL + "/publish?workspace=" + workspace, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      targetPaths,
    }),
  })
    .then((req) => req.text())
    .then(onSuccess)
    .catch(onError);
};

export {
  saveComponent,
  readComponent,
  listComponents,
  removeComponent,
  saveDatasource,
  readDatasource,
  listDatasources,
  removeDatasource,
  saveAction,
  readAction,
  listActions,
  removeAction,
  readStore,
  saveStore,
  saveSettings,
  readSettings,
  publish,
};
