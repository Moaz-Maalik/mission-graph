/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as logic_recompute from "../logic/recompute.js";
import type * as logic_validateRelationship from "../logic/validateRelationship.js";
import type * as mutations_createComponent from "../mutations/createComponent.js";
import type * as mutations_createRelationship from "../mutations/createRelationship.js";
import type * as mutations_runSubflow from "../mutations/runSubflow.js";
import type * as mutations_seedGraph from "../mutations/seedGraph.js";
import type * as mutations_seedTypes from "../mutations/seedTypes.js";
import type * as mutations_updateComponentData from "../mutations/updateComponentData.js";
import type * as mutations_updateComponentPosition from "../mutations/updateComponentPosition.js";
import type * as mutations_updateInputValue from "../mutations/updateInputValue.js";
import type * as queries_getComponentTypes from "../queries/getComponentTypes.js";
import type * as queries_getGraph from "../queries/getGraph.js";
import type * as subflows_registry from "../subflows/registry.js";
import type * as subflows_showDependencies from "../subflows/showDependencies.js";
import type * as subflows_showDependents from "../subflows/showDependents.js";
import type * as subflows_traceComputation from "../subflows/traceComputation.js";
import type * as subflows_types from "../subflows/types.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "logic/recompute": typeof logic_recompute;
  "logic/validateRelationship": typeof logic_validateRelationship;
  "mutations/createComponent": typeof mutations_createComponent;
  "mutations/createRelationship": typeof mutations_createRelationship;
  "mutations/runSubflow": typeof mutations_runSubflow;
  "mutations/seedGraph": typeof mutations_seedGraph;
  "mutations/seedTypes": typeof mutations_seedTypes;
  "mutations/updateComponentData": typeof mutations_updateComponentData;
  "mutations/updateComponentPosition": typeof mutations_updateComponentPosition;
  "mutations/updateInputValue": typeof mutations_updateInputValue;
  "queries/getComponentTypes": typeof queries_getComponentTypes;
  "queries/getGraph": typeof queries_getGraph;
  "subflows/registry": typeof subflows_registry;
  "subflows/showDependencies": typeof subflows_showDependencies;
  "subflows/showDependents": typeof subflows_showDependents;
  "subflows/traceComputation": typeof subflows_traceComputation;
  "subflows/types": typeof subflows_types;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
