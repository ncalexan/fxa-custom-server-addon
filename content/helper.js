// -*- Mode: js2; tab-width: 2; indent-tabs-mode: nil; js2-basic-offset: 2; js2-skip-preprocessor-directives: t; -*-
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const { classes: Cc, interfaces: Ci, utils: Cu } = Components; /*global Components*/

Cu.import("resource://gre/modules/Services.jsm"); /*global Services*/
Cu.import("resource://gre/modules/XPCOMUtils.jsm"); /*global XPCOMUtils*/

// An example of how to create a string bundle for localization.
XPCOMUtils.defineLazyGetter(this, "Strings", function() {
  return Services.strings.createBundle("chrome://skeleton/locale/defaults.properties");
}); /*global Strings*/

let Helper = {
  get PREF_BRANCH() { return "extensions.fxa.custom.server."; },

  get PREFS() {
    return {
      "auth": Strings.GetStringFromName("auth"),
      "services.sync": Strings.GetStringFromName("services.sync"),
    };
  },

  setDefaultPrefs: function() {
    let branch = Services.prefs.getDefaultBranch(Helper.PREF_BRANCH);
    for (let [key, val] in Iterator(Helper.PREFS)) {
      switch (typeof val) {
        case "boolean":
          branch.setBoolPref(key, val);
          break;
        case "boolean":
          branch.setBoolPref(key, val);
          break;
        case "number":
          branch.setIntPref(key, val);
          break;
        case "string":
          branch.setCharPref(key, val);
          break;
      }
    }
  },

  getPrefs: function() {
    let branch = Services.prefs.getDefaultBranch(Helper.PREF_BRANCH);
    let prefs = {};
    prefs.services = {};
    prefs.auth = branch.getCharPref("auth");
    prefs.services.sync = branch.getCharPref("services.sync");
    return prefs;
  },

  setPrefs: function(prefs) {
    let branch = Services.prefs.getDefaultBranch(Helper.PREF_BRANCH);
    if (prefs.auth) {
      branch.setCharPref("auth", prefs.auth);
    }
    if (prefs.services && prefs.services.sync) {
      branch.setCharPref("services.sync", prefs.services.sync);
    }
  },
};
