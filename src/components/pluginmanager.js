"use strict";

import * as plugins from "./plugins/plugins.js";
import { defaultOptions } from "./plugins/pluginparmeters.js";
/**
 * Plugin Manager to register different plugin available in the library
 */

class PluginManager {
  /**
   * @public
   * @typedef {Object} PluginOptionsMap
   * @property { { canvasToApplyCrop: HTMLCanvasElement, imagePathToApplyCrop: string, cropBorderColors: string,cropBorderLinewidth: number, listenForTouchInteraction: boolean,
   * listenForMouseInteraction: boolean, sideBordersinCrop: boolean, isCropStyleDocument: boolean, cropBorderStyle: "Rectangle | Square" }} crop
   * @property {{ resizeCanvasToFitImage: boolean }} cut
   */

  /** @type {Map<string, Function>} */
  #plugins = new Map();
  /**
   * register all the default plugins
   */
  constructor() {
    this.#autoregisterPlugin();
  }
  /**
   * register all the default plugins
   */
  #autoregisterPlugin() {
    for (const [name, plugin] of Object.entries(plugins)) {
      if (typeof plugin === "function" && !this.#plugins.has(name)) {
        this.#plugins.set(name, plugin);
      }
    }
  }
  /**
   * @public
   * Function to register custom plugin
   * @param {string} name - name of the plugin
   * @param {Function} func - plugin function
   */
  registerPlugin(name, func) {
    if (this.#plugins.has(name)) {
      throw new Error(
        "Plugin name has already present, please provide different name"
      );
    }
    this.#plugins.set(name, func);
  }
  /**
   * @public
   * Gets the list of available plugin names.
   * @returns {string[]} List of registered plugin names
   */
  getAvailablePlugins() {
    return [...this.#plugins.keys()];
  }
  /**
   * @public
   * Retrieves plugin Parameters based on the plugin name.
   * @template {keyof PluginOptionsMap} T
   * @param {T} name - Name of the plugin
   * @returns {PluginOptionsMap[T]} Default options object for the plugin
   */
  getPluginParameter(name) {
    return defaultOptions[name] || {};
  }
  /**
   * @public
   * Executes the registered plugin with arguments.
   * Raise Exception if plugin is not available
   * @template {keyof PluginOptionsMap} T
   * @param {T} name - Name of the plugin
   * @param {PluginOptionsMap[T]} options - Options specific to the selected plugin
   */
  applyPlugin(name, options = {}) {
    const plugin = this.#plugins.get(name);
    if (!plugin) {
      throw new Error(`Plugin "${name}" is not available.`);
    }
    plugin(options);
  }
}

export { PluginManager };
