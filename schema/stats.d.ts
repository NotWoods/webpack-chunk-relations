/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Statistics about modules generated by webpack
 */
export interface WebpackStats {
  /**
   * Version of webpack used for the compilation
   */
  version: string;
  /**
   * Compilation specific hash
   */
  hash: string;
  /**
   * Compilation time in milliseconds
   */
  time: number;
  publicPath: string;
  /**
   * path to webpack output directory
   */
  outputPath: string;
  /**
   * Chunk name to emitted asset(s) mapping
   */
  assetsByChunkName: {
    [k: string]: string[];
  };
  /**
   * A list of asset objects
   */
  assets: {
    /**
     * The chunks this asset contains
     */
    chunkNames: string[];
    /**
     * The chunk IDs this asset contains
     */
    chunks: number[];
    /**
     * Indicates whether or not the asset was compared with the same file on the output file system
     */
    comparedForEmit: string;
    /**
     * Indicates whether or not the asset made it to the `output` directory
     */
    emitted: boolean;
    /**
     * The `output` filename
     */
    name: string;
    /**
     * The size of the file in bytes
     */
    size: number;
    info: {
      /**
       * A flag telling whether the asset can be long term cached (contains a hash)
       */
      immutable: boolean;
      /**
       * The size in bytes, only becomes available after asset has been emitted
       */
      size: number;
      /**
       * A flag telling whether the asset is only used for development and doesn't count towards user-facing assets
       */
      development: boolean;
      /**
       * A flag telling whether the asset ships data for updating an existing application (HMR)
       */
      hotModuleReplacement: boolean;
      /**
       * sourceFilename when asset was created from a source file (potentially transformed)
       */
      sourceFilename: string;
      /**
       * true, when asset is javascript and an ESM
       */
      javascriptModule: boolean;
    };
  }[];
  /**
   * A list of chunk objects
   */
  chunks: {
    /**
     * Indicates whether or not the chunk contains the webpack runtime
     */
    entry: boolean;
    /**
     * An array of filename strings that contain this chunk
     */
    files: string[];
    /**
     * See the description in the top-level structure above
     */
    filteredModules: number;
    /**
     * The ID of this chunk
     */
    id: number;
    /**
     * Indicates whether this chunk is loaded on initial page load or on demand
     */
    initial: boolean;
    /**
     * A list of module objects
     */
    modules: string[];
    /**
     * An list of chunk names contained within this chunk
     */
    names: string[];
    /**
     * list of origins describing how the given chunk originated.
     */
    origins: {
      /**
       * Lines of code that generated this chunk
       */
      loc: string;
      /**
       * Path to the module
       */
      module: string;
      /**
       * The ID of the module
       */
      moduleId: number;
      /**
       * Path to the module
       */
      moduleIdentifier: string;
      /**
       * Relative path to the module
       */
      moduleName: string;
      /**
       * The name of the chunk
       */
      name: string;
      /**
       * A list of the same `reasons` found in module objects
       */
      reasons: Reason[];
    }[];
    /**
     * Parent chunk IDs
     */
    parents: number[];
    /**
     * Indicates whether or not the chunk went through Code Generation
     */
    rendered: boolean;
    /**
     * Chunk size in bytes
     */
    size: number;
  }[];
  /**
   * A list of module objects
   */
  modules: {
    /**
     * A list of asset objects
     */
    assets: unknown[];
    /**
     * Indicates that the module went through Loaders, Parsing, and Code Generation
     */
    built: boolean;
    /**
     * Whether or not this module is cacheable
     */
    cacheable: boolean;
    /**
     * IDs of chunks that contain this module
     */
    chunks: number[];
    /**
     * Number of errors when resolving or processing the module
     */
    errors: number;
    /**
     * Whether or not compilation failed on this module
     */
    failed: boolean;
    /**
     * The ID of the module
     */
    id: number;
    /**
     * A unique ID used internally
     */
    identifier: string;
    /**
     * Path to the actual file
     */
    name: string;
    /**
     * All requests to this module are with `try... catch` blocks
     */
    optional: boolean;
    /**
     * Indicates whether or not the module was prefetched
     */
    prefetched: boolean;
    /**
     * Module specific compilation stats corresponding to the --profile flag (in milliseconds)
     */
    profile?: {
      /**
       * Loading and parsing
       */
      building: number;
      /**
       * Building dependencies
       */
      dependencies: number;
      /**
       * Resolving dependencies
       */
      factory: number;
    };
    reasons: Reason[];
    /**
     * Estimated size of the module in bytes
     */
    size: number;
    /**
     * The stringified raw source
     */
    source: string;
    /**
     * Number of warnings when resolving or processing the module
     */
    warnings: number;
  }[];
  /**
   * A list of entry objects
   */
  entryPoints: {
    [k: string]: {
      name: string;
      chunks: number[];
      assets: {
        name: string;
        size: number;
        [k: string]: unknown;
      }[];
      filteredAssets: string;
      assetsSize: number;
      auxiliaryAssets: unknown[];
      filteredAuxiliaryAssets: string;
      auxiliaryAssetsSize: string;
      children: {
        [k: string]: unknown;
      };
      childAssets: {
        [k: string]: unknown;
      };
      isOverSizeLimit: string;
    };
  };
  /**
   * A list of error objects
   */
  errors: Error[];
  /**
   * number of errors
   */
  errorsCount: number;
  /**
   * A list of warning objects
   */
  warnings: Error[];
  /**
   * number of warnings
   */
  warningsCount: number;
}
/**
 * describes why a module was included in the dependency graph.
 */
export interface Reason {
  /**
   * Lines of code that caused the module to be included
   */
  loc: string;
  /**
   * Relative path to the module based on context
   */
  module: string;
  /**
   * The ID of the module
   */
  moduleId: number;
  /**
   * Path to the module
   */
  moduleIdentifier: string;
  /**
   * A more readable name for the module (used for 'pretty-printing')
   */
  moduleName: string;
  /**
   * The type of request used
   */
  type: string;
  /**
   * Raw string used for the 'import' or 'require' request
   */
  userRequest: string;
}
export interface Error {
  moduleIdentifier: string;
  moduleName: string;
  loc: string;
  message: string;
  moduleId: number;
  moduleTrace: {
    originIdentifier: string;
    originName: string;
    moduleIdentifier: string;
    moduleName: string;
    dependencies: {
      loc: string;
    }[];
    originId: number;
    moduleId: number;
  }[];
  details: string;
  stack?: string;
}
