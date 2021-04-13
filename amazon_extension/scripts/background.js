/*
    This is the background page script.
    It listens on chrome tabs that the user opens and
    if it is an amazon's page, it throws the extension. 
*/
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  //  if (changeInfo.status === "complete") {
        chrome.tabs.insertCSS(tabId, {file:'./css/mystyle.css'});
   // }
})
