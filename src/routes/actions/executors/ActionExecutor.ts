import { App } from "../../../Constants";
import { general } from "./GeneralActionsExector";
import { json } from "./JSONExecutor";
import { services } from "./ServiceActionsExecutor";
import { store } from "./StoreExector";

let executors: any = {
  general,
  services,
  json,
  components: store,
};

export const ACTION_INDEX_0 = "0";
export const ACTION_INDEX_1 = "1";
export const ACTION_INDEX_2 = "2";

export interface ActionContext {
  props: any;
  store: any;
  services: any;
  log?: (log: string) => void;
  callBack: (actionIndex: string, value?: any) => void;
  value?: any;
}

export interface ActionResponse {
  logs: string[];
  store: any;
}

export type NextActions = Record<string, string[]>;

const executeActions = (
  app: App,
  actions: string[],
  value?: any,
  log?: (log: string) => void
) => {
  (actions || []).forEach((action) => {
    const node = app.nodes.filter((n) => n.id === action)[0];
    if (node) {
      const type = node.data.actionType;
      const group = node.data.group;
      console.log(group, type);
      executors[group][type]({
        props: node.data.props,
        store: app.store,
        log,
        services: app.services,
        callBack: (actionIndex: string, value?: any) => {
          executeActions(app, node.actions[actionIndex], value, log);
        },
        value,
      });
    }
  });
};

export { executeActions as executeAction };
