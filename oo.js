var OO = {};
var CT = {};

function _Class(name, superClassName, instVarNames) {
	this.name = name;
	this.superClassName = superClassName;
	this.instVarNames = instVarNames;
	this.methods = {};
}

function _Method(name, implFn) {
	this.implFn = implFn;
	this.name = name;
}

OO.initializeCT = function() {
  // TODO
  var obj = new _Class("Object", null, null);
  obj.declareMethod("Object", "initialize", function(){});
  obj.declareMethod("Object", "===", function(x){return this === x;});
  obj.declareMethod("Object", "!==", function(x){return this !== x;});
  CT["Object"] = obj;
};

OO.declareClass = function(name, superClassName, instVarNames) {
	if (CT.hasOwnProperty(name)) {
		throw new Error("Class already exists!");
	}
	if (!CT.hasOwnProperty(superClassName)) {
		throw new Error("Super class does not exist!");
	}
	var superClass = OO.getClass(superClassName);
	if (instVarNames) {
		instVarNames = instVarNames.sort();
		for (var i = 0; i < instVarNames.length(); i++) {
			if (instVarNames[i] == instVarNames[i+1]) {
				throw new Error("Duplicate variable name!");
			}
			if (superClass.instVarNames.indexOf(instVarNames[i]) > -1) {
				throw new Error("Duplicate variable name!");
			}
		}
	}
	CT[name] = new _Class(name, superClassName, instVarNames);
}

OO.getClass = function(name) {
	if (CT.hasOwnProperty(name)) {
		return CT[name];
	}
	throw new Error("Class does not exist!");
}

OO.declareMethod = function(className, selector, implFn) {
	var classObj = OO.getClass(className);
	classObj.methods[selector] = implFn;
}

// ...

