!function a(s,r,l){function c(t,e){if(!r[t]){if(!s[t]){var i="function"==typeof require&&require;if(!e&&i)return i(t,!0);if(d)return d(t,!0);var n=new Error("Cannot find module '"+t+"'");throw n.code="MODULE_NOT_FOUND",n}var o=r[t]={exports:{}};s[t][0].call(o.exports,function(e){return c(s[t][1][e]||e)},o,o.exports,a,s,r,l)}return r[t].exports}for(var d="function"==typeof require&&require,e=0;e<l.length;e++)c(l[e]);return c}({1:[function(e,t,i){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var s=e("./Character/Character"),n=e("./Dice"),o=e("./Command/CommandStack"),a=(r.prototype.toggleClock=function(){this.showClock(!this.showClock())},r.prototype.goBack=function(){"sheet"===this.mode()?this.mode("list"):(this.mode("sheet"),this._previousSection&&(window.location.hash=this._previousSection))},r.prototype.newCharacter=function(){var e=s.default.newCharacter();e.locked(!1),this.characters.push(e),this.selectCharacter(e)},r.prototype.selectCharacter=function(e){var t=this.characters.indexOf(e);this.characterId()!==t&&(this.characterId(t),o.default.instance.reset()),this.mode("sheet")},r.prototype.deleteCharacter=function(e){if(!this.character().locked()&&confirm("Are you sure you want to delete "+this.character().name()+"? (As long as you don't save, your character won't be gone.)")){var t=this.characterId();this.characterId(0),this.characters.remove(this.characters()[t]),this.mode("list")}},r.prototype.saveCharacters=function(){window.localStorage.setItem("characters",JSON.stringify(this.realCharacters().map(function(e){return e.toJson()}))),alert("Characters saved successfully!")},r.prototype.downloadCharacter=function(){var e=JSON.stringify(this.character().toJson()),t=document.createElement("a");t.setAttribute("href","data:text/plain;charset=utf-8,"+encodeURIComponent(e)),t.setAttribute("download",this.character().name()+".json"),t.style.display="none",document.body.appendChild(t),t.click(),document.body.removeChild(t)},r.prototype.uploadCharacter=function(){var n=this,o=document.createElement("input");o.type="file",o.accept=".json",o.style.display="none",o.addEventListener("change",function(e){var t=o.files[0];if(t){var i=new FileReader;i.onload=function(e){var t=e.target.result;n.characters.push(s.default.fromJson(JSON.parse(t))),n.characterId(n.characters().length-1),n.mode("sheet")},i.readAsText(t)}}),document.body.appendChild(o),o.click(),document.body.removeChild(o)},r.prototype.toggleCharacterLock=function(){var e=this.character();e.locked(!e.locked())},r.prototype.switchMode=function(e){var t=this;return function(){"list"!==t.mode()&&document.getElementById(e)?t._previousSection=e:t._previousSection=null,window.location.hash="",t.mode(e)}},r.prototype.undo=function(){this.canUndo()&&o.default.instance.undo()},r.prototype.redo=function(){this.canRedo()&&o.default.instance.redo()},r);function r(){var a=this,e=(JSON.parse(window.localStorage.getItem("characters"))||[]).map(s.default.fromJson);e.unshift(s.default.newCharacter()),e[0].ghost=!0,this.mode=ko.observable("list"),this.characterId=ko.observable(0),this.characters=ko.observableArray(e),this.realCharacters=ko.computed(function(){return a.characters().filter(function(e){return!e.ghost})},this),this.character=ko.computed(function(){return a.characters()[a.characterId()]},this),this.dice=new n.default,this.lockButtonClass=ko.computed(function(){return a.character().locked()?"btn-danger":"btn-outline-success"},this),this.lockButtonIcon=ko.computed(function(){return a.character().locked()?"fas fa-lock":"fas fa-lock-open"},this),this._previousSection=null,this.showClock=ko.observable(!1),this.currentTime=ko.observable(new Date),this.currentTimeDisplay=ko.computed(function(){var e=a.currentTime(),t=e.getHours(),i=e.getMinutes(),n=e.getSeconds(),o=t<12?"AM":"PM";return 12<t&&(t-=12),t+":"+(i<10?"0":"")+i+":"+(n<10?"0":"")+n+" "+o},this),this.canUndo=ko.computed(function(){return o.default.instance.canUndo()&&!a.character().locked()},this),this.canRedo=ko.computed(function(){return o.default.instance.canRedo()&&!a.character().locked()},this),window.setInterval(function(){a.currentTime(new Date)},1e3),window.addEventListener("keydown",function(e){if(!0===e.ctrlKey)switch(e.key){case"s":e.preventDefault(),a.saveCharacters();break;case"z":e.preventDefault(),a.undo();break;case"Z":e.preventDefault(),a.redo()}}),window.addEventListener("hashchange",function(e){var t=window.location.hash.substring(1);if(t){var i=$("#"+t);$(window).scrollTop(i.offset().top-80)}})}i.default=a},{"./Character/Character":2,"./Command/CommandStack":9,"./Dice":10}],2:[function(e,t,i){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var n=e("./Damage"),o=e("./Equipment"),a=e("./InventoryItem"),s=e("./Merit"),r=e("./Note"),l=e("../utils"),c=(d.newCharacter=function(){return new d({name:function(){for(var e=l.randomInteger(5,12),t=l.randomInteger(5,12),i="",n="",o=0;o<e;o++){var a=u.charAt(l.randomInteger(0,u.length));0===o&&(a=a.toUpperCase()),i+=a}for(var o=0;o<t;o++){var a=u.charAt(l.randomInteger(0,u.length));0===o&&(a=a.toUpperCase()),n+=a}return i+" "+n}(),player:"",age:0,vice:"",virtue:"",origins:"",gender:"",concept:"",chronicle:"",intelligence:1,strength:1,presence:1,wits:1,dexterity:1,manipulation:1,resolve:1,stamina:1,composure:1,academics:0,robotics:0,crafts:0,investigation:0,medicine:0,occult:0,politics:0,science:0,athletics:0,brawl:0,drive:0,ranged:0,larceny:0,stealth:0,survival:0,weaponry:0,animalKen:0,empathy:0,expression:0,intimidation:0,persuasion:0,socialize:0,streetwise:0,subterfuge:0,merits:[],spells:[],flaws:[],size:5,armor:0,experience:0,morality:7,weapons:[],equipment:[],inventory:[],notes:[]})},d.fromJson=function(e){return new d(e)},d.prototype.onComponentClick=function(e,t){t.currentTarget.getElementsByTagName("input")[0].focus()},d.prototype.newItem=function(e,t){var i=this;return function(){i.locked()||e.push(t.createLockable(i.locked))}},d.prototype.removeItem=function(t){var i=this;return function(e){i.locked()||t.remove(e)}},d.prototype.moveItem=function(n,o){var a=this;return function(e){if(!a.locked()){var t=n.indexOf(e),i=t+o;i<0||i>=n().length||(n.splice(t,1),n.splice(i,0,e))}}},d.prototype.clearUsed=function(e){return function(){e(0)}},d.prototype.toJson=function(){return{name:this.name(),player:this.player(),age:this.age(),vice:this.vice(),virtue:this.virtue(),origins:this.origins(),gender:this.gender(),concept:this.concept(),chronicle:this.chronicle(),intelligence:this.intelligence(),wits:this.wits(),resolve:this.resolve(),strength:this.strength(),dexterity:this.dexterity(),stamina:this.stamina(),presence:this.presence(),manipulation:this.manipulation(),composure:this.composure(),bashing:this.damage.bashing(),lethal:this.damage.lethal(),aggravated:this.damage.aggravated(),usedMagic:this.usedMagic(),usedWillpower:this.usedWillpower(),academics:this.academics(),robotics:this.robotics(),crafts:this.crafts(),investigation:this.investigation(),medicine:this.medicine(),occult:this.occult(),politics:this.politics(),science:this.science(),athletics:this.athletics(),brawl:this.brawl(),drive:this.drive(),ranged:this.ranged(),larceny:this.larceny(),stealth:this.stealth(),survival:this.survival(),weaponry:this.weaponry(),animalKen:this.animalKen(),empathy:this.empathy(),expression:this.expression(),intimidation:this.intimidation(),persuasion:this.persuasion(),socialize:this.socialize(),streetwise:this.streetwise(),subterfuge:this.subterfuge(),merits:this.merits().map(function(e){return{name:e.name(),value:e.value()}}),spells:this.spells().map(function(e){return{name:e.name(),value:e.value()}}),flaws:this.flaws().map(function(e){return{name:e.name(),value:e.value()}}),size:this.size(),armor:this.armor(),experience:this.experience(),morality:this.morality(),weapons:this.weapons().map(function(e){return{name:e.name(),description:e.description()}}),equipment:this.equipment().map(function(e){return{name:e.name(),description:e.description()}}),inventory:this.inventory().map(function(e){return{name:e.name(),description:e.description(),quantity:e.quantity()}}),notes:this.notes().map(function(e){return e.value()})}},d);function d(e){var t=this;this.ghost=!1,this.locked=ko.observable(!0),this.name=ko.observable(e.name).extend({lockable:this.locked}),this.player=ko.observable(e.player).extend({lockable:this.locked}),this.age=ko.observable(e.age).extend({numeric:{precision:0},lockable:this.locked}),this.vice=ko.observable(e.vice).extend({lockable:this.locked}),this.virtue=ko.observable(e.virtue).extend({lockable:this.locked}),this.origins=ko.observable(e.origins).extend({lockable:this.locked}),this.gender=ko.observable(e.gender).extend({lockable:this.locked}),this.concept=ko.observable(e.concept).extend({lockable:this.locked}),this.chronicle=ko.observable(e.chronicle).extend({lockable:this.locked}),this.intelligence=ko.observable(e.intelligence).extend({lockable:this.locked}),this.strength=ko.observable(e.strength).extend({lockable:this.locked}),this.presence=ko.observable(e.presence).extend({lockable:this.locked}),this.wits=ko.observable(e.wits).extend({lockable:this.locked}),this.dexterity=ko.observable(e.dexterity).extend({lockable:this.locked}),this.manipulation=ko.observable(e.manipulation).extend({lockable:this.locked}),this.resolve=ko.observable(e.resolve).extend({lockable:this.locked}),this.stamina=ko.observable(e.stamina).extend({lockable:this.locked}),this.composure=ko.observable(e.composure).extend({lockable:this.locked}),this.academics=ko.observable(e.academics).extend({lockable:this.locked}),this.robotics=ko.observable(e.robotics).extend({lockable:this.locked}),this.crafts=ko.observable(e.crafts).extend({lockable:this.locked}),this.investigation=ko.observable(e.investigation).extend({lockable:this.locked}),this.medicine=ko.observable(e.medicine).extend({lockable:this.locked}),this.occult=ko.observable(e.occult).extend({lockable:this.locked}),this.politics=ko.observable(e.politics).extend({lockable:this.locked}),this.science=ko.observable(e.science).extend({lockable:this.locked}),this.athletics=ko.observable(e.athletics).extend({lockable:this.locked}),this.brawl=ko.observable(e.brawl).extend({lockable:this.locked}),this.drive=ko.observable(e.drive).extend({lockable:this.locked}),this.ranged=ko.observable(e.ranged).extend({lockable:this.locked}),this.larceny=ko.observable(e.larceny).extend({lockable:this.locked}),this.stealth=ko.observable(e.stealth).extend({lockable:this.locked}),this.survival=ko.observable(e.survival).extend({lockable:this.locked}),this.weaponry=ko.observable(e.weaponry).extend({lockable:this.locked}),this.animalKen=ko.observable(e.animalKen).extend({lockable:this.locked}),this.empathy=ko.observable(e.empathy).extend({lockable:this.locked}),this.expression=ko.observable(e.expression).extend({lockable:this.locked}),this.intimidation=ko.observable(e.intimidation).extend({lockable:this.locked}),this.persuasion=ko.observable(e.persuasion).extend({lockable:this.locked}),this.socialize=ko.observable(e.socialize).extend({lockable:this.locked}),this.streetwise=ko.observable(e.streetwise).extend({lockable:this.locked}),this.subterfuge=ko.observable(e.subterfuge).extend({lockable:this.locked}),this.merits=ko.observableArray(e.merits.map(function(e){return new s.default(e.name,e.value,t.locked)})),this.spells=ko.observableArray(e.spells.map(function(e){return new s.default(e.name,e.value,t.locked)})),this.flaws=ko.observableArray(e.flaws.map(function(e){return new s.default(e.name,e.value,t.locked)})),this.size=ko.observable(e.size).extend({numeric:{precision:0,min:1,max:10},lockable:this.locked}),this.speed=ko.computed(function(){return t.strength()+t.dexterity()+5},this),this.defense=ko.computed(function(){return Math.min(t.dexterity(),t.wits())},this),this.armor=ko.observable(e.armor).extend({numeric:{precision:0}}).extend({lockable:this.locked}),this.initiative=ko.computed(function(){return t.dexterity()+t.composure()},this),this.experience=ko.observable(e.experience).extend({numeric:{precision:0},lockable:this.locked}),this.morality=ko.observable(e.morality).extend({numeric:{precision:0,min:1,max:10},lockable:this.locked}),this.weapons=ko.observableArray(e.weapons.map(function(e){return new o.default(e.name,e.description,t.locked)})),this.equipment=ko.observableArray(e.equipment.map(function(e){return new o.default(e.name,e.description,t.locked)})),this.inventory=ko.observableArray(e.inventory.map(function(e){return new a.default(e.name,e.description,e.quantity,t.locked)})),this.notes=ko.observableArray(e.notes.map(function(e){return new r.default(e,t.locked)})),this.health=ko.computed(function(){return t.stamina()+t.size()},this),this.damage=new n.default(this.health,e.bashing,e.lethal,e.aggravated,this.locked),this.magic=ko.computed(function(){return t.resolve()+t.composure()},this),this.usedMagic=ko.observable(e.usedMagic||0).extend({lockable:this.locked}),this.magic.subscribe(function(e){t.usedMagic()>e&&t.usedMagic(e)},this),this.willpower=ko.computed(function(){return t.resolve()+t.composure()},this),this.usedWillpower=ko.observable(e.usedWillpower||0).extend({lockable:this.locked}),this.willpower.subscribe(function(e){t.usedWillpower()>e&&t.usedWillpower(e)},this)}i.default=c;var u="abcdefghijklmnopqrstuvwxyz"},{"../utils":12,"./Damage":3,"./Equipment":4,"./InventoryItem":5,"./Merit":6,"./Note":7}],3:[function(e,t,i){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var n=(o.prototype.anyEmpty=function(){return this.bashing()+this.lethal()+this.aggravated()<this.totalHealth()},o.prototype.addBashing=function(){this.anyEmpty()?this.bashing(this.bashing()+1):0<this.bashing()?(this.bashing(this.bashing()-1),this.lethal(this.lethal()+1)):0<this.lethal()?(this.lethal(this.lethal()-1),this.aggravated(this.aggravated()+1)):alert("you ded")},o.prototype.addLethal=function(){this.anyEmpty()?this.lethal(this.lethal()+1):0<this.bashing()?(this.bashing(this.bashing()-1),this.lethal(this.lethal()+1)):0<this.lethal()?(this.lethal(this.lethal()-1),this.aggravated(this.aggravated()+1)):alert("you ded")},o.prototype.addAggravated=function(){this.anyEmpty()?this.aggravated(this.aggravated()+1):0<this.bashing()?(this.bashing(this.bashing()-1),this.aggravated(this.aggravated()+1)):0<this.lethal()?(this.lethal(this.lethal()-1),this.aggravated(this.aggravated()+1)):alert("you ded")},o.prototype.clearAll=function(){this.bashing(0),this.lethal(0),this.aggravated(0)},o);function o(e,t,i,n,o){var a=this;this.totalHealth=e,this.bashing=ko.observable(t||0),this.lethal=ko.observable(i||0),this.aggravated=ko.observable(n||0),o&&(this.bashing=this.bashing.extend({lockable:o}),this.lethal=this.lethal.extend({lockable:o}),this.aggravated=this.aggravated.extend({lockable:o})),e.subscribe(function(e){for(;a.bashing()+a.lethal()+a.aggravated()>e;)0<a.bashing()?a.bashing(a.bashing()-1):0<a.lethal()?a.lethal(a.lethal()-1):a.aggravated(a.aggravated()-1)},this)}i.default=n},{}],4:[function(e,t,i){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var n=(o.createLockable=function(e){return new o(null,null,e)},o);function o(e,t,i){this.name=ko.observable(e||""),this.description=ko.observable(t||""),i&&(this.name=this.name.extend({lockable:i}),this.description=this.description.extend({lockable:i}))}i.default=n},{}],5:[function(e,t,i){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var n=(o.prototype.getDisplayText=function(){return this.quantity()+" "+this.name()},o.createLockable=function(e){return new o(null,null,null,e)},o);function o(e,t,i,n){this.name=ko.observable(e||""),this.description=ko.observable(t||""),this.quantity=ko.observable(i||1),n&&(this.name=this.name.extend({lockable:n}),this.description=this.description.extend({lockable:n}),this.quantity=this.quantity.extend({lockable:n})),this.displayText=ko.computed(this.getDisplayText,this)}i.default=n},{}],6:[function(e,t,i){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var n=(o.createLockable=function(e){return new o(null,null,e)},o);function o(e,t,i){this.name=ko.observable(e||""),this.value=ko.observable(t||0),i&&(this.name=this.name.extend({lockable:i}),this.value=this.value.extend({lockable:i}))}i.default=n},{}],7:[function(e,t,i){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var n=(o.createLockable=function(e){return new o(null,e)},o);function o(e,t){this.value=ko.observable(e||""),t&&(this.value=this.value.extend({lockable:t}))}i.default=n},{}],8:[function(e,t,i){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var n=(o.prototype.execute=function(){this._observable(this._newValue)},o.prototype.undo=function(){this._observable(this._oldValue)},o);function o(e,t,i){this._observable=e,this._newValue=t,this._oldValue=i}i.default=n},{}],9:[function(e,t,i){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var n=(Object.defineProperty(o,"instance",{get:function(){return o._instance||(o._instance=new o),o._instance},enumerable:!0,configurable:!0}),o.prototype.reset=function(){this._undoStack.removeAll(),this._redoStack.removeAll()},o.prototype.execute=function(e){e.execute(),this._undoStack.push(e),this._redoStack.removeAll()},o.prototype.undo=function(){if(0!==this._undoStack().length){var e=this._undoStack.pop();e.undo(),this._redoStack.push(e)}},o.prototype.redo=function(){if(0!==this._redoStack().length){var e=this._redoStack.pop();e.execute(),this._undoStack.push(e)}},o);function o(){var e=this;this._undoStack=ko.observableArray([]),this._redoStack=ko.observableArray([]),this.canUndo=ko.computed(function(){return 0<e._undoStack().length},this),this.canRedo=ko.computed(function(){return 0<e._redoStack().length},this)}i.default=n},{}],10:[function(e,t,i){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var s=e("./utils"),n=(o.prototype.incrementDicePool=function(e){var t=this;return function(){t.dicePool(t.dicePool()+e)}},o.prototype.rollDice=function(){new a(this).beginRoll()},o);function o(){var e=this;this.dicePool=ko.observable(1),this.rollRounds=ko.observableArray([]),this.rollingInProgress=ko.observable(!1),this.totalDiceSuccesses=ko.computed(function(){return e.rollingInProgress()||0===e.rollRounds().length?-1:e.rollRounds().reduce(function(e,t){return e+t.reduce(function(e,t){return e+(7<t?1:0)},0)},0)},this),this.totalDiceSuccessesDisplay=ko.computed(function(){return 0<=e.totalDiceSuccesses()?""+e.totalDiceSuccesses():"???"},this)}i.default=n;var a=(r.prototype.beginRoll=function(){var a=this;this._diceObj.rollingInProgress(!0),this._diceObj.rollRounds.removeAll();for(var e=0;e<this._currentRoundRolls;e++)this._currentRoundResults.push(-1);this._diceObj.rollRounds.push(this._currentRoundResults),this._intervalHandle=window.setInterval(function(){var e=s.randomInteger(1,11);if(10===e){a._nextRoundRolls++;var t=document.getElementsByClassName("diceContainer")[0],i=document.createElement("div");i.classList.add("crit-message"),i.innerText="Crit!",i.id="critMessage",t.appendChild(i),window.setTimeout(function(){return t.removeChild(i)},1010)}if(a._currentRoundResults[a._currentDice]=e,a._diceObj.rollRounds.replace(a._diceObj.rollRounds()[a._currentRound],a._currentRoundResults),a._currentDice++,a._currentDice===a._currentRoundRolls){if(0===a._nextRoundRolls){window.clearInterval(a._intervalHandle),a._diceObj.rollingInProgress(!1);var n=document.getElementById("critMessage");return void(n&&n.remove())}a._currentRound++,a._currentRoundRolls=a._nextRoundRolls,a._nextRoundRolls=0,a._currentDice=0,a._currentRoundResults=[];for(var o=0;o<a._currentRoundRolls;o++)a._currentRoundResults.push(-1);a._diceObj.rollRounds.push(a._currentRoundResults)}},250)},r);function r(e){this._diceObj=e,this._currentRound=0,this._currentDice=0,this._currentRoundRolls=e.dicePool(),this._currentRoundResults=[],this._nextRoundRolls=0,this._intervalHandle=null}},{"./utils":12}],11:[function(e,t,i){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var n=e("./Application"),o=e("./Character/Equipment"),a=e("./Character/InventoryItem"),s=e("./Character/Merit"),r=e("./Character/Note");e("./utils").applyCustomKnockoutCode();var l={Equipment:o.default,InventoryItem:a.default,Merit:s.default,Note:r.default};Object.defineProperty(window,"constructors",{value:l});var c=new n.default;function d(e){e?$("[data-toggle='tooltip']").tooltip():$("[data-toggle='tooltip']").tooltip("dispose")}ko.applyBindings(c),Object.defineProperty(window,"app",{value:c}),window.addEventListener("resize",function(){d(992<=window.outerWidth)}),d(992<=window.outerWidth)},{"./Application":1,"./Character/Equipment":4,"./Character/InventoryItem":5,"./Character/Merit":6,"./Character/Note":7,"./utils":12}],12:[function(e,t,i){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var r=e("./Command/CommandStack"),l=e("./Command/AttributeCommand");function h(e,t){var i;return void 0===e&&(e=0),void 0===t&&(t=1),t<e&&(e=(i=[t,e])[0],t=i[1]),Math.random()*(t-e)+e}i.randomInteger=function(e,t){var i;return void 0===e&&(e=0),void 0===t&&(t=10),t<e&&(e=(i=[t,e])[0],t=i[1]),Math.floor(Math.random()*(t-e))+e},i.randomFloat=h,i.applyCustomKnockoutCode=function(){ko.bindingHandlers.dice={update:function(e,t){var i=t()();if(0!==i.length){var n=e.getElementsByClassName("dice-round");if(n.length!==i.length){var o=document.createElement("div");o.classList.add("dice-round");for(var a=i[i.length-1],s=0;s<a.length;s++){var r=document.createElement("span"),l=h(0,.5);r.style.animation="rollingDice 0.5s linear -"+l+"s infinite alternate",r.classList.add("dice"),o.appendChild(r)}e.appendChild(o),n=e.getElementsByClassName("dice-round")}for(s=0;s<i.length;s++){a=i[s];for(var c=n[s].getElementsByClassName("dice"),d=0;d<a.length;d++){var u=a[d];r=c[d],-1!==u&&(r.style.animation=null,r.style.backgroundImage="url('images/dice-"+u+".png')")}}}else e.innerHTML=""}},ko.bindingHandlers.damageDisplay={init:function(e){for(var t=0;t<15;t++){var i=document.createElement("span");i.classList.add("damage"),i.classList.add("none"),e.appendChild(i)}},update:function(e,t){for(var i=t(),n=e.getElementsByTagName("span"),o=0;o<n.length;o++)o<i.aggravated()?(n[o].classList.remove("none"),n[o].classList.remove("bashing"),n[o].classList.remove("lethal"),n[o].classList.add("aggravated")):o-i.aggravated()<i.lethal()?(n[o].classList.remove("none"),n[o].classList.remove("bashing"),n[o].classList.remove("aggravated"),n[o].classList.add("lethal")):o-i.aggravated()-i.lethal()<i.bashing()?(n[o].classList.remove("none"),n[o].classList.remove("lethal"),n[o].classList.remove("aggravated"),n[o].classList.add("bashing")):(n[o].classList.remove("bashing"),n[o].classList.remove("lethal"),n[o].classList.remove("aggravated"),n[o].classList.add("none")),o<i.totalHealth()?n[o].classList.remove("HIDDEN"):n[o].classList.add("HIDDEN")}},ko.bindingHandlers.attribute={init:function(i,n){for(var t=[],e=function(i){var e=document.createElement("span");e.classList.add("attribute-dot"),e.classList.add("pointer"),e.dataset.toggle="tooltip",e.title=""+(i+1),$(e).tooltip(),t.push(e),e.addEventListener("pointerenter",function(){t.forEach(function(e,t){t<=i&&e.classList.add("hoverFilled")})}),e.addEventListener("pointerleave",function(){t.forEach(function(e){e.classList.remove("hoverFilled")})})},o=0;o<n().max;o++)e(o);var a=n().canClear;if(!0===a||void 0===a){var s=document.createElement("div");s.classList.add("clear-dot"),s.innerHTML="&times;",s.dataset.toggle="tooltip",s.title="Clear",s.addEventListener("click",function(){r.default.instance.execute(new l.default(n().value,0,n().value()))}),i.appendChild(s),$(s).tooltip()}t.forEach(function(e,t){i.appendChild(e),e.addEventListener("click",function(){r.default.instance.execute(new l.default(n().value,t+1,n().value()))})})},update:function(e,t){for(var i=t().value(),n=e.getElementsByClassName("attribute-dot"),o=0;o<n.length;o++){var a=n[o];a.style.backgroundColor=null,a.style.borderColor=null,o<i&&(a.style.backgroundColor="var(--body-color)",a.style.borderColor="var(--body-color)")}}},ko.bindingHandlers.readOnlyAttribute={init:function(e,t){for(var i=0;i<t().max;i++){var n=document.createElement("span");n.classList.add("attribute-dot"),e.appendChild(n)}},update:function(e,t){for(var i=t().value(),n=e.getElementsByTagName("span"),o=0;o<n.length;o++)n[o].classList.remove("filled"),o<i?(n[o].classList.add("filled"),n[o].classList.remove("HIDDEN")):t().hideUnfilled&&n[o].classList.add("HIDDEN")}},ko.bindingHandlers.used={init:function(t,i){for(var n=[],e=function(i){var e=document.createElement("span");e.classList.add("attribute-dot"),t.appendChild(e),n.push(e),e.addEventListener("pointerenter",function(){n.forEach(function(e,t){t<=i&&e.classList.add("hoverFilled")})}),e.addEventListener("pointerleave",function(){n.forEach(function(e){e.classList.remove("hoverFilled")})})},o=0;o<12;o++)e(o);n.forEach(function(e,t){e.addEventListener("click",function(){i().value(t+1)})})},update:function(e,t){for(var i=t().value(),n=t().total(),o=e.getElementsByTagName("span"),a=0;a<o.length;a++)a<i?o[a].classList.add("filled-red"):o[a].classList.remove("filled-red"),a<n?o[a].classList.remove("HIDDEN"):o[a].classList.add("HIDDEN")}},ko.bindingHandlers.focusOnCreation={init:function(e){window.setTimeout(function(){e.value||e.focus()},1)}},ko.bindingHandlers.contextMenu={init:function(e,t){window.alert("contextMenu binding handler init()"),e.addEventListener("contextmenu",function(e){window.alert("oncontextmenu fired via contextMenu binding handler"),e.preventDefault(),t()()})}},ko.extenders.lockable=function(t,i){return ko.pureComputed({read:t,write:function(e){i()?t.notifySubscribers(t()):(t(e),t.notifySubscribers(e))}}).extend({notify:"always"})},ko.extenders.numeric=function(a,e){var s=e.precision||0,r=e.min||-1/0,l=e.max||1/0,t=ko.pureComputed({read:a,write:function(e){var t=a(),i=Math.pow(10,s),n=isNaN(e)?0:+e,o=Math.round(n*i)/i;o<r?o=r:l<o&&(o=l),o!==t?a(o):e!==t&&a.notifySubscribers(o)}}).extend({notify:"always"});return t(a()),t}}},{"./Command/AttributeCommand":8,"./Command/CommandStack":9}]},{},[11]);
//# sourceMappingURL=app.bundle.js.map
