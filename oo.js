var OO = {};
var CT = {};

function _Class(name, superClassName, instVarNames) {
	this.name = name;
	this.superClassName = superClassName;
	this.instVarNames = instVarNames;
	this.methods = {};
	this.vars = {};
}

function _Method(name, implFn) {
	this.implFn = implFn;
	this.name = name;
}

OO.initializeCT = function() {
  // TODO
  var obj = new _Class("Object", null, null);
  obj.declareMethod("Object", "initialize", function(){});
  obj.declareMethod("Object", "===", function(_this, x){return _this === x;});
  obj.declareMethod("Object", "!==", function(_this, x){return _this !== x;});
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
	var instVarNamesOrig = instVarNames.slice();
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
	// is inst
	CT[name] = new _Class(name, superClassName, instVarNamesOrig);
	CT[name].methods = superClass.methods;
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

OO.instantiate = function(className) {
	var classObj = OO.getClass(className);
	var args = arguments.slice(1);
	int i = 0;
	while (i < classObj.instVarNames.length && i < args.length) {
		classObj.vars[classObj.instVarNames[i]] = args[i];
	}
	return classObj;
}

OO.send = function(recv, selector) {
	var classObj = OO.classOf(recv);
	if (!classObj.methods.hasOwnProperty(selector)) {
		throw new Error("Message not understood!");
	}
	var method = classObj.methods[selector];
	var args = arguments.slice(2);
	args.unshift(recv);
	return method.implFn.apply(recv, args);
}

OO.classOf = function(obj) {
	return OO.getClass(obj.name);
}

OO.superSend = function(superClassName, recv, selector) {
	var classObj = OO.classOf(superClassName);
	if (!classObj.methods.hasOwnProperty(selector)) {
		throw new Error("Message not understood!");
	}
	var method = classObj.methods[selector];
	var args = arguments.slice(3);
	args.unshift(recv);
	return method.implFn.apply(recv, args);
}

OO.getInstVar = function(recv, instVarName) {
	if (recv.vars.hasOwnProperty(instVarName)) {
		return recv.vars[instVarName];
	}
	throw new Error("Undeclared variable instance!");
}

OO.setInstVar = function(recv, instVarName, value) {
	if (recv.vars.hasOwnProperty(instVarName)) {
		recv.vars[instVarName] = value;
		return recv.vars[instVarName];
	}
	throw new Error("Undeclared variable instance!");
}

// ...

