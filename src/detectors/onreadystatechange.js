/**
 * Copyright 2010 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview: One detector implementation for checking 'IE6 IE7 IE8 extends
 * the event of onreadystatechange' problems
 * @bug: https://code.google.com/p/compatibility-detector/issues/detail?id=17

 *
 * Check each node, if this node both have onreadystatechange and onload,
 * we will suppose that the auther consider this issue ,no problem.
 * If the node just only has onreadystatechange ,there may be a problem.
 *
 */

addScriptToInject(function() {

chrome_comp.CompDetect.declareDetector(

'onreadystatechange',

chrome_comp.CompDetect.ScanDomBaseDetector,

function constructor(rootNode) {
  var This = this;
  this.hookHandler_ = function(oldValue, newValue, reason) {
    // Onreadystatechange and onload combined use in Script tag of filtered
    if (this.tagName === 'SCRIPT' && this.onload) {
      var loadEventHandler = this.onload.toString();
      if (/onreadystatechange/.test(loadEventHandler) &&
          /onload/.test(loadEventHandler))
        return;
    }
    if (!this.onreadystatechange)
      return;
    // Filtering end.

    This.addProblem('BX9021', { nodes: [this], needsStack: true });
    return newValue;
  };
},

function checkNode(node, context) {
  if (Node.ELEMENT_NODE != node.nodeType)
    return;

  // Onreadystatechange and onload attributes use in HTML tag of filtered
  if (node.attributes['onreadystatechange'] === node.attributes['onload'])
    return;

  if (node.hasAttribute('onreadystatechange') &&  node.hasAttribute('onload'))
    return;
  // Filtering end.

  if (node.hasAttribute('onreadystatechange'))
    this.addProblem('BX9021', [node]);
},

function setUp() {
  chrome_comp.CompDetect.registerSimplePropertyHook(
      Element.prototype, 'onreadystatechange', this.hookHandler_);
},

function cleanUp() {
  chrome_comp.CompDetect.unregisterSimplePropertyHook(
      Element.prototype, 'onreadystatechange', this.hookHandler_);
}
); // declareDetector

});
