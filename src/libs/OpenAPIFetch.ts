//@ts-ignore
import SwaggerClient from "swagger-client";
import jsonata from "jsonata";
import { KeyValueEntry } from "../Constants";
const API_CLIENTS: any = {};

export interface ApiFetch<R = {}> {
  apiId: string;
  controllerId: string;
  operationId: string;
  params?: R;
  onBeforeFetch?: (params: R | undefined) => void;
  jsonTransform?: string;
  jsonTransformBindings?: any;
  onBeforeJSONTransform?: (reasponse: any) => void;
}

const initAPIs = (
  apis: KeyValueEntry[],
  interceptors?: Record<string, any>
) => {
  apis.forEach((api) => {
    const apiClient: SwaggerClient = new SwaggerClient({
      url: api.value,
      requestInterceptor: interceptors ? interceptors[api.key] : undefined,
    });
    API_CLIENTS[api.key] = apiClient;
  });
};

const apiFetch = async <R>(apiFetchObj: ApiFetch<R>): Promise<any> => {
  const {
    apiId,
    controllerId,
    operationId,
    params,
    onBeforeFetch,
    jsonTransform,
    jsonTransformBindings,
    onBeforeJSONTransform,
  } = apiFetchObj;
  return new Promise((resolve, reject) => {
    if (!API_CLIENTS[apiId]) {
      reject(
        "no apiId with value " +
          apiId +
          " found. kindly initialize using initAPIs([])"
      );
    }
    API_CLIENTS[apiId].then((client: any) => {
      const controller = client.apis[controllerId];
      if (!controller) {
        reject("controller with id " + controllerId + " not found");
      }
      const operation = controller[operationId];
      if (!operation) {
        reject("operation with id " + operationId + " not found");
      }
      onBeforeFetch && onBeforeFetch(params);
      return operation(params)
        .then((res: any) => {
          let response = res.body;
          if (jsonTransform) {
            onBeforeJSONTransform && onBeforeJSONTransform(response);
            if (jsonTransformBindings) {
              response = jsonata(jsonTransform).evaluate(
                response,
                jsonTransformBindings
              );
            } else {
              response = jsonata(jsonTransform).evaluate(response);
            }
          }
          resolve(response);
        })
        .catch((error: any) => reject(error));
    });
  });
};

const openApiFetch = (
  apis: KeyValueEntry[],
  interceptors?: Record<string, any>
): (<R>(apiFetchObj: ApiFetch<R>) => Promise<any>) => {
  initAPIs(apis, interceptors);
  return apiFetch;
};

export default openApiFetch;
