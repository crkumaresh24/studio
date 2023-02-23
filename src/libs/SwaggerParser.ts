import { KeyValueEntry } from "../Constants";

export const parseSwaggerSpec = (
  urls: KeyValueEntry[],
  onSuccess: (parsed: any) => void,
  onError: (e: any) => void
) => {
  const parseSwaggerJSON = (json: any): any => {
    let parsed: any = {
      schemas: {},
    };
    Object.keys(json.paths).forEach((path) => {
      Object.keys(json.paths[path]).forEach((operation) => {
        const controllerId = json.paths[path][operation].tags[0];
        const operationId = json.paths[path][operation].operationId;
        let parameters: any = {
          path: {},
          query: {},
          header: {},
          body: {},
        };
        let parametersStructure: any = {
          path: {},
          query: {},
          header: {},
          body: {},
        };
        let schemas: any = {};
        if (json.paths[path][operation].parameters) {
          json.paths[path][operation].parameters.forEach((param: any) => {
            if (param.in === "body") {
              if (param.schema && param.schema.$ref) {
                schemas[param.name] = getSchema(json, param.schema.$ref);
              }
            } else {
              parameters = {
                ...parameters,
                [param.in]: {
                  [param.name]: undefined,
                },
              };
              parametersStructure = {
                ...parameters,
                [param.in]: {
                  [param.name]: param,
                },
              };
            }
          });
        }
        parsed = {
          ...parsed,
          [controllerId]: {
            ...parsed[controllerId],
            [operationId]: {
              ...parameters,
              url: "http://" + json.host + path,
              method: operation,
              body: schemas,
            },
          },
        };
      });
    });
    return parsed;
  };

  const getSchema = (openApiSpec: any, ref: string, schema: any = {}): any => {
    const tokens: string[] = ref.split("/");
    tokens.shift();
    let value = openApiSpec;
    tokens.forEach((t) => {
      value = value[t];
    });
    Object.keys(value.properties).forEach((p) => {
      const type = value.properties[p].type;
      const reference = value.properties[p].$ref;
      if (type) {
        schema = {
          ...schema,
          [p]: value.properties[p].type,
        };
      } else if (reference) {
        schema = {
          ...schema,
          [p]: getSchema(openApiSpec, reference, schema),
        };
      }
    });
    return schema;
  };

  const parse = async (
    urls: KeyValueEntry[],
    parsedAPI: any = {},
    onSuccess: (parsed: any) => void,
    onFailure: (e: any) => void
  ) => {
    try {
      urls.forEach(async (url) => {
        if (url.value) {
          const response = await fetch(url.value);
          if (response.ok) {
            try {
              const json = await response.json();
              parsedAPI = {
                ...parsedAPI,
                [url.key]: parseSwaggerJSON(json),
              };
              const newUrls = urls.filter((u) => u.key !== url.key);
              if (newUrls.length > 0) {
                parse(newUrls, parsedAPI, onSuccess, onFailure);
              } else {
                onSuccess(parsedAPI);
              }
            } catch (e) {
              onFailure(e);
            }
          } else {
            onFailure("api fetch error");
            return;
          }
        }
      });
    } catch (e) {
      onFailure(e);
    }
  };

  parse(
    urls,
    {},
    (parsed) => {
      onSuccess(parsed);
    },
    (e) => {
      onError(e);
    }
  );
};
