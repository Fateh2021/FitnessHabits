(this.webpackJsonpfithab=this.webpackJsonpfithab||[]).push([[39],{320:function(t,e,r){"use strict";r.r(e),r.d(e,"ion_reorder",(function(){return s})),r.d(e,"ion_reorder_group",(function(){return l}));var n=r(2),o=r(58),i=(r(18),r(380)),s=function(){function t(t){Object(o.l)(this,t)}return t.prototype.onClick=function(t){t.preventDefault(),t.stopImmediatePropagation()},t.prototype.render=function(){return Object(o.i)(o.a,{class:Object(o.d)(this)},Object(o.i)("slot",null,Object(o.i)("ion-icon",{name:"reorder",lazy:!1,class:"reorder-icon"})))},Object.defineProperty(t,"style",{get:function(){return":host([slot]){display:none;line-height:0;z-index:100}.reorder-icon{display:block;font-size:22px;font-size:34px;opacity:.4}"},enumerable:!0,configurable:!0}),t}(),l=function(){function t(t){Object(o.l)(this,t),this.lastToIndex=-1,this.cachedHeights=[],this.scrollElTop=0,this.scrollElBottom=0,this.scrollElInitial=0,this.containerTop=0,this.containerBottom=0,this.state=0,this.disabled=!0,this.ionItemReorder=Object(o.e)(this,"ionItemReorder",7)}return t.prototype.disabledChanged=function(){this.gesture&&this.gesture.setDisabled(this.disabled)},t.prototype.connectedCallback=function(){return Object(n.__awaiter)(this,void 0,void 0,(function(){var t,e,o,i=this;return Object(n.__generator)(this,(function(n){switch(n.label){case 0:return(t=this.el.closest("ion-content"))?(e=this,[4,t.getScrollElement()]):[3,2];case 1:e.scrollEl=n.sent(),n.label=2;case 2:return o=this,[4,Promise.resolve().then(r.bind(null,87))];case 3:return o.gesture=n.sent().createGesture({el:this.el,gestureName:"reorder",gesturePriority:110,threshold:0,direction:"y",passive:!1,canStart:function(t){return i.canStart(t)},onStart:function(t){return i.onStart(t)},onMove:function(t){return i.onMove(t)},onEnd:function(){return i.onEnd()}}),this.disabledChanged(),[2]}}))}))},t.prototype.disconnectedCallback=function(){this.onEnd(),this.gesture&&(this.gesture.destroy(),this.gesture=void 0)},t.prototype.complete=function(t){return Promise.resolve(this.completeSync(t))},t.prototype.canStart=function(t){if(this.selectedItemEl||0!==this.state)return!1;var e=t.event.target.closest("ion-reorder");if(!e)return!1;var r=a(e,this.el);return!!r&&(t.data=r,!0)},t.prototype.onStart=function(t){t.event.preventDefault();var e=this.selectedItemEl=t.data,r=this.cachedHeights;r.length=0;var n=this.el,o=n.children;if(o&&0!==o.length){for(var s=0,l=0;l<o.length;l++){var a=o[l];s+=a.offsetHeight,r.push(s),a.$ionIndex=l}var d=n.getBoundingClientRect();if(this.containerTop=d.top,this.containerBottom=d.bottom,this.scrollEl){var f=this.scrollEl.getBoundingClientRect();this.scrollElInitial=this.scrollEl.scrollTop,this.scrollElTop=f.top+h,this.scrollElBottom=f.bottom-h}else this.scrollElInitial=0,this.scrollElTop=0,this.scrollElBottom=0;this.lastToIndex=c(e),this.selectedItemHeight=e.offsetHeight,this.state=1,e.classList.add(u),Object(i.a)()}},t.prototype.onMove=function(t){var e=this.selectedItemEl;if(e){var r=this.autoscroll(t.currentY),n=this.containerTop-r,o=this.containerBottom-r,s=Math.max(n,Math.min(t.currentY,o)),l=r+s-t.startY,a=s-n,h=this.itemIndexForTop(a);if(h!==this.lastToIndex){var d=c(e);this.lastToIndex=h,Object(i.b)(),this.reorderMove(d,h)}e.style.transform="translateY("+l+"px)"}},t.prototype.onEnd=function(){var t=this.selectedItemEl;if(this.state=2,t){var e=this.lastToIndex,r=c(t);e===r?this.completeSync():this.ionItemReorder.emit({from:r,to:e,complete:this.completeSync.bind(this)}),Object(i.c)()}else this.state=0},t.prototype.completeSync=function(t){var e=this.selectedItemEl;if(e&&2===this.state){var r=this.el.children,n=r.length,o=this.lastToIndex,i=c(e);if(o!==i&&(!t||!0===t)){var s=i<o?r[o+1]:r[o];this.el.insertBefore(e,s)}Array.isArray(t)&&(t=f(t,i,o));for(var l=0;l<n;l++)r[l].style.transform="";e.style.transition="",e.classList.remove(u),this.selectedItemEl=void 0,this.state=0}return t},t.prototype.itemIndexForTop=function(t){var e=this.cachedHeights,r=0;for(r=0;r<e.length&&!(e[r]>t);r++);return r},t.prototype.reorderMove=function(t,e){for(var r=this.selectedItemHeight,n=this.el.children,o=0;o<n.length;o++){var i="";o>t&&o<=e?i="translateY("+-r+"px)":o<t&&o>=e&&(i="translateY("+r+"px)"),n[o].style.transform=i}},t.prototype.autoscroll=function(t){if(!this.scrollEl)return 0;var e=0;return t<this.scrollElTop?e=-d:t>this.scrollElBottom&&(e=d),0!==e&&this.scrollEl.scrollBy(0,e),this.scrollEl.scrollTop-this.scrollElInitial},t.prototype.render=function(){var t,e=Object(o.d)(this);return Object(o.i)(o.a,{class:(t={},t[e]=!0,t["reorder-enabled"]=!this.disabled,t["reorder-list-active"]=0!==this.state,t)})},Object.defineProperty(t.prototype,"el",{get:function(){return Object(o.f)(this)},enumerable:!0,configurable:!0}),Object.defineProperty(t,"watchers",{get:function(){return{disabled:["disabledChanged"]}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return".reorder-list-active>*{-webkit-transition:-webkit-transform .3s;transition:-webkit-transform .3s;transition:transform .3s;transition:transform .3s,-webkit-transform .3s;will-change:transform}.reorder-enabled{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.reorder-enabled ion-reorder{display:block;cursor:-webkit-grab;cursor:grab;pointer-events:all;-ms-touch-action:none;touch-action:none}.reorder-selected,.reorder-selected ion-reorder{cursor:-webkit-grabbing;cursor:grabbing}.reorder-selected{position:relative;-webkit-transition:none!important;transition:none!important;-webkit-box-shadow:0 0 10px rgba(0,0,0,.4);box-shadow:0 0 10px rgba(0,0,0,.4);opacity:.8;z-index:100}.reorder-visible ion-reorder .reorder-icon{-webkit-transform:translateZ(0);transform:translateZ(0)}"},enumerable:!0,configurable:!0}),t}(),c=function(t){return t.$ionIndex},a=function(t,e){for(var r;t;){if((r=t.parentElement)===e)return t;t=r}},h=60,d=10,u="reorder-selected",f=function(t,e,r){var n=t[e];return t.splice(e,1),t.splice(r,0,n),t.slice()}},380:function(t,e,r){"use strict";r.d(e,"a",(function(){return o})),r.d(e,"b",(function(){return i})),r.d(e,"c",(function(){return s})),r.d(e,"d",(function(){return n}));var n=function(){var t=window.TapticEngine;t&&t.selection()},o=function(){var t=window.TapticEngine;t&&t.gestureSelectionStart()},i=function(){var t=window.TapticEngine;t&&t.gestureSelectionChanged()},s=function(){var t=window.TapticEngine;t&&t.gestureSelectionEnd()}}}]);
//# sourceMappingURL=39.059e3799.chunk.js.map