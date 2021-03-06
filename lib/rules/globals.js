/**
 * @fileoverview Definitions for global Meteor variables based on environment
 * @author Dominik Ferber
 * @copyright 2015 Dominik Ferber. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

import {Variable} from 'escope'
import {NON_METEOR} from '../util/environment'
import globalsExportedByPackages from '../util/data/globalsExportedByPackages'
import {getMeteorSettings} from '../util'
// -----------------------------------------------------------------------------
// Rule Definition
// -----------------------------------------------------------------------------

module.exports = getMeta => context => {

  const {env} = getMeta(context)
  const {collections} = getMeteorSettings(context.settings)

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  function generateGlobalVariable (name, scope) {
    const variable = new Variable(name, scope)
    variable.eslintExplicitGlobal = false
    variable.writeable = true
    return variable
  }

  // ---------------------------------------------------------------------------
  // Public
  // ---------------------------------------------------------------------------

  if (env === NON_METEOR) {
    return {}
  }

  return {

    Program: function () {
      const globalScope = context.getScope()
      const variables = globalScope.variables

      // add variables of environment to globals
      Object.keys(globalsExportedByPackages).forEach(globalVar => {
        const globalVarEnv = globalsExportedByPackages[globalVar]
        if (globalVarEnv.indexOf(env) !== -1) {
          variables.push(generateGlobalVariable(globalVar, globalScope))
        }
      })

      // add Collections to globals
      collections.map(collection => {
        variables.push(generateGlobalVariable(collection, globalScope))
      })
    }
  }
}

module.exports.schema = []
