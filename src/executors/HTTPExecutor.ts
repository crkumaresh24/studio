import { mergeDefaultValues } from "../Constants";
import { DataSource } from "../routes/datasources/DatasourceExplorer";

export const executeHTTP = (
  datasource: DataSource,
  onResponse: (res: string) => void,
  onError: (statusCode: number, statusText: string, response: string) => void
) => {
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
  let modifiedURL = url,
    body: any = {},
    headers: any = {},
    pathParams: any = {},
    queryParams: any = {};
  let queryString: string | undefined = undefined;
  if (method === "post" && bodyTree && bodyDefaultValues) {
    mergeDefaultValues(bodyTree, bodyDefaultValues, body);
  }
  if (headersTree && headersDefaultValues) {
    mergeDefaultValues(headersTree, headersDefaultValues, headers);
  }
  if (paramsTree && paramsDefaultValues) {
    mergeDefaultValues(paramsTree, paramsDefaultValues, queryParams);
    Object.keys(queryParams["$"] || {}).forEach((k) => {
      queryString =
        (queryString ? "&" : "?") + k + "=" + String(queryParams["$"][k] || "");
    });
  }
  if (modifiedURL && pathsTree && pathsDefaultValues) {
    mergeDefaultValues(pathsTree, pathsDefaultValues, pathParams);
    Object.keys(pathParams["$"] || {}).forEach((k) => {
      modifiedURL = modifiedURL.replaceAll(
        "${" + k + "}",
        String(pathParams["$"][k] || "")
      );
    });
  }
  fetch(queryString ? modifiedURL + queryString : modifiedURL, {
    method: method || "GET",
    headers: {
      ...(headers["$"] || {}),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body["$"]),
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
