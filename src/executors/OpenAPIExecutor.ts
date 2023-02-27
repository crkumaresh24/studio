import { executeHTTPCall, HTTPProps, mergeJSONWithValues } from "../Constants";
import { DataSource } from "../routes/datasources/DatasourceExplorer";

export const executeOpenAPI = (
  datasource: DataSource,
  store: any,
  onResponse: (res: any) => void,
  onError: (statusCode: number, statusText: string, response: string) => void
) => {
  executeHTTPCall(
    getHTTPPropsFromOpenAPI(store, datasource),
    onResponse,
    onError
  );
};

export const getHTTPPropsFromOpenAPI = (
  store: any,
  datasource: DataSource
): HTTPProps => {
  console.log(store);
  const { url, method } = datasource.props.schema;
  const headerJSON = {
    header: {
      ...datasource.props.schema.header,
    },
  };
  mergeJSONWithValues(headerJSON, datasource.props.headersDefaultValues, store);

  const pathJSON = {
    path: {
      ...datasource.props.schema.path,
    },
  };
  mergeJSONWithValues(pathJSON, datasource.props.pathsDefaultValues, store);

  const queryJSON = {
    query: {
      ...datasource.props.schema.query,
    },
  };
  mergeJSONWithValues(queryJSON, datasource.props.paramsDefaultValues, store);

  const bodyJSON = {
    body: {
      ...datasource.props.schema.body,
    },
  };
  mergeJSONWithValues(bodyJSON, datasource.props.bodyDefaultValues, store);

  return {
    url,
    method,
    headers: headerJSON.header,
    pathParams: pathJSON.path,
    queryParams: queryJSON.query,
    body: (bodyJSON.body || {})[Object.keys(bodyJSON.body || {})[0]],
  };
};
