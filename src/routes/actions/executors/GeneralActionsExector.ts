import { ActionContext, ACTION_INDEX_1 } from "./ActionExecutor";

const startAction = (context: ActionContext) => {
  context.callBack(ACTION_INDEX_1, context.value);
};

const logAction = (context: ActionContext) => {
  context.log && context.log(context.value);
};

export const general = {
  start: startAction,
  log: logAction,
};
