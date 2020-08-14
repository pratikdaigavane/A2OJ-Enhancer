
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
//     if (request.todo == "showPageAction")
//     {
//         chrome.tabs.query({active:true,currentWindow: true}, function(tabs){
//             chrome.pageAction.show(tabs[0].id);
//         });
//     }
// });

chrome.runtime.onInstalled.addListener(function (object) {
    chrome.tabs.create({url: "https://a2oj.pratikdaigavane.me"}, function (tab) {
        console.log("New tab launched with https://a2oj.pratikdaigavane.me",object);
    });
});
