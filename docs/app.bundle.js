!function a(r,s,l){function c(t,e){if(!s[t]){if(!r[t]){var n="function"==typeof require&&require;if(!e&&n)return n(t,!0);if(u)return u(t,!0);var o=new Error("Cannot find module '"+t+"'");throw o.code="MODULE_NOT_FOUND",o}var i=s[t]={exports:{}};r[t][0].call(i.exports,function(e){return c(r[t][1][e]||e)},i,i.exports,a,r,s,l)}return s[t].exports}for(var u="function"==typeof require&&require,e=0;e<l.length;e++)c(l[e]);return c}({1:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=e("./Character/Character"),o=e("./Dice"),i=e("./Command/CommandStack"),s=e("./Character/Repository/ICharacterRepository"),l=e("./Keyboard"),a=(c.prototype.toggleClock=function(){this.showClock(!this.showClock())},c.prototype.goBack=function(){"sheet"===this.mode()?this.mode("list"):(this.mode("sheet"),this._previousSection&&(window.location.hash=this._previousSection))},c.prototype.newCharacter=function(){var e=r.default.newCharacter();e.locked(!1),this.characters.push(e),this.selectCharacter(e)},c.prototype.selectCharacter=function(e){var t=this.characters.indexOf(e);this.characterId()!==t&&(this.characterId(t),i.default.instance.reset()),this.mode("sheet")},c.prototype.deleteCharacter=function(e){var n=this;this.character().locked()||swal({title:"Delete "+this.character().name(),text:"Are you sure? (As long as you don't save, your character won't be gone.)",icon:"warning",buttons:["Cancel","Delete"],dangerMode:!0}).then(function(e){if(e){var t=n.characterId();n.characterId(0),n.characters.remove(n.characters()[t]),n.mode("list")}})},c.prototype.saveCharacters=function(){this._characterRepo.saveCharacters(this.realCharacters()),swal("Characters saved successfully!",{buttons:{},timer:1e3,icon:"success"})},c.prototype.downloadCharacter=function(){var e=JSON.stringify(this.character().toJson()),t=document.createElement("a");t.setAttribute("href","data:text/plain;charset=utf-8,"+encodeURIComponent(e)),t.setAttribute("download",this.character().name()+".json"),t.style.display="none",document.body.appendChild(t),t.click(),document.body.removeChild(t)},c.prototype.uploadCharacter=function(){var o=this,i=document.createElement("input");i.type="file",i.accept=".json",i.style.display="none",i.addEventListener("change",function(e){var t=i.files[0];if(t){var n=new FileReader;n.onload=function(e){var t=e.target.result;o.characters.push(r.default.fromJson(JSON.parse(t))),o.characterId(o.characters().length-1),o.mode("sheet")},n.readAsText(t)}}),document.body.appendChild(i),i.click(),document.body.removeChild(i)},c.prototype.toggleCharacterLock=function(){var e=this.character();e.locked(!e.locked())},c.prototype.switchMode=function(e){var t=this;return function(){"list"!==t.mode()&&document.getElementById(e)?t._previousSection=e:t._previousSection=null,window.location.hash="",t.mode(e)}},c.prototype.undo=function(){this.canUndo()&&i.default.instance.undo()},c.prototype.redo=function(){this.canRedo()&&i.default.instance.redo()},c);function c(){var a=this;this._characterRepo=s.getCharacterRepository("LocalStorage");var e=this._characterRepo.loadCharacters();e.unshift(r.default.newCharacter()),e[0].ghost=!0,this.mode=ko.observable("list"),this.characterId=ko.observable(0),this.characters=ko.observableArray(e),this.realCharacters=ko.computed(function(){return a.characters().filter(function(e){return!e.ghost})},this),this.character=ko.computed(function(){return a.characters()[a.characterId()]},this),this.dice=new o.default,this.lockButtonClass=ko.computed(function(){return a.character().locked()?"btn-danger":"btn-outline-success"},this),this.lockButtonIcon=ko.computed(function(){return a.character().locked()?"fas fa-lock":"fas fa-lock-open"},this),this._previousSection=null,this.showClock=ko.observable(!1),this.currentTime=ko.observable(new Date),this.currentTimeDisplay=ko.computed(function(){var e=a.currentTime(),t=e.getHours(),n=e.getMinutes(),o=e.getSeconds(),i=t<12?"AM":"PM";return 12<t?t-=12:0===t&&(t=12),t+":"+(n<10?"0":"")+n+":"+(o<10?"0":"")+o+" "+i},this),this.canUndo=ko.computed(function(){return i.default.instance.canUndo()&&!a.character().locked()},this),this.canRedo=ko.computed(function(){return i.default.instance.canRedo()&&!a.character().locked()},this),window.setInterval(function(){a.currentTime(new Date)},1e3),l.registerKeyboardCommand("s",function(){return a.saveCharacters()}),l.registerKeyboardCommand("z",function(){"list"!==a.mode()&&a.undo()}),l.registerKeyboardCommand("Z",function(){"list"!==a.mode()&&a.redo()}),l.registerKeyboardCommand("l",function(){"list"!==a.mode()&&a.toggleCharacterLock()}),l.registerKeyboardCommand("o",function(){return a.toggleClock()}),l.registerKeyboardCommand("q",function(){return i.default.instance.log()}),window.addEventListener("hashchange",function(e){var t=window.location.hash.substring(1);if(t){var n=$("#"+t);$(window).scrollTop(n.offset().top-80)}})}n.default=a},{"./Character/Character":2,"./Character/Repository/ICharacterRepository":8,"./Command/CommandStack":16,"./Dice":18,"./Keyboard":19}],2:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=e("./Damage"),i=e("./Equipment"),a=e("./InventoryItem"),r=e("./Merit"),s=e("./Note"),l=e("../utils"),c=e("../Command/CommandStack"),u=e("../Command/CollectionAddCommand"),d=e("../Command/CollectionRemoveCommand"),h=e("../Command/CollectionMoveCommand"),m=e("../Command/ClearUsedCommand"),f=e("../Command/AttributeCommand"),p=(v.newCharacter=function(){return new v({name:function(){for(var e=l.randomInteger(5,12),t=l.randomInteger(5,12),n="",o="",i=0;i<e;i++){var a=b.charAt(l.randomInteger(0,b.length));0===i&&(a=a.toUpperCase()),n+=a}for(var i=0;i<t;i++){var a=b.charAt(l.randomInteger(0,b.length));0===i&&(a=a.toUpperCase()),o+=a}return n+" "+o}(),player:"",age:0,vice:"",virtue:"",origins:"",gender:"",concept:"",chronicle:"",intelligence:1,strength:1,presence:1,wits:1,dexterity:1,manipulation:1,resolve:1,stamina:1,composure:1,academics:0,robotics:0,crafts:0,investigation:0,medicine:0,occult:0,politics:0,science:0,athletics:0,brawl:0,drive:0,ranged:0,larceny:0,stealth:0,survival:0,weaponry:0,animalKen:0,empathy:0,expression:0,intimidation:0,persuasion:0,socialize:0,streetwise:0,subterfuge:0,merits:[],spells:[],flaws:[],size:5,armor:0,experience:0,morality:7,weapons:[],equipment:[],inventory:[],notes:[]})},v.fromJson=function(e){return new v(e)},v.prototype.onComponentClick=function(e,t){t.currentTarget.getElementsByTagName("input")[0].focus()},v.prototype.newItem=function(e,t){var n=this;return function(){n.locked()||c.default.instance.execute(new u.default(e,t.createLockable(n.locked)))}},v.prototype.removeItem=function(t){var n=this;return function(e){n.locked()||c.default.instance.execute(new d.default(t,e))}},v.prototype.moveItem=function(o,i){var a=this;return function(e){if(!a.locked()){var t=o.indexOf(e),n=t+i;n<0||n>=o().length||c.default.instance.execute(new h.default(o,e,n,t))}}},v.prototype.clearUsed=function(e){return function(){c.default.instance.execute(new m.default(e))}},v.prototype.toJson=function(){return{name:this.name(),player:this.player(),age:this.age(),vice:this.vice(),virtue:this.virtue(),origins:this.origins(),gender:this.gender(),concept:this.concept(),chronicle:this.chronicle(),intelligence:this.intelligence(),wits:this.wits(),resolve:this.resolve(),strength:this.strength(),dexterity:this.dexterity(),stamina:this.stamina(),presence:this.presence(),manipulation:this.manipulation(),composure:this.composure(),bashing:this.damage.bashing(),lethal:this.damage.lethal(),aggravated:this.damage.aggravated(),usedMagic:this.usedMagic(),usedWillpower:this.usedWillpower(),academics:this.academics(),robotics:this.robotics(),crafts:this.crafts(),investigation:this.investigation(),medicine:this.medicine(),occult:this.occult(),politics:this.politics(),science:this.science(),athletics:this.athletics(),brawl:this.brawl(),drive:this.drive(),ranged:this.ranged(),larceny:this.larceny(),stealth:this.stealth(),survival:this.survival(),weaponry:this.weaponry(),animalKen:this.animalKen(),empathy:this.empathy(),expression:this.expression(),intimidation:this.intimidation(),persuasion:this.persuasion(),socialize:this.socialize(),streetwise:this.streetwise(),subterfuge:this.subterfuge(),merits:this.merits().map(function(e){return{name:e.name(),value:e.value()}}),spells:this.spells().map(function(e){return{name:e.name(),value:e.value()}}),flaws:this.flaws().map(function(e){return{name:e.name(),value:e.value()}}),size:this.size(),armor:this.armor(),experience:this.experience(),morality:this.morality(),weapons:this.weapons().map(function(e){return{name:e.name(),description:e.description()}}),equipment:this.equipment().map(function(e){return{name:e.name(),description:e.description()}}),inventory:this.inventory().map(function(e){return{name:e.name(),description:e.description(),quantity:e.quantity()}}),notes:this.notes().map(function(e){return e.value()})}},v);function v(e){var t=this;this.ghost=!1,this.locked=ko.observable(!0),this.name=ko.observable(e.name).extend({lockable:this.locked,named:"Name"}),this.player=ko.observable(e.player).extend({lockable:this.locked}),this.age=ko.observable(e.age).extend({numeric:{precision:0},lockable:this.locked}),this.vice=ko.observable(e.vice).extend({lockable:this.locked}),this.virtue=ko.observable(e.virtue).extend({lockable:this.locked}),this.origins=ko.observable(e.origins).extend({lockable:this.locked}),this.gender=ko.observable(e.gender).extend({lockable:this.locked}),this.concept=ko.observable(e.concept).extend({lockable:this.locked}),this.chronicle=ko.observable(e.chronicle).extend({lockable:this.locked}),this.intelligence=ko.observable(e.intelligence).extend({lockable:this.locked,named:"Intelligence"}),this.strength=ko.observable(e.strength).extend({lockable:this.locked}),this.presence=ko.observable(e.presence).extend({lockable:this.locked}),this.wits=ko.observable(e.wits).extend({lockable:this.locked}),this.dexterity=ko.observable(e.dexterity).extend({lockable:this.locked}),this.manipulation=ko.observable(e.manipulation).extend({lockable:this.locked}),this.resolve=ko.observable(e.resolve).extend({lockable:this.locked}),this.stamina=ko.observable(e.stamina).extend({lockable:this.locked}),this.composure=ko.observable(e.composure).extend({lockable:this.locked}),this.academics=ko.observable(e.academics).extend({lockable:this.locked}),this.robotics=ko.observable(e.robotics).extend({lockable:this.locked}),this.crafts=ko.observable(e.crafts).extend({lockable:this.locked}),this.investigation=ko.observable(e.investigation).extend({lockable:this.locked}),this.medicine=ko.observable(e.medicine).extend({lockable:this.locked}),this.occult=ko.observable(e.occult).extend({lockable:this.locked}),this.politics=ko.observable(e.politics).extend({lockable:this.locked}),this.science=ko.observable(e.science).extend({lockable:this.locked}),this.athletics=ko.observable(e.athletics).extend({lockable:this.locked}),this.brawl=ko.observable(e.brawl).extend({lockable:this.locked}),this.drive=ko.observable(e.drive).extend({lockable:this.locked}),this.ranged=ko.observable(e.ranged).extend({lockable:this.locked}),this.larceny=ko.observable(e.larceny).extend({lockable:this.locked}),this.stealth=ko.observable(e.stealth).extend({lockable:this.locked}),this.survival=ko.observable(e.survival).extend({lockable:this.locked}),this.weaponry=ko.observable(e.weaponry).extend({lockable:this.locked}),this.animalKen=ko.observable(e.animalKen).extend({lockable:this.locked}),this.empathy=ko.observable(e.empathy).extend({lockable:this.locked}),this.expression=ko.observable(e.expression).extend({lockable:this.locked}),this.intimidation=ko.observable(e.intimidation).extend({lockable:this.locked}),this.persuasion=ko.observable(e.persuasion).extend({lockable:this.locked}),this.socialize=ko.observable(e.socialize).extend({lockable:this.locked}),this.streetwise=ko.observable(e.streetwise).extend({lockable:this.locked}),this.subterfuge=ko.observable(e.subterfuge).extend({lockable:this.locked}),this.merits=ko.observableArray(e.merits.map(function(e){return new r.default(e.name,e.value,t.locked)})),this.spells=ko.observableArray(e.spells.map(function(e){return new r.default(e.name,e.value,t.locked)})),this.flaws=ko.observableArray(e.flaws.map(function(e){return new r.default(e.name,e.value,t.locked)})),this.size=ko.observable(e.size).extend({numeric:{precision:0,min:1,max:10},lockable:this.locked}),this.speed=ko.computed(function(){return t.strength()+t.dexterity()+5},this),this.defense=ko.computed(function(){return Math.min(t.dexterity(),t.wits())},this),this.armor=ko.observable(e.armor).extend({numeric:{precision:0}}).extend({lockable:this.locked}),this.initiative=ko.computed(function(){return t.dexterity()+t.composure()},this),this.experience=ko.observable(e.experience).extend({numeric:{precision:0},lockable:this.locked}),this.morality=ko.observable(e.morality).extend({numeric:{precision:0,min:1,max:10},lockable:this.locked}),this.weapons=ko.observableArray(e.weapons.map(function(e){return new i.default(e.name,e.description,t.locked)})),this.equipment=ko.observableArray(e.equipment.map(function(e){return new i.default(e.name,e.description,t.locked)})),this.inventory=ko.observableArray(e.inventory.map(function(e){return new a.default(e.name,e.description,e.quantity,t.locked)})),this.notes=ko.observableArray(e.notes.map(function(e){return new s.default(e,t.locked)})),this.health=ko.computed(function(){return t.stamina()+t.size()},this),this.damage=new o.default(this.health,e.bashing,e.lethal,e.aggravated,this.locked),this.magic=ko.computed(function(){return t.resolve()+t.composure()},this),this.usedMagic=ko.observable(e.usedMagic||0).extend({lockable:this.locked}),this.magic.subscribe(function(e){t.usedMagic()>e&&c.default.instance.executeWithPrevious(new f.default(t.usedMagic,e,t.usedMagic()))},this),this.willpower=ko.computed(function(){return t.resolve()+t.composure()},this),this.usedWillpower=ko.observable(e.usedWillpower||0).extend({lockable:this.locked}),this.willpower.subscribe(function(e){t.usedWillpower()>e&&c.default.instance.executeWithPrevious(new f.default(t.usedWillpower,e,t.usedWillpower()))},this)}n.default=p;var b="abcdefghijklmnopqrstuvwxyz"},{"../Command/AttributeCommand":10,"../Command/ClearUsedCommand":12,"../Command/CollectionAddCommand":13,"../Command/CollectionMoveCommand":14,"../Command/CollectionRemoveCommand":15,"../Command/CommandStack":16,"../utils":21,"./Damage":3,"./Equipment":4,"./InventoryItem":5,"./Merit":6,"./Note":7}],3:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=e("../Command/CommandStack"),s=e("../Command/AttributeCommand"),l=e("../Command/BatchCommand"),o=(i.prototype.anyEmpty=function(){return this.bashing()+this.lethal()+this.aggravated()<this.totalHealth()},i.prototype.addBashing=function(){this.anyEmpty()?r.default.instance.execute(new s.default(this.bashing,this.bashing()+1,this.bashing())):0<this.bashing()?r.default.instance.execute(new l.default(new s.default(this.bashing,this.bashing()-1,this.bashing()),new s.default(this.lethal,this.lethal()+1,this.lethal()))):0<this.lethal()?r.default.instance.execute(new l.default(new s.default(this.lethal,this.lethal()-1,this.lethal()),new s.default(this.aggravated,this.aggravated()+1,this.aggravated()))):alert("you ded")},i.prototype.addLethal=function(){this.anyEmpty()?r.default.instance.execute(new s.default(this.lethal,this.lethal()+1,this.lethal())):0<this.bashing()?r.default.instance.execute(new l.default(new s.default(this.bashing,this.bashing()-1,this.bashing()),new s.default(this.lethal,this.lethal()+1,this.lethal()))):0<this.lethal()?r.default.instance.execute(new l.default(new s.default(this.lethal,this.lethal()-1,this.lethal()),new s.default(this.aggravated,this.aggravated()+1,this.aggravated()))):alert("you ded")},i.prototype.addAggravated=function(){this.anyEmpty()?r.default.instance.execute(new s.default(this.aggravated,this.aggravated()+1,this.aggravated())):0<this.bashing()?r.default.instance.execute(new l.default(new s.default(this.bashing,this.bashing()-1,this.bashing()),new s.default(this.aggravated,this.aggravated()+1,this.aggravated()))):0<this.lethal()?r.default.instance.execute(new l.default(new s.default(this.lethal,this.lethal()-1,this.lethal()),new s.default(this.aggravated,this.aggravated()+1,this.aggravated()))):alert("you ded")},i.prototype.clearAll=function(){r.default.instance.execute(new l.default(new s.default(this.bashing,0,this.bashing()),new s.default(this.lethal,0,this.lethal()),new s.default(this.aggravated,0,this.aggravated())))},i);function i(e,t,n,o,i){var a=this;this.totalHealth=e,this.bashing=ko.observable(t||0),this.lethal=ko.observable(n||0),this.aggravated=ko.observable(o||0),i&&(this.bashing=this.bashing.extend({lockable:i}),this.lethal=this.lethal.extend({lockable:i}),this.aggravated=this.aggravated.extend({lockable:i})),e.subscribe(function(e){for(var t=a.bashing(),n=a.lethal(),o=a.aggravated();e<t+n+o;)0<t?t--:0<n?n--:o--;r.default.instance.executeWithPrevious(new l.default(new s.default(a.bashing,t,a.bashing()),new s.default(a.lethal,n,a.lethal()),new s.default(a.aggravated,o,a.aggravated())))},this)}n.default=o},{"../Command/AttributeCommand":10,"../Command/BatchCommand":11,"../Command/CommandStack":16}],4:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=(i.createLockable=function(e){return new i(null,null,e)},i);function i(e,t,n){this.name=ko.observable(e||""),this.description=ko.observable(t||""),n&&(this.name=this.name.extend({lockable:n}),this.description=this.description.extend({lockable:n}))}n.default=o},{}],5:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=(i.prototype.getDisplayText=function(){return this.quantity()+" "+this.name()},i.createLockable=function(e){return new i(null,null,null,e)},i);function i(e,t,n,o){this.name=ko.observable(e||""),this.description=ko.observable(t||""),this.quantity=ko.observable(n||1),o&&(this.name=this.name.extend({lockable:o}),this.description=this.description.extend({lockable:o}),this.quantity=this.quantity.extend({lockable:o})),this.displayText=ko.computed(this.getDisplayText,this)}n.default=o},{}],6:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=(i.createLockable=function(e){return new i(null,null,e)},i);function i(e,t,n){this.name=ko.observable(e||""),this.value=ko.observable(t||0),n&&(this.name=this.name.extend({lockable:n}),this.value=this.value.extend({lockable:n}))}n.default=o},{}],7:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=(i.createLockable=function(e){return new i(null,e)},i);function i(e,t){this.value=ko.observable(e||""),t&&(this.value=this.value.extend({lockable:t}))}n.default=o},{}],8:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=e("./LocalStorageCharacterRepository");n.getCharacterRepository=function(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];switch(e){case"LocalStorage":return new o.default}}},{"./LocalStorageCharacterRepository":9}],9:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=e("../Character"),i=(a.prototype.loadCharacters=function(){return(JSON.parse(window.localStorage.getItem("characters"))||[]).map(o.default.fromJson)},a.prototype.saveCharacters=function(e){return window.localStorage.setItem("characters",JSON.stringify(e.map(function(e){return e.toJson()}))),!0},a);function a(){}n.default=i},{"../Character":2}],10:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=(i.prototype.getType=function(){return"AttributeCommand"},i.prototype.toString=function(){return this._observable.getName()+": "+this._oldValue+" => "+this._newValue},i.prototype.execute=function(){this._observable(this._newValue)},i.prototype.undo=function(){this._observable(this._oldValue)},i.prototype.doesNothing=function(){return this._newValue===this._oldValue},i);function i(e,t,n){this._observable=e,this._newValue=t,this._oldValue=n}n.default=o},{}],11:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=(Object.defineProperty(i.prototype,"commandCount",{get:function(){return this._commands.length},enumerable:!0,configurable:!0}),i.prototype.getType=function(){return"BatchCommand"},i.prototype.getCommand=function(e){return e<0||e>=this._commands.length?null:this._commands[e]},i.prototype.execute=function(){for(var e=0;e<this._commands.length;e++)this._commands[e].execute()},i.prototype.undo=function(){for(var e=this._commands.length-1;0<=e;e--)this._commands[e].undo()},i.prototype.doesNothing=function(){return this._commands.every(function(e){return e.doesNothing()})},i);function i(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this._commands=e.filter(function(e){return!e.doesNothing()})}n.default=o},{}],12:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=(i.prototype.getType=function(){return"ClearUsedCommand"},i.prototype.execute=function(){this._observable(0)},i.prototype.undo=function(){this._observable(this._oldValue)},i.prototype.doesNothing=function(){return 0===this._oldValue},i);function i(e){this._observable=e,this._oldValue=e()}n.default=o},{}],13:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=(i.prototype.getType=function(){return"CollectionAddCommand"},i.prototype.execute=function(){this._observable.push(this._newItem)},i.prototype.undo=function(){this._observable.remove(this._newItem)},i.prototype.doesNothing=function(){return!1},i);function i(e,t){this._observable=e,this._newItem=t}n.default=o},{}],14:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=(i.prototype.getType=function(){return"CollectionMoveCommand"},i.prototype.execute=function(){this._observable.splice(this._oldIndex,1),this._observable.splice(this._newIndex,0,this._item)},i.prototype.undo=function(){this._observable.splice(this._newIndex,1),this._observable.splice(this._oldIndex,0,this._item)},i.prototype.doesNothing=function(){return this._newIndex===this._oldIndex},i);function i(e,t,n,o){this._observable=e,this._item=t,this._newIndex=n,this._oldIndex=o}n.default=o},{}],15:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=(i.prototype.getType=function(){return"CollectionRemoveCommand"},i.prototype.execute=function(){this._observable.remove(this._item)},i.prototype.undo=function(){this._observable.splice(this._itemIndex,0,this._item)},i.prototype.doesNothing=function(){return!1},i);function i(e,t){this._observable=e,this._item=t,this._itemIndex=this._observable.indexOf(this._item)}n.default=o},{}],16:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=e("./BatchCommand"),i=(Object.defineProperty(a,"instance",{get:function(){return a._instance||(a._instance=new a),a._instance},enumerable:!0,configurable:!0}),Object.defineProperty(a.prototype,"undoLength",{get:function(){return this._undoStack().length},enumerable:!0,configurable:!0}),Object.defineProperty(a.prototype,"redoLength",{get:function(){return this._redoStack().length},enumerable:!0,configurable:!0}),a.prototype.getPreviousCommand=function(e){void 0===e&&(e=!1);var t=this._undoStack()[this.undoLength-1];if(!e)return t;for(;t instanceof o.default;)t=t.getCommand(t.commandCount-1);return t},a.prototype.reset=function(){this._undoStack.removeAll(),this._redoStack.removeAll()},a.prototype.execute=function(e){var t=this;e.doesNothing()||(this._currentlyExecuting?window.setTimeout(function(){return t.execute(e)},1):(this._currentlyExecuting=!0,e.execute(),this._undoStack.push(e),this._redoStack.removeAll(),this._currentlyExecuting=!1))},a.prototype.executeWithPrevious=function(e){var t=this;if(!e.doesNothing())if(this._currentlyExecuting)window.setTimeout(function(){return t.executeWithPrevious(e)},1);else{this._currentlyExecuting=!0,e.execute();var n=this._undoStack.pop();this._undoStack.push(new o.default(n,e)),this._redoStack.removeAll(),this._currentlyExecuting=!1}},a.prototype.undo=function(){if(0!==this._undoStack().length){var e=this._undoStack.pop();e.undo(),this._redoStack.push(e)}},a.prototype.redo=function(){if(0!==this._redoStack().length){var e=this._redoStack.pop();e.execute(),this._undoStack.push(e)}},a.prototype.log=function(){console.log("UNDO STACK:"),console.log(this._undoStack()),console.log("REDO STACK:"),console.log(this._redoStack())},a);function a(){var e=this;this._undoStack=ko.observableArray([]),this._redoStack=ko.observableArray([]),this._currentlyExecuting=!1,this.canUndo=ko.computed(function(){return 0<e.undoLength},this),this.canRedo=ko.computed(function(){return 0<e.redoLength},this)}n.default=i},{"./BatchCommand":11}],17:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=(i.prototype.getType=function(){return"TextInputCommand"},i.prototype.execute=function(){this._observable(this._newValue)},i.prototype.undo=function(){this._observable(this._oldValue)},i.prototype.doesNothing=function(){return this._newValue===this._oldValue},i);function i(e,t,n){this._observable=e,this._newValue=t,this._oldValue=n}n.default=o},{}],18:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=e("./utils"),o=(i.prototype.incrementDicePool=function(t){var n=this;return function(){var e=n.dicePool()+t;e<1&&(e=1),n.dicePool(e)}},i.prototype.rollDice=function(){new a(this).beginRoll()},i);function i(){var e=this;this.dicePool=ko.observable(1),this.rollRounds=ko.observableArray([]),this.rollingInProgress=ko.observable(!1),this.totalDiceSuccesses=ko.computed(function(){return e.rollingInProgress()||0===e.rollRounds().length?-1:e.rollRounds().reduce(function(e,t){return e+t.reduce(function(e,t){return e+(7<t?1:0)},0)},0)},this),this.totalDiceSuccessesDisplay=ko.computed(function(){return 0<=e.totalDiceSuccesses()?""+e.totalDiceSuccesses():"???"},this)}n.default=o;var a=(s.prototype.beginRoll=function(){var a=this;this._diceObj.rollingInProgress(!0),this._diceObj.rollRounds.removeAll();for(var e=0;e<this._currentRoundRolls;e++)this._currentRoundResults.push(-1);this._diceObj.rollRounds.push(this._currentRoundResults),this._intervalHandle=window.setInterval(function(){var e=r.randomInteger(1,11);if(10===e){a._nextRoundRolls++;var t=document.getElementsByClassName("diceContainer")[0],n=document.createElement("div");n.classList.add("crit-message"),n.innerText="Crit!",n.id="critMessage",t.appendChild(n),window.setTimeout(function(){return t.removeChild(n)},1010)}if(a._currentRoundResults[a._currentDice]=e,a._diceObj.rollRounds.replace(a._diceObj.rollRounds()[a._currentRound],a._currentRoundResults),a._currentDice++,a._currentDice===a._currentRoundRolls){if(0===a._nextRoundRolls){window.clearInterval(a._intervalHandle),a._diceObj.rollingInProgress(!1);var o=document.getElementById("critMessage");return void(o&&o.remove())}a._currentRound++,a._currentRoundRolls=a._nextRoundRolls,a._nextRoundRolls=0,a._currentDice=0,a._currentRoundResults=[];for(var i=0;i<a._currentRoundRolls;i++)a._currentRoundResults.push(-1);a._diceObj.rollRounds.push(a._currentRoundResults)}},100)},s);function s(e){this._diceObj=e,this._currentRound=0,this._currentDice=0,this._currentRoundRolls=e.dicePool(),this._currentRoundResults=[],this._nextRoundRolls=0,this._intervalHandle=null}},{"./utils":21}],19:[function(e,t,n){"use strict";var l=this&&this.__values||function(e){var t="function"==typeof Symbol&&e[Symbol.iterator],n=0;return t?t.call(e):{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}}},c=this&&this.__read||function(e,t){var n="function"==typeof Symbol&&e[Symbol.iterator];if(!n)return e;var o,i,a=n.call(e),r=[];try{for(;(void 0===t||0<t--)&&!(o=a.next()).done;)r.push(o.value)}catch(e){i={error:e}}finally{try{o&&!o.done&&(n=a.return)&&n.call(a)}finally{if(i)throw i.error}}return r};Object.defineProperty(n,"__esModule",{value:!0});var u=new Map;n.registerKeyboardCommand=function(e,t){u.set(e,t)},window.addEventListener("keydown",function(e){var t,n;if(!0===e.ctrlKey)try{for(var o=l(u.entries()),i=o.next();!i.done;i=o.next()){var a=c(i.value,2),r=a[0],s=a[1];if(e.key===r)return e.preventDefault(),void s()}}catch(e){t={error:e}}finally{try{i&&!i.done&&(n=o.return)&&n.call(o)}finally{if(t)throw t.error}}})},{}],20:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=e("./Application"),i=e("./Character/Equipment"),a=e("./Character/InventoryItem"),r=e("./Character/Merit"),s=e("./Character/Note");e("./utils").applyCustomKnockoutCode();var l={Equipment:i.default,InventoryItem:a.default,Merit:r.default,Note:s.default};Object.defineProperty(window,"constructors",{value:l});var c=new o.default;function u(e){e?$("[data-toggle='tooltip']").tooltip():$("[data-toggle='tooltip']").tooltip("dispose")}ko.applyBindings(c),Object.defineProperty(window,"app",{value:c}),window.addEventListener("resize",function(){u(992<=window.outerWidth)}),u(992<=window.outerWidth)},{"./Application":1,"./Character/Equipment":4,"./Character/InventoryItem":5,"./Character/Merit":6,"./Character/Note":7,"./utils":21}],21:[function(e,t,n){"use strict";var o=this&&this.__read||function(e,t){var n="function"==typeof Symbol&&e[Symbol.iterator];if(!n)return e;var o,i,a=n.call(e),r=[];try{for(;(void 0===t||0<t--)&&!(o=a.next()).done;)r.push(o.value)}catch(e){i={error:e}}finally{try{o&&!o.done&&(n=a.return)&&n.call(a)}finally{if(i)throw i.error}}return r};Object.defineProperty(n,"__esModule",{value:!0});var s=e("./Command/CommandStack"),l=e("./Command/AttributeCommand"),i=e("./Command/TextInputCommand");function h(e,t){var n;return void 0===e&&(e=0),void 0===t&&(t=1),t<e&&(e=(n=o([t,e],2))[0],t=n[1]),Math.random()*(t-e)+e}n.randomInteger=function(e,t){var n;return void 0===e&&(e=0),void 0===t&&(t=10),t<e&&(e=(n=o([t,e],2))[0],t=n[1]),Math.floor(Math.random()*(t-e))+e},n.randomFloat=h;var a=new Map;n.applyCustomKnockoutCode=function(){ko.bindingHandlers.dice={update:function(e,t){var n=t()();if(0!==n.length){var o=e.getElementsByClassName("dice-round");if(o.length!==n.length){var i=document.createElement("div");i.classList.add("dice-round");for(var a=n[n.length-1],r=0;r<a.length;r++){var s=document.createElement("span"),l=h(0,.5);s.style.animation="rollingDice 0.5s linear -"+l+"s infinite alternate",s.classList.add("dice"),i.appendChild(s)}e.appendChild(i),o=e.getElementsByClassName("dice-round")}for(var r=0;r<n.length;r++)for(var a=n[r],c=o[r].getElementsByClassName("dice"),u=0;u<a.length;u++){var d=a[u],s=c[u];-1!==d&&(s.style.animation=null,s.style.backgroundImage="url('images/dice-"+d+".png')")}}else e.innerHTML=""}},ko.bindingHandlers.damageDisplay={init:function(e){for(var t=0;t<15;t++){var n=document.createElement("span");n.classList.add("damage"),n.classList.add("none"),e.appendChild(n)}},update:function(e,t){for(var n=t(),o=e.getElementsByTagName("span"),i=0;i<o.length;i++)i<n.aggravated()?(o[i].classList.remove("none"),o[i].classList.remove("bashing"),o[i].classList.remove("lethal"),o[i].classList.add("aggravated")):i-n.aggravated()<n.lethal()?(o[i].classList.remove("none"),o[i].classList.remove("bashing"),o[i].classList.remove("aggravated"),o[i].classList.add("lethal")):i-n.aggravated()-n.lethal()<n.bashing()?(o[i].classList.remove("none"),o[i].classList.remove("lethal"),o[i].classList.remove("aggravated"),o[i].classList.add("bashing")):(o[i].classList.remove("bashing"),o[i].classList.remove("lethal"),o[i].classList.remove("aggravated"),o[i].classList.add("none")),i<n.totalHealth()?o[i].classList.remove("HIDDEN"):o[i].classList.add("HIDDEN")}},ko.bindingHandlers.attribute={init:function(n,o){for(var t=[],e=function(n){var e=document.createElement("span");e.classList.add("attribute-dot"),e.classList.add("pointer"),e.dataset.toggle="tooltip",e.title=""+(n+1),$(e).tooltip(),t.push(e),e.addEventListener("pointerenter",function(){t.forEach(function(e,t){t<=n&&e.classList.add("hoverFilled")})}),e.addEventListener("pointerleave",function(){t.forEach(function(e){e.classList.remove("hoverFilled")})})},i=0;i<o().max;i++)e(i);var a=o().canClear;if(!0===a||void 0===a){var r=document.createElement("div");r.classList.add("clear-dot"),r.innerHTML="&times;",r.dataset.toggle="tooltip",r.title="Clear",r.addEventListener("click",function(){s.default.instance.execute(new l.default(o().value,0,o().value()))}),n.appendChild(r),$(r).tooltip()}t.forEach(function(e,t){n.appendChild(e),e.addEventListener("click",function(){s.default.instance.execute(new l.default(o().value,t+1,o().value()))})})},update:function(e,t){for(var n=t().value(),o=e.getElementsByClassName("attribute-dot"),i=0;i<o.length;i++){var a=o[i];a.style.backgroundColor=null,a.style.borderColor=null,i<n&&(a.style.backgroundColor="var(--body-color)",a.style.borderColor="var(--body-color)")}}},ko.bindingHandlers.readOnlyAttribute={init:function(e,t){for(var n=0;n<t().max;n++){var o=document.createElement("span");o.classList.add("attribute-dot"),e.appendChild(o)}},update:function(e,t){for(var n=t().value(),o=e.getElementsByTagName("span"),i=0;i<o.length;i++)o[i].classList.remove("filled"),i<n?(o[i].classList.add("filled"),o[i].classList.remove("HIDDEN")):t().hideUnfilled&&o[i].classList.add("HIDDEN")}},ko.bindingHandlers.used={init:function(t,n){for(var o=[],e=function(n){var e=document.createElement("span");e.classList.add("attribute-dot"),t.appendChild(e),o.push(e),e.addEventListener("pointerenter",function(){o.forEach(function(e,t){t<=n&&e.classList.add("hoverFilled")})}),e.addEventListener("pointerleave",function(){o.forEach(function(e){e.classList.remove("hoverFilled")})})},i=0;i<12;i++)e(i);o.forEach(function(e,t){e.addEventListener("click",function(){s.default.instance.execute(new l.default(n().value,t+1,n().value()))})})},update:function(e,t){for(var n=t().value(),o=t().total(),i=e.getElementsByTagName("span"),a=0;a<i.length;a++)a<n?i[a].classList.add("filled-red"):i[a].classList.remove("filled-red"),a<o?i[a].classList.remove("HIDDEN"):i[a].classList.add("HIDDEN")}},ko.bindingHandlers.focusOnCreation={init:function(e){window.setTimeout(function(){e.value||e.focus()},1)}},ko.bindingHandlers.contextMenu={init:function(e,t){e.addEventListener("contextmenu",function(e){e.preventDefault(),t()()})}},ko.bindingHandlers.undoableTextInput={init:function(e,n){var o=e;o.addEventListener("change",function(){var e=n()(),t=o.value;e!==t&&(n()(t),n()()!==e&&(n()(e),s.default.instance.execute(new i.default(n(),t,e))))})},update:function(e,t){e.value=t()()}},ko.extenders.named=function(e,t){return a.set(e,t),e},ko.extenders.lockable=function(t,n){var e=ko.pureComputed({read:t,write:function(e){n()?t.notifySubscribers(t()):(t(e),t.notifySubscribers(e))}}).extend({notify:"always"});return e},ko.extenders.numeric=function(a,e){var r=e.precision||0,s=e.min||-1/0,l=e.max||1/0,t=ko.pureComputed({read:a,write:function(e){var t=a(),n=Math.pow(10,r),o=isNaN(e)?0:+e,i=Math.round(o*n)/n;i<s?i=s:l<i&&(i=l),i!==t?a(i):e!==t&&a.notifySubscribers(i)}}).extend({notify:"always"});return t(a()),t},ko.subscribable.fn.getName=function(){return a.get(this)}}},{"./Command/AttributeCommand":10,"./Command/CommandStack":16,"./Command/TextInputCommand":17}]},{},[20]);
//# sourceMappingURL=app.bundle.js.map
