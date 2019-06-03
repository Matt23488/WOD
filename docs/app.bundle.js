!function a(s,r,l){function c(t,e){if(!r[t]){if(!s[t]){var n="function"==typeof require&&require;if(!e&&n)return n(t,!0);if(d)return d(t,!0);var o=new Error("Cannot find module '"+t+"'");throw o.code="MODULE_NOT_FOUND",o}var i=r[t]={exports:{}};s[t][0].call(i.exports,function(e){return c(s[t][1][e]||e)},i,i.exports,a,s,r,l)}return r[t].exports}for(var d="function"==typeof require&&require,e=0;e<l.length;e++)c(l[e]);return c}({1:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var s=e("./Character/Character"),o=e("./Dice"),i=e("./Command/CommandStack"),a=(r.prototype.toggleClock=function(){this.showClock(!this.showClock())},r.prototype.goBack=function(){"sheet"===this.mode()?this.mode("list"):(this.mode("sheet"),this._previousSection&&(window.location.hash=this._previousSection))},r.prototype.newCharacter=function(){var e=s.default.newCharacter();e.locked(!1),this.characters.push(e),this.selectCharacter(e)},r.prototype.selectCharacter=function(e){var t=this.characters.indexOf(e);this.characterId()!==t&&(this.characterId(t),i.default.instance.reset()),this.mode("sheet")},r.prototype.deleteCharacter=function(e){if(!this.character().locked()&&confirm("Are you sure you want to delete "+this.character().name()+"? (As long as you don't save, your character won't be gone.)")){var t=this.characterId();this.characterId(0),this.characters.remove(this.characters()[t]),this.mode("list")}},r.prototype.saveCharacters=function(){window.localStorage.setItem("characters",JSON.stringify(this.realCharacters().map(function(e){return e.toJson()}))),alert("Characters saved successfully!")},r.prototype.downloadCharacter=function(){var e=JSON.stringify(this.character().toJson()),t=document.createElement("a");t.setAttribute("href","data:text/plain;charset=utf-8,"+encodeURIComponent(e)),t.setAttribute("download",this.character().name()+".json"),t.style.display="none",document.body.appendChild(t),t.click(),document.body.removeChild(t)},r.prototype.uploadCharacter=function(){var o=this,i=document.createElement("input");i.type="file",i.accept=".json",i.style.display="none",i.addEventListener("change",function(e){var t=i.files[0];if(t){var n=new FileReader;n.onload=function(e){var t=e.target.result;o.characters.push(s.default.fromJson(JSON.parse(t))),o.characterId(o.characters().length-1),o.mode("sheet")},n.readAsText(t)}}),document.body.appendChild(i),i.click(),document.body.removeChild(i)},r.prototype.toggleCharacterLock=function(){var e=this.character();e.locked(!e.locked())},r.prototype.switchMode=function(e){var t=this;return function(){"list"!==t.mode()&&document.getElementById(e)?t._previousSection=e:t._previousSection=null,window.location.hash="",t.mode(e)}},r.prototype.undo=function(){this.canUndo()&&i.default.instance.undo()},r.prototype.redo=function(){this.canRedo()&&i.default.instance.redo()},r);function r(){var a=this,e=(JSON.parse(window.localStorage.getItem("characters"))||[]).map(s.default.fromJson);e.unshift(s.default.newCharacter()),e[0].ghost=!0,this.mode=ko.observable("list"),this.characterId=ko.observable(0),this.characters=ko.observableArray(e),this.realCharacters=ko.computed(function(){return a.characters().filter(function(e){return!e.ghost})},this),this.character=ko.computed(function(){return a.characters()[a.characterId()]},this),this.dice=new o.default,this.lockButtonClass=ko.computed(function(){return a.character().locked()?"btn-danger":"btn-outline-success"},this),this.lockButtonIcon=ko.computed(function(){return a.character().locked()?"fas fa-lock":"fas fa-lock-open"},this),this._previousSection=null,this.showClock=ko.observable(!1),this.currentTime=ko.observable(new Date),this.currentTimeDisplay=ko.computed(function(){var e=a.currentTime(),t=e.getHours(),n=e.getMinutes(),o=e.getSeconds(),i=t<12?"AM":"PM";return 12<t&&(t-=12),t+":"+(n<10?"0":"")+n+":"+(o<10?"0":"")+o+" "+i},this),this.canUndo=ko.computed(function(){return i.default.instance.canUndo()&&!a.character().locked()},this),this.canRedo=ko.computed(function(){return i.default.instance.canRedo()&&!a.character().locked()},this),window.setInterval(function(){a.currentTime(new Date)},1e3),window.addEventListener("keydown",function(e){if(!0===e.ctrlKey)switch(e.key){case"s":e.preventDefault(),a.saveCharacters();break;case"z":e.preventDefault(),a.undo();break;case"Z":e.preventDefault(),a.redo()}}),window.addEventListener("hashchange",function(e){var t=window.location.hash.substring(1);if(t){var n=$("#"+t);$(window).scrollTop(n.offset().top-80)}})}n.default=a},{"./Character/Character":2,"./Command/CommandStack":13,"./Dice":15}],2:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=e("./Damage"),i=e("./Equipment"),a=e("./InventoryItem"),s=e("./Merit"),r=e("./Note"),l=e("../utils"),c=e("../Command/CommandStack"),d=e("../Command/CollectionAddCommand"),u=e("../Command/CollectionRemoveCommand"),h=e("../Command/CollectionMoveCommand"),v=e("../Command/ClearUsedCommand"),p=(m.newCharacter=function(){return new m({name:function(){for(var e=l.randomInteger(5,12),t=l.randomInteger(5,12),n="",o="",i=0;i<e;i++){var a=b.charAt(l.randomInteger(0,b.length));0===i&&(a=a.toUpperCase()),n+=a}for(var i=0;i<t;i++){var a=b.charAt(l.randomInteger(0,b.length));0===i&&(a=a.toUpperCase()),o+=a}return n+" "+o}(),player:"",age:0,vice:"",virtue:"",origins:"",gender:"",concept:"",chronicle:"",intelligence:1,strength:1,presence:1,wits:1,dexterity:1,manipulation:1,resolve:1,stamina:1,composure:1,academics:0,robotics:0,crafts:0,investigation:0,medicine:0,occult:0,politics:0,science:0,athletics:0,brawl:0,drive:0,ranged:0,larceny:0,stealth:0,survival:0,weaponry:0,animalKen:0,empathy:0,expression:0,intimidation:0,persuasion:0,socialize:0,streetwise:0,subterfuge:0,merits:[],spells:[],flaws:[],size:5,armor:0,experience:0,morality:7,weapons:[],equipment:[],inventory:[],notes:[]})},m.fromJson=function(e){return new m(e)},m.prototype.onComponentClick=function(e,t){t.currentTarget.getElementsByTagName("input")[0].focus()},m.prototype.newItem=function(e,t){var n=this;return function(){n.locked()||c.default.instance.execute(new d.default(e,t.createLockable(n.locked)))}},m.prototype.removeItem=function(t){var n=this;return function(e){n.locked()||c.default.instance.execute(new u.default(t,e))}},m.prototype.moveItem=function(o,i){var a=this;return function(e){if(!a.locked()){var t=o.indexOf(e),n=t+i;n<0||n>=o().length||c.default.instance.execute(new h.default(o,e,n,t))}}},m.prototype.clearUsed=function(e){return function(){c.default.instance.execute(new v.default(e))}},m.prototype.toJson=function(){return{name:this.name(),player:this.player(),age:this.age(),vice:this.vice(),virtue:this.virtue(),origins:this.origins(),gender:this.gender(),concept:this.concept(),chronicle:this.chronicle(),intelligence:this.intelligence(),wits:this.wits(),resolve:this.resolve(),strength:this.strength(),dexterity:this.dexterity(),stamina:this.stamina(),presence:this.presence(),manipulation:this.manipulation(),composure:this.composure(),bashing:this.damage.bashing(),lethal:this.damage.lethal(),aggravated:this.damage.aggravated(),usedMagic:this.usedMagic(),usedWillpower:this.usedWillpower(),academics:this.academics(),robotics:this.robotics(),crafts:this.crafts(),investigation:this.investigation(),medicine:this.medicine(),occult:this.occult(),politics:this.politics(),science:this.science(),athletics:this.athletics(),brawl:this.brawl(),drive:this.drive(),ranged:this.ranged(),larceny:this.larceny(),stealth:this.stealth(),survival:this.survival(),weaponry:this.weaponry(),animalKen:this.animalKen(),empathy:this.empathy(),expression:this.expression(),intimidation:this.intimidation(),persuasion:this.persuasion(),socialize:this.socialize(),streetwise:this.streetwise(),subterfuge:this.subterfuge(),merits:this.merits().map(function(e){return{name:e.name(),value:e.value()}}),spells:this.spells().map(function(e){return{name:e.name(),value:e.value()}}),flaws:this.flaws().map(function(e){return{name:e.name(),value:e.value()}}),size:this.size(),armor:this.armor(),experience:this.experience(),morality:this.morality(),weapons:this.weapons().map(function(e){return{name:e.name(),description:e.description()}}),equipment:this.equipment().map(function(e){return{name:e.name(),description:e.description()}}),inventory:this.inventory().map(function(e){return{name:e.name(),description:e.description(),quantity:e.quantity()}}),notes:this.notes().map(function(e){return e.value()})}},m);function m(e){var t=this;this.ghost=!1,this.locked=ko.observable(!0),this.name=ko.observable(e.name).extend({lockable:this.locked}),this.player=ko.observable(e.player).extend({lockable:this.locked}),this.age=ko.observable(e.age).extend({numeric:{precision:0},lockable:this.locked}),this.vice=ko.observable(e.vice).extend({lockable:this.locked}),this.virtue=ko.observable(e.virtue).extend({lockable:this.locked}),this.origins=ko.observable(e.origins).extend({lockable:this.locked}),this.gender=ko.observable(e.gender).extend({lockable:this.locked}),this.concept=ko.observable(e.concept).extend({lockable:this.locked}),this.chronicle=ko.observable(e.chronicle).extend({lockable:this.locked}),this.intelligence=ko.observable(e.intelligence).extend({lockable:this.locked}),this.strength=ko.observable(e.strength).extend({lockable:this.locked}),this.presence=ko.observable(e.presence).extend({lockable:this.locked}),this.wits=ko.observable(e.wits).extend({lockable:this.locked}),this.dexterity=ko.observable(e.dexterity).extend({lockable:this.locked}),this.manipulation=ko.observable(e.manipulation).extend({lockable:this.locked}),this.resolve=ko.observable(e.resolve).extend({lockable:this.locked}),this.stamina=ko.observable(e.stamina).extend({lockable:this.locked}),this.composure=ko.observable(e.composure).extend({lockable:this.locked}),this.academics=ko.observable(e.academics).extend({lockable:this.locked}),this.robotics=ko.observable(e.robotics).extend({lockable:this.locked}),this.crafts=ko.observable(e.crafts).extend({lockable:this.locked}),this.investigation=ko.observable(e.investigation).extend({lockable:this.locked}),this.medicine=ko.observable(e.medicine).extend({lockable:this.locked}),this.occult=ko.observable(e.occult).extend({lockable:this.locked}),this.politics=ko.observable(e.politics).extend({lockable:this.locked}),this.science=ko.observable(e.science).extend({lockable:this.locked}),this.athletics=ko.observable(e.athletics).extend({lockable:this.locked}),this.brawl=ko.observable(e.brawl).extend({lockable:this.locked}),this.drive=ko.observable(e.drive).extend({lockable:this.locked}),this.ranged=ko.observable(e.ranged).extend({lockable:this.locked}),this.larceny=ko.observable(e.larceny).extend({lockable:this.locked}),this.stealth=ko.observable(e.stealth).extend({lockable:this.locked}),this.survival=ko.observable(e.survival).extend({lockable:this.locked}),this.weaponry=ko.observable(e.weaponry).extend({lockable:this.locked}),this.animalKen=ko.observable(e.animalKen).extend({lockable:this.locked}),this.empathy=ko.observable(e.empathy).extend({lockable:this.locked}),this.expression=ko.observable(e.expression).extend({lockable:this.locked}),this.intimidation=ko.observable(e.intimidation).extend({lockable:this.locked}),this.persuasion=ko.observable(e.persuasion).extend({lockable:this.locked}),this.socialize=ko.observable(e.socialize).extend({lockable:this.locked}),this.streetwise=ko.observable(e.streetwise).extend({lockable:this.locked}),this.subterfuge=ko.observable(e.subterfuge).extend({lockable:this.locked}),this.merits=ko.observableArray(e.merits.map(function(e){return new s.default(e.name,e.value,t.locked)})),this.spells=ko.observableArray(e.spells.map(function(e){return new s.default(e.name,e.value,t.locked)})),this.flaws=ko.observableArray(e.flaws.map(function(e){return new s.default(e.name,e.value,t.locked)})),this.size=ko.observable(e.size).extend({numeric:{precision:0,min:1,max:10},lockable:this.locked}),this.speed=ko.computed(function(){return t.strength()+t.dexterity()+5},this),this.defense=ko.computed(function(){return Math.min(t.dexterity(),t.wits())},this),this.armor=ko.observable(e.armor).extend({numeric:{precision:0}}).extend({lockable:this.locked}),this.initiative=ko.computed(function(){return t.dexterity()+t.composure()},this),this.experience=ko.observable(e.experience).extend({numeric:{precision:0},lockable:this.locked}),this.morality=ko.observable(e.morality).extend({numeric:{precision:0,min:1,max:10},lockable:this.locked}),this.weapons=ko.observableArray(e.weapons.map(function(e){return new i.default(e.name,e.description,t.locked)})),this.equipment=ko.observableArray(e.equipment.map(function(e){return new i.default(e.name,e.description,t.locked)})),this.inventory=ko.observableArray(e.inventory.map(function(e){return new a.default(e.name,e.description,e.quantity,t.locked)})),this.notes=ko.observableArray(e.notes.map(function(e){return new r.default(e,t.locked)})),this.health=ko.computed(function(){return t.stamina()+t.size()},this),this.damage=new o.default(this.health,e.bashing,e.lethal,e.aggravated,this.locked),this.magic=ko.computed(function(){return t.resolve()+t.composure()},this),this.usedMagic=ko.observable(e.usedMagic||0).extend({lockable:this.locked}),this.magic.subscribe(function(e){t.usedMagic()>e&&t.usedMagic(e)},this),this.willpower=ko.computed(function(){return t.resolve()+t.composure()},this),this.usedWillpower=ko.observable(e.usedWillpower||0).extend({lockable:this.locked}),this.willpower.subscribe(function(e){t.usedWillpower()>e&&t.usedWillpower(e)},this)}n.default=p;var b="abcdefghijklmnopqrstuvwxyz"},{"../Command/ClearUsedCommand":9,"../Command/CollectionAddCommand":10,"../Command/CollectionMoveCommand":11,"../Command/CollectionRemoveCommand":12,"../Command/CommandStack":13,"../utils":17,"./Damage":3,"./Equipment":4,"./InventoryItem":5,"./Merit":6,"./Note":7}],3:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=(i.prototype.anyEmpty=function(){return this.bashing()+this.lethal()+this.aggravated()<this.totalHealth()},i.prototype.addBashing=function(){this.anyEmpty()?this.bashing(this.bashing()+1):0<this.bashing()?(this.bashing(this.bashing()-1),this.lethal(this.lethal()+1)):0<this.lethal()?(this.lethal(this.lethal()-1),this.aggravated(this.aggravated()+1)):alert("you ded")},i.prototype.addLethal=function(){this.anyEmpty()?this.lethal(this.lethal()+1):0<this.bashing()?(this.bashing(this.bashing()-1),this.lethal(this.lethal()+1)):0<this.lethal()?(this.lethal(this.lethal()-1),this.aggravated(this.aggravated()+1)):alert("you ded")},i.prototype.addAggravated=function(){this.anyEmpty()?this.aggravated(this.aggravated()+1):0<this.bashing()?(this.bashing(this.bashing()-1),this.aggravated(this.aggravated()+1)):0<this.lethal()?(this.lethal(this.lethal()-1),this.aggravated(this.aggravated()+1)):alert("you ded")},i.prototype.clearAll=function(){this.bashing(0),this.lethal(0),this.aggravated(0)},i);function i(e,t,n,o,i){var a=this;this.totalHealth=e,this.bashing=ko.observable(t||0),this.lethal=ko.observable(n||0),this.aggravated=ko.observable(o||0),i&&(this.bashing=this.bashing.extend({lockable:i}),this.lethal=this.lethal.extend({lockable:i}),this.aggravated=this.aggravated.extend({lockable:i})),e.subscribe(function(e){for(;a.bashing()+a.lethal()+a.aggravated()>e;)0<a.bashing()?a.bashing(a.bashing()-1):0<a.lethal()?a.lethal(a.lethal()-1):a.aggravated(a.aggravated()-1)},this)}n.default=o},{}],4:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=(i.createLockable=function(e){return new i(null,null,e)},i);function i(e,t,n){this.name=ko.observable(e||""),this.description=ko.observable(t||""),n&&(this.name=this.name.extend({lockable:n}),this.description=this.description.extend({lockable:n}))}n.default=o},{}],5:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=(i.prototype.getDisplayText=function(){return this.quantity()+" "+this.name()},i.createLockable=function(e){return new i(null,null,null,e)},i);function i(e,t,n,o){this.name=ko.observable(e||""),this.description=ko.observable(t||""),this.quantity=ko.observable(n||1),o&&(this.name=this.name.extend({lockable:o}),this.description=this.description.extend({lockable:o}),this.quantity=this.quantity.extend({lockable:o})),this.displayText=ko.computed(this.getDisplayText,this)}n.default=o},{}],6:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=(i.createLockable=function(e){return new i(null,null,e)},i);function i(e,t,n){this.name=ko.observable(e||""),this.value=ko.observable(t||0),n&&(this.name=this.name.extend({lockable:n}),this.value=this.value.extend({lockable:n}))}n.default=o},{}],7:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=(i.createLockable=function(e){return new i(null,e)},i);function i(e,t){this.value=ko.observable(e||""),t&&(this.value=this.value.extend({lockable:t}))}n.default=o},{}],8:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=(i.prototype.execute=function(){this._observable(this._newValue)},i.prototype.undo=function(){this._observable(this._oldValue)},i.prototype.doesNothing=function(){return this._newValue===this._oldValue},i);function i(e,t,n){this._observable=e,this._newValue=t,this._oldValue=n}n.default=o},{}],9:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=(i.prototype.execute=function(){this._observable(0)},i.prototype.undo=function(){this._observable(this._oldValue)},i.prototype.doesNothing=function(){return 0===this._oldValue},i);function i(e){this._observable=e,this._oldValue=e()}n.default=o},{}],10:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=(i.prototype.execute=function(){this._observable.push(this._newItem)},i.prototype.undo=function(){this._observable.remove(this._newItem)},i.prototype.doesNothing=function(){return!1},i);function i(e,t){this._observable=e,this._newItem=t}n.default=o},{}],11:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=(i.prototype.execute=function(){this._observable.splice(this._oldIndex,1),this._observable.splice(this._newIndex,0,this._item)},i.prototype.undo=function(){this._observable.splice(this._newIndex,1),this._observable.splice(this._oldIndex,0,this._item)},i.prototype.doesNothing=function(){return this._newIndex===this._oldIndex},i);function i(e,t,n,o){this._observable=e,this._item=t,this._newIndex=n,this._oldIndex=o}n.default=o},{}],12:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=(i.prototype.execute=function(){this._observable.remove(this._item)},i.prototype.undo=function(){this._observable.splice(this._itemIndex,0,this._item)},i.prototype.doesNothing=function(){return!1},i);function i(e,t){this._observable=e,this._item=t,this._itemIndex=this._observable.indexOf(this._item)}n.default=o},{}],13:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=(Object.defineProperty(i,"instance",{get:function(){return i._instance||(i._instance=new i),i._instance},enumerable:!0,configurable:!0}),i.prototype.reset=function(){this._undoStack.removeAll(),this._redoStack.removeAll()},i.prototype.execute=function(e){e.doesNothing()||(e.execute(),this._undoStack.push(e),this._redoStack.removeAll())},i.prototype.undo=function(){if(0!==this._undoStack().length){var e=this._undoStack.pop();e.undo(),this._redoStack.push(e)}},i.prototype.redo=function(){if(0!==this._redoStack().length){var e=this._redoStack.pop();e.execute(),this._undoStack.push(e)}},i);function i(){var e=this;this._undoStack=ko.observableArray([]),this._redoStack=ko.observableArray([]),this.canUndo=ko.computed(function(){return 0<e._undoStack().length},this),this.canRedo=ko.computed(function(){return 0<e._redoStack().length},this)}n.default=o},{}],14:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=(i.prototype.execute=function(){this._observable(this._newValue)},i.prototype.undo=function(){this._observable(this._oldValue)},i.prototype.doesNothing=function(){return this._newValue===this._oldValue},i);function i(e,t,n){this._observable=e,this._newValue=t,this._oldValue=n}n.default=o},{}],15:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var s=e("./utils"),o=(i.prototype.incrementDicePool=function(t){var n=this;return function(){var e=n.dicePool()+t;e<1&&(e=1),n.dicePool(e)}},i.prototype.rollDice=function(){new a(this).beginRoll()},i);function i(){var e=this;this.dicePool=ko.observable(1),this.rollRounds=ko.observableArray([]),this.rollingInProgress=ko.observable(!1),this.totalDiceSuccesses=ko.computed(function(){return e.rollingInProgress()||0===e.rollRounds().length?-1:e.rollRounds().reduce(function(e,t){return e+t.reduce(function(e,t){return e+(7<t?1:0)},0)},0)},this),this.totalDiceSuccessesDisplay=ko.computed(function(){return 0<=e.totalDiceSuccesses()?""+e.totalDiceSuccesses():"???"},this)}n.default=o;var a=(r.prototype.beginRoll=function(){var a=this;this._diceObj.rollingInProgress(!0),this._diceObj.rollRounds.removeAll();for(var e=0;e<this._currentRoundRolls;e++)this._currentRoundResults.push(-1);this._diceObj.rollRounds.push(this._currentRoundResults),this._intervalHandle=window.setInterval(function(){var e=s.randomInteger(1,11);if(10===e){a._nextRoundRolls++;var t=document.getElementsByClassName("diceContainer")[0],n=document.createElement("div");n.classList.add("crit-message"),n.innerText="Crit!",n.id="critMessage",t.appendChild(n),window.setTimeout(function(){return t.removeChild(n)},1010)}if(a._currentRoundResults[a._currentDice]=e,a._diceObj.rollRounds.replace(a._diceObj.rollRounds()[a._currentRound],a._currentRoundResults),a._currentDice++,a._currentDice===a._currentRoundRolls){if(0===a._nextRoundRolls){window.clearInterval(a._intervalHandle),a._diceObj.rollingInProgress(!1);var o=document.getElementById("critMessage");return void(o&&o.remove())}a._currentRound++,a._currentRoundRolls=a._nextRoundRolls,a._nextRoundRolls=0,a._currentDice=0,a._currentRoundResults=[];for(var i=0;i<a._currentRoundRolls;i++)a._currentRoundResults.push(-1);a._diceObj.rollRounds.push(a._currentRoundResults)}},100)},r);function r(e){this._diceObj=e,this._currentRound=0,this._currentDice=0,this._currentRoundRolls=e.dicePool(),this._currentRoundResults=[],this._nextRoundRolls=0,this._intervalHandle=null}},{"./utils":17}],16:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=e("./Application"),i=e("./Character/Equipment"),a=e("./Character/InventoryItem"),s=e("./Character/Merit"),r=e("./Character/Note");e("./utils").applyCustomKnockoutCode();var l={Equipment:i.default,InventoryItem:a.default,Merit:s.default,Note:r.default};Object.defineProperty(window,"constructors",{value:l});var c=new o.default;function d(e){e?$("[data-toggle='tooltip']").tooltip():$("[data-toggle='tooltip']").tooltip("dispose")}ko.applyBindings(c),Object.defineProperty(window,"app",{value:c}),window.addEventListener("resize",function(){d(992<=window.outerWidth)}),d(992<=window.outerWidth)},{"./Application":1,"./Character/Equipment":4,"./Character/InventoryItem":5,"./Character/Merit":6,"./Character/Note":7,"./utils":17}],17:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=e("./Command/CommandStack"),l=e("./Command/AttributeCommand"),i=e("./Command/TextInputCommand");function h(e,t){var n;return void 0===e&&(e=0),void 0===t&&(t=1),t<e&&(e=(n=[t,e])[0],t=n[1]),Math.random()*(t-e)+e}n.randomInteger=function(e,t){var n;return void 0===e&&(e=0),void 0===t&&(t=10),t<e&&(e=(n=[t,e])[0],t=n[1]),Math.floor(Math.random()*(t-e))+e},n.randomFloat=h,n.applyCustomKnockoutCode=function(){ko.bindingHandlers.dice={update:function(e,t){var n=t()();if(0!==n.length){var o=e.getElementsByClassName("dice-round");if(o.length!==n.length){var i=document.createElement("div");i.classList.add("dice-round");for(var a=n[n.length-1],s=0;s<a.length;s++){var r=document.createElement("span"),l=h(0,.5);r.style.animation="rollingDice 0.5s linear -"+l+"s infinite alternate",r.classList.add("dice"),i.appendChild(r)}e.appendChild(i),o=e.getElementsByClassName("dice-round")}for(s=0;s<n.length;s++){a=n[s];for(var c=o[s].getElementsByClassName("dice"),d=0;d<a.length;d++){var u=a[d];r=c[d],-1!==u&&(r.style.animation=null,r.style.backgroundImage="url('images/dice-"+u+".png')")}}}else e.innerHTML=""}},ko.bindingHandlers.damageDisplay={init:function(e){for(var t=0;t<15;t++){var n=document.createElement("span");n.classList.add("damage"),n.classList.add("none"),e.appendChild(n)}},update:function(e,t){for(var n=t(),o=e.getElementsByTagName("span"),i=0;i<o.length;i++)i<n.aggravated()?(o[i].classList.remove("none"),o[i].classList.remove("bashing"),o[i].classList.remove("lethal"),o[i].classList.add("aggravated")):i-n.aggravated()<n.lethal()?(o[i].classList.remove("none"),o[i].classList.remove("bashing"),o[i].classList.remove("aggravated"),o[i].classList.add("lethal")):i-n.aggravated()-n.lethal()<n.bashing()?(o[i].classList.remove("none"),o[i].classList.remove("lethal"),o[i].classList.remove("aggravated"),o[i].classList.add("bashing")):(o[i].classList.remove("bashing"),o[i].classList.remove("lethal"),o[i].classList.remove("aggravated"),o[i].classList.add("none")),i<n.totalHealth()?o[i].classList.remove("HIDDEN"):o[i].classList.add("HIDDEN")}},ko.bindingHandlers.attribute={init:function(n,o){for(var t=[],e=function(n){var e=document.createElement("span");e.classList.add("attribute-dot"),e.classList.add("pointer"),e.dataset.toggle="tooltip",e.title=""+(n+1),$(e).tooltip(),t.push(e),e.addEventListener("pointerenter",function(){t.forEach(function(e,t){t<=n&&e.classList.add("hoverFilled")})}),e.addEventListener("pointerleave",function(){t.forEach(function(e){e.classList.remove("hoverFilled")})})},i=0;i<o().max;i++)e(i);var a=o().canClear;if(!0===a||void 0===a){var s=document.createElement("div");s.classList.add("clear-dot"),s.innerHTML="&times;",s.dataset.toggle="tooltip",s.title="Clear",s.addEventListener("click",function(){r.default.instance.execute(new l.default(o().value,0,o().value()))}),n.appendChild(s),$(s).tooltip()}t.forEach(function(e,t){n.appendChild(e),e.addEventListener("click",function(){r.default.instance.execute(new l.default(o().value,t+1,o().value()))})})},update:function(e,t){for(var n=t().value(),o=e.getElementsByClassName("attribute-dot"),i=0;i<o.length;i++){var a=o[i];a.style.backgroundColor=null,a.style.borderColor=null,i<n&&(a.style.backgroundColor="var(--body-color)",a.style.borderColor="var(--body-color)")}}},ko.bindingHandlers.readOnlyAttribute={init:function(e,t){for(var n=0;n<t().max;n++){var o=document.createElement("span");o.classList.add("attribute-dot"),e.appendChild(o)}},update:function(e,t){for(var n=t().value(),o=e.getElementsByTagName("span"),i=0;i<o.length;i++)o[i].classList.remove("filled"),i<n?(o[i].classList.add("filled"),o[i].classList.remove("HIDDEN")):t().hideUnfilled&&o[i].classList.add("HIDDEN")}},ko.bindingHandlers.used={init:function(t,n){for(var o=[],e=function(n){var e=document.createElement("span");e.classList.add("attribute-dot"),t.appendChild(e),o.push(e),e.addEventListener("pointerenter",function(){o.forEach(function(e,t){t<=n&&e.classList.add("hoverFilled")})}),e.addEventListener("pointerleave",function(){o.forEach(function(e){e.classList.remove("hoverFilled")})})},i=0;i<12;i++)e(i);o.forEach(function(e,t){e.addEventListener("click",function(){r.default.instance.execute(new l.default(n().value,t+1,n().value()))})})},update:function(e,t){for(var n=t().value(),o=t().total(),i=e.getElementsByTagName("span"),a=0;a<i.length;a++)a<n?i[a].classList.add("filled-red"):i[a].classList.remove("filled-red"),a<o?i[a].classList.remove("HIDDEN"):i[a].classList.add("HIDDEN")}},ko.bindingHandlers.focusOnCreation={init:function(e){window.setTimeout(function(){e.value||e.focus()},1)}},ko.bindingHandlers.contextMenu={init:function(e,t){e.addEventListener("contextmenu",function(e){e.preventDefault(),t()()})}},ko.bindingHandlers.undoableTextInput={init:function(e,n){var o=e;o.addEventListener("change",function(){var e=n()(),t=o.value;e!==t&&(n()(t),n()()!==e&&(n()(e),r.default.instance.execute(new i.default(n(),t,e))))})},update:function(e,t){e.value=t()()}},ko.extenders.lockable=function(t,n){return ko.pureComputed({read:t,write:function(e){n()?t.notifySubscribers(t()):(t(e),t.notifySubscribers(e))}}).extend({notify:"always"})},ko.extenders.numeric=function(a,e){var s=e.precision||0,r=e.min||-1/0,l=e.max||1/0,t=ko.pureComputed({read:a,write:function(e){var t=a(),n=Math.pow(10,s),o=isNaN(e)?0:+e,i=Math.round(o*n)/n;i<r?i=r:l<i&&(i=l),i!==t?a(i):e!==t&&a.notifySubscribers(i)}}).extend({notify:"always"});return t(a()),t}}},{"./Command/AttributeCommand":8,"./Command/CommandStack":13,"./Command/TextInputCommand":14}]},{},[16]);
//# sourceMappingURL=app.bundle.js.map
