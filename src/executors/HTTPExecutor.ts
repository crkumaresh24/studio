import { executeHTTPCall, HTTPProps, mergeDefaultValues } from "../Constants";
import { DataSource } from "../routes/datasources/DatasourceExplorer";

export const executeHTTP = (
  datasource: DataSource,
  store: any,
  onResponse: (res: string) => void,
  onError: (statusCode: number, statusText: string, response: string) => void
) => {
  executeHTTPCall(getHTTPProps(store, datasource), onResponse, onError);
};

export const getHTTPProps = (store: any, datasource: DataSource): HTTPProps => {
  const {
    url,
    method,
    bodyDefaultValues,
    bodyTree,
    headersDefaultValues,
    headersTree,
    paramsDefaultValues,
    paramsTree,
    pathsDefaultValues,
    pathsTree,
  } = datasource.props;

  console.log(store);

  let body: any = {},
    headers: any = {},
    pathParams: any = {},
    queryParams: any = {};  

  if (method === "post" && bodyTree && bodyDefaultValues) {
    mergeDefaultValues(bodyTree, bodyDefaultValues, body, store);
  }
  if (headersTree && headersDefaultValues) {
    mergeDefaultValues(headersTree, headersDefaultValues, headers, store);
  }
  if (paramsTree && paramsDefaultValues) {
    mergeDefaultValues(paramsTree, paramsDefaultValues, queryParams, store);
  }
  if (pathsTree && pathsDefaultValues) {
    mergeDefaultValues(pathsTree, pathsDefaultValues, pathParams, store);
  }

  console.log(paramsDefaultValues);

  return {
    url,
    method,
    headers: headers["$"],
    queryParams: queryParams["$"],
    pathParams: pathParams["$"],
    body,
  };
};
