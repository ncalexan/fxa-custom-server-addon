// -*- Mode: js2; tab-width: 2; indent-tabs-mode: nil; js2-basic-offset: 2; js2-skip-preprocessor-directives: t; -*-
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { classes: Cc, interfaces: Ci, utils: Cu } = Components; /*global Components*/

Cu.import("resource://gre/modules/Services.jsm"); /*global Services*/
Cu.import("resource://gre/modules/XPCOMUtils.jsm"); /*global XPCOMUtils*/

// An example of how to create a string bundle for localization.
XPCOMUtils.defineLazyGetter(this, "Strings", function() {
  return Services.strings.createBundle("chrome://skeleton/locale/skeleton.properties");
}); /*global Strings*/

// An example of how to import a helper module.
XPCOMUtils.defineLazyGetter(this, "Helper", function() {
  let sandbox = {};
  Services.scriptloader.loadSubScript("chrome://skeleton/content/helper.js", sandbox);
  return sandbox["Helper"];
}); /*global Helper*/

function isNativeUI() {
  return (Services.appinfo.ID == "{aa3c5121-dab2-40e2-81ca-7ea25febc110}");
}

function launchSetup(aWindow) {
  aWindow.NativeWindow.toast.show(Strings.GetStringFromName("toast.message"), "short");
  let extras = Helper.getPrefs();

  Cu.import("resource://gre/modules/Prompt.jsm"); /*global Prompt*/
  var p = new Prompt({
    window: aWindow,
    title: Strings.GetStringFromName("prompt.title"),
    buttons: [
      Strings.GetStringFromName("prompt.button.launch"),
      Strings.GetStringFromName("prompt.button.save"),
      Strings.GetStringFromName("prompt.button.cancel"),
    ],
  }).addTextbox({
    value: extras.auth,
    id: "auth",
    hint: Strings.GetStringFromName("prompt.hint.auth"),
    autofocus: true,
  }).addTextbox({
    value: extras.services.sync,
    id: "services.sync",
    hint: Strings.GetStringFromName("prompt.hint.services.sync"),
    autofocus: false,
  });

  p.show(function(data) {
    // "Cancel" does nothing.
    if (data.button == 2) {
      return;
    }

    // Both "Save" and "Launch" write for next time.
    extras.auth = data["auth"];
    extras.services.sync = data["services.sync"];
    Helper.setPrefs(extras);

    if (data.button == 1) {
      return;
    }

    // Only "Launch" actually launches.
    Cu.import("resource://gre/modules/Accounts.jsm"); /*global Accounts*/
    Accounts.launchSetup(extras);
  });
}

var gMenuId = null;

function loadIntoWindow(window) {
  if (!window)
    return;

  if (isNativeUI()) {
    let title = Strings.GetStringFromName("menu.title");    
    gMenuId = window.NativeWindow.menu.add(title, null, function() { launchSetup(window); });
  }
}

function unloadFromWindow(window) {
  if (!window)
    return;

  if (isNativeUI()) {
    window.NativeWindow.menu.remove(gMenuId);
  }
}

/**
 * bootstrap.js API
 */
var windowListener = {
  onOpenWindow: function(aWindow) {
    // Wait for the window to finish loading
    let domWindow = aWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowInternal || Ci.nsIDOMWindow);
    domWindow.addEventListener("load", function() {
      domWindow.removeEventListener("load", arguments.callee, false);
      loadIntoWindow(domWindow);
    }, false);
  },
  
  onCloseWindow: function(aWindow) {
  },
  
  onWindowTitleChange: function(aWindow, aTitle) {
  }
};

function startup(aData, aReason) {
  // Load into any existing windows
  let windows = Services.wm.getEnumerator("navigator:browser");
  while (windows.hasMoreElements()) {
    let domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);
    loadIntoWindow(domWindow);
  }

  // Load into any new windows
  Services.wm.addListener(windowListener);

  // Always set the default prefs as they disappear on restart.
  Helper.setDefaultPrefs();
}

function shutdown(aData, aReason) {
  // When the application is shutting down we normally don't have to clean
  // up any UI changes made
  if (aReason == APP_SHUTDOWN)
    return;

  // Stop listening for new windows
  Services.wm.removeListener(windowListener);

  // Unload from any existing windows
  let windows = Services.wm.getEnumerator("navigator:browser");
  while (windows.hasMoreElements()) {
    let domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);
    unloadFromWindow(domWindow);
  }
}

function install(aData, aReason) {
}

function uninstall(aData, aReason) {
}
