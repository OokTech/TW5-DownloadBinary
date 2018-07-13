/*\
title: $:/plugins/OokTech/DownloadBinary/action-downloadbinary.js
type: application/javascript
module-type: widget

Action widget to download a binary version of the content oy a base64 encoded
tiddler.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var DownloadBinary = function(parseTreeNode,options) {
  this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
DownloadBinary.prototype = new Widget();

/*
Render this widget into the DOM
*/
DownloadBinary.prototype.render = function(parent,nextSibling) {
  this.computeAttributes();
  this.execute();
};

/*
Compute the internal state of the widget
*/
DownloadBinary.prototype.execute = function() {
  this.tiddler = this.getAttribute("tiddler", this.getVariable("currentTiddler"));
  this.fileName = this.getAttribute("name", this.tiddler);
};

/*
Refresh the widget by ensuring our attributes are up to date
*/
DownloadBinary.prototype.refresh = function(changedTiddlers) {
  var changedAttributes = this.computeAttributes();
  if(changedAttributes["tiddler"] || changedAttributes["name"]) {
    this.refreshSelf();
    return true;
  }
  return this.refreshChildren(changedTiddlers);
};

/*
Invoke the action associated with this widget
*/
DownloadBinary.prototype.invokeAction = function(triggeringWidget,event) {
  var binaryTiddlerTypes = ['image/gif', 'image/x-icon', 'image/jpeg', 'image/jpeg', 'image/png', 'image/svg+xml', 'application/pdf', 'application/zip', 'application/font-woff', 'application/x-font-ttf', 'audio/ogg', 'video/mp4', 'audio/mp3', 'audio/mp4'];
  // Get the tiddler with the data
  var tiddler = $tw.wiki.getTiddler(this.tiddler);
  if (tiddler) {
    // Make sure it is the correct type of tiddler
    if (!tiddler.fields._canonical_uri && binaryTiddlerTypes.indexOf(tiddler.fields.type) !== -1) {
      // Create a download link and then simulate clicking on it to trigger
      // downloading the file.
      var element = document.createElement('a');
      element.setAttribute('href', 'data:'+tiddler.fields.type+';base64,'+tiddler.fields.text);
      element.setAttribute('download', this.fileName);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  }
  return true; // Action was invoked
};

exports["action-downloadbinary"] = DownloadBinary;

})();
