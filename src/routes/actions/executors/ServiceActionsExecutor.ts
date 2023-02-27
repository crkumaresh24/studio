import {
  ActionContext,
  ACTION_INDEX_0,
  ACTION_INDEX_1,
} from "./ActionExecutor";
import { executeOpenAPI } from "../../../executors/OpenAPIExecutor";
import { executeHTTP } from "../../../executors/HTTPExecutor";

const callHTTPAction = (context: ActionContext) => {
  console.log(context.services);
  const datasource = (context.services[0] || {})[context.props.value];
  console.log(datasource);
  if (datasource) {
    executeHTTP(
      datasource,
      context.store,
      (res) => {
        context.callBack(ACTION_INDEX_1, res);
      },
      (code, text, response) => {
        context.callBack(ACTION_INDEX_0, code + "," + text + "," + response);
      }
    );
  } else {
    context.callBack(ACTION_INDEX_0, "no service found");
  }
};

const callOpenAAPIAction = (context: ActionContext) => {
  const datasource = (context.services[1] || {})[context.props.value];
  if (datasource) {
    executeOpenAPI(
      datasource,
      context.store,
      (res) => {
        context.callBack(ACTION_INDEX_1, res);
      },
      (code, text, response) => {
        context.callBack(ACTION_INDEX_0, code + "," + text + "," + response);
      }
    );
  } else {
    context.callBack(ACTION_INDEX_0, "no service found");
  }
};

export const services = {
  http: callHTTPAction,
  openapi: callOpenAAPIAction,
};
