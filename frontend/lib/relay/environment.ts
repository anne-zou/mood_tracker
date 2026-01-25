import { Environment, Network, RecordSource, Store, FetchFunction } from 'relay-runtime';
import { supabase } from '../supabase';

const GRAPHQL_URL = process.env.EXPO_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';

/**
 * Fetch function for Relay Network layer
 * Handles authentication via Supabase session tokens
 */
const fetchQuery: FetchFunction = async (operation, variables) => {
  try {
    // Get current Supabase session
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({
        query: operation.text,
        variables,
      }),
    });

    const json = await response.json();

    if (json.errors) {
      console.error('GraphQL errors:', json.errors);
    }

    return json;
  } catch (error) {
    console.error('Network error in Relay fetch:', error);
    throw error;
  }
};

// Create Relay Network with our fetch function
const network = Network.create(fetchQuery);

// Create Relay Store
const store = new Store(new RecordSource());

// Create and export the Relay Environment
export const RelayEnvironment = new Environment({
  network,
  store,
});
