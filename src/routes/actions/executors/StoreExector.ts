import {
  ActionContext,
  ACTION_INDEX_0,
  ACTION_INDEX_1,
} from "./ActionExecutor";

const get = (context: ActionContext) => {
  const { name, path } = context.props.value;
  if (name && path) {
    context.callBack(ACTION_INDEX_1, context.store[name].values[path]);
  } else {
    context.callBack(ACTION_INDEX_0, "invalid componenet name or path");
  }
};

const set = (context: ActionContext) => {
  const { name, path } = context.props.value;
  if (name && path) {
    context.store[name].values[path] = context.value;
    context.callBack(ACTION_INDEX_1, context.value);
  } else {
    context.callBack(ACTION_INDEX_0, "invalid componenet name or path");
  }
};

export const store = {
  get,
  set,
};
