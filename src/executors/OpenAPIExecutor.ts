import { resolveData } from "../Constants";
import { DataSource } from "../routes/datasources/DatasourceExplorer";

const mergeValues = (json: any, values: any, parent: string = "") => {
  Object.keys(json).forEach((k, i) => {
    if (json[k] && typeof json[k] === "object" && !Array.isArray(json[k])) {
      mergeValues(json[k], values, parent ? parent + "." + i : "" + i);
    } else {
      if (values && values[parent + "." + i]) {
        json[k] = resolveData(values[parent + "." + i]);
      } else {
        json[k] = undefined;
      }
    }
  });
};

export const executeOpenAPI = (
  datasource: DataSource,
  apiFetch: any,
  onResponse: (res: any) => void,
  onError: (e: Error) => void
) => {
  const { apiID, controllerId, operationId } = datasource.props;
  const headerJSON = {
    header: {
      ...datasource.props.schema.header,
    },
  };
  mergeValues(headerJSON, datasource.props.headersDefaultValues);

  const pathJSON = {
    path: {
      ...datasource.props.schema.path,
    },
  };
  mergeValues(pathJSON, datasource.props.pathsDefaultValues);

  const queryJSON = {
    query: {
      ...datasource.props.schema.query,
    },
  };
  mergeValues(queryJSON, datasource.props.paramsDefaultValues);

  const bodyJSON = {
    body: {
      ...datasource.props.schema.body,
    },
  };
  mergeValues(bodyJSON, datasource.props.bodyDefaultValues);

  apiFetch({
    apiId: apiID,
    controllerId,
    operationId,
    params: {
      ...pathJSON.path,
      ...headerJSON.header,
      ...queryJSON.query,
      ...bodyJSON.body,
    },
  })
    .then(onResponse)
    .catch(onError);
};
