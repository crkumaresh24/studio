import { KeyValueEntry, mergeDefaultValues, Settings } from "../Constants";
import { DataSource } from "../routes/datasources/DatasourceExplorer";

export const executeOpenQuery = (
  datasource: DataSource,
  store: any,
  settings: Settings | undefined,
  onResponse: (res: string) => void,
  onError: (statusCode: number, statusText: string, response: string) => void
) => {
  const { queryTxt, tree, defaultValues, queryId } = datasource.props;
  let queryVars: any = {};
  let url: string | undefined;
  if (queryId && settings && settings.queries) {
    url = (
      settings.queries.filter((q: KeyValueEntry) => q.key === queryId)[0] || {}
    ).value;
  }
  if (url) {
    mergeDefaultValues(tree, defaultValues, queryVars, store);
    fetch(url + "/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        queryTxt,
        queryVars: queryVars["$"] || {},
      }),
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
  }
};
