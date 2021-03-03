    /**
     * Key used to store common global defaults for our extension
     * @type {string}
     */
    const DEFAULT_SETTINGS_KEY = "default";


    // Default settings from the Playbook
    const defaultSettings = {
        "formData": {
            "gridForm": {
                "settings": {
                "largeWidth": "1280",
                "largeColumns": "16",
                "smallColumns": "8",
                "smallWidth": "600",
                "gutters": "16",
                "outterGutters": "16",
                "mobileInnerGutters": "8",
                "mobileOutterGutters": "16",
                "rowGutters": "16",
                "offsetX": "0",
                "offsetY": "0"
                }
            },
            "reportForm": {
                "settings": {
                "reportOverlayToggle": false,
                "reportOverlaySelector": "body, h1, a, .grid__cell",
                "reportOverlayMatchEmptyElements": false
                }
            }
        },
        "activeTabPanelId": "panel1",
        "activeTabLabelId": "tab1"
    };

  function injectScripts(currentChromeTabId, cb) {
      console.log("Design Grid Overlay JS not already injected, injecting now in", currentChromeTabId);

      chrome.tabs.executeScript(currentChromeTabId, {file: "src/common.js"}, () => {
        chrome.tabs.executeScript(currentChromeTabId, {file: "src/executedScripts/grid.js"}, () => {
          chrome.tabs.executeScript(currentChromeTabId, {file: "src/controllers/gridController.js"}, () => {
            if(cb) cb();
          });
        });
      });
  }

  function storageLoad(tabId, cb) {
      chrome.storage.sync.get([tabId, DEFAULT_SETTINGS_KEY], function (storedData) {
        if (chrome.runtime.lastError) {
          console.error( chrome.runtime.lastError );
          cb(defaultSettings);
        }
        //Override the local var with the actual data we want to load, which is for this specific tab
        //The local data storage is stored by keys that are our TabID's given to us by chrome
        //This call retrieves from the global defaults data as a backup if no tab data is present, and if no default
        //has been stored, it reverts to a blank data object to be filled in.
        cb(storedData[tabId] || storedData[DEFAULT_SETTINGS_KEY] || defaultSettings);
      });
  }