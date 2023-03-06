import jsonata from "jsonata";
import {
  ActionContext,
  ACTION_INDEX_0,
  ACTION_INDEX_1,
} from "./ActionExecutor";

const transform = (context: ActionContext) => {
  const { expression } = context.props;
  jsonata(expression)
    .evaluate(context.value)
    .then((r: any) => {
      context.callBack(ACTION_INDEX_1, r);
    })
    .catch((e: any) => {
      context.callBack(ACTION_INDEX_0, e.message);
    });
};

const toJSON = (context: ActionContext) => {
  try {
    context.callBack(ACTION_INDEX_1, JSON.parse(context.value));
  } catch (e: any) {
    context.callBack(ACTION_INDEX_0, e.message);
  }
};

export const json = {
  transform,
  toJSON,
};
