import set from 'lodash/set';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import { fetchDataFromHTTP } from '../utils/network';
import { applyVariables } from '../utils/widget-parsing';
import { GRAPH_API_KEY, GRAPH_API_URL, GRAPH_HOSTED_SERVICE_URL } from '../../constants';
import Store from '../store';

export default async function fetchWidgetDataFromTheGraph(config, fieldsRequired, variables) {
  const {
    subgraphId, entity, orderBy, orderDirection, skip = 0, first, filters,
  } = config;

  // Assume hosted service if the subgraphId is has in author/name format
  const isHostedService = subgraphId.includes('/');

  const fieldsObject = {};
  fieldsRequired.forEach((field) => set(fieldsObject, field, true));

  let queryFilters = {
    orderBy, orderDirection, skip, first, ...filters,
  };
  queryFilters = applyVariables(queryFilters, variables);

  Object.keys(queryFilters).forEach((k) => {
    if (queryFilters[k] === undefined) {
      delete queryFilters[k];
    }
  });

  const queryObj = {
    query: {
      [entity]: {
        __args: queryFilters,
        ...fieldsObject,
      },
    },
  };
  const query = jsonToGraphQLQuery(queryObj, { pretty: true });

  const apiKey = Store.getTheGraphAPIKey() || GRAPH_API_KEY;

  let url = `${GRAPH_API_URL}/${apiKey}/subgraphs/id/${subgraphId}`;
  if (isHostedService) {
    url = `${GRAPH_HOSTED_SERVICE_URL}/${subgraphId}`;
  }

  const result = await fetchDataFromHTTP({
    url,
    method: 'POST',
    data: {
      query,
    },
  });

  if (result.errors) {
    throw new Error(`Error while querying data from subgraph ${subgraphId} \n${JSON.stringify(result.errors)}`);
  }

  return result.data?.[entity] ?? null;
}
