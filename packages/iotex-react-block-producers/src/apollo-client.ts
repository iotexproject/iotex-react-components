import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import isBrowser from "is-browser";
import fetch from "isomorphic-unfetch";
// @ts-ignore
import JsonGlobal from "safe-json-globals/get";

const state = isBrowser && JsonGlobal("state");

export const createWebBpApolloClient = (uri: string) =>
  new ApolloClient({
    ssrMode: !isBrowser,
    link: new HttpLink({
      uri,
      fetch
    }),
    cache: isBrowser
      ? new InMemoryCache().restore(state.webBpApolloState)
      : new InMemoryCache()
  });
