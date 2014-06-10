# Create Firefox Accounts with custom server URLs

This is a bare-bones addon that launches the Firefox Account setup
process on Firefox for Android with custom server URLs.  Use this to
create a Firefox Account on Android if you are self-hosting either the
Firefox Accounts "auth" server, or the Sync 1.5 "storage" server.

*nota bene: Mozilla's Sync 1.5 storage servers only accept accounts
 hosted by Mozilla's Firefox Account auth server.*

## How to use the add-on

After installing, you will have a new menu item, "Custom Firefox
Account".  Tap it, and enter your custom server URLs.  Tap "Save" to
persist your modified URLs for next time; this is especially handy if
you are copy-and-pasting long server URLs.  Finally, tap "Launch
setup" to start the Firefox Account setup flow.