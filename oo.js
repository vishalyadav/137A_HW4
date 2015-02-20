var OO = {};
var CT = {};

function _Class(name, superClassName, instVarNames) {
	this.name = name;
	this.superClassName = superClassName;
	this.instVarNames = instVarNames;
	this.methods = {};
}

function _ClassInstance(name) {
	this.name = name;
	this.vars = {};
}

OO.initializeCT = function() {
	CT = {};
	var obj = new _Class("Object", null, {});
	CT["Object"] = obj;
	OO.declareMethod("Object", "initialize", function(){});
	OO.declareMethod("Object", "===", function(_this, x){return _this === x;});
	OO.declareMethod("Object", "!==", function(_this, x){return _this !== x;});
	OO.declareMethod("Object", "isNumber", function(){return false;});
	obj = new _Class("Number", "Object", {});
	CT["Number"] = obj;
	OO.declareMethod("Number", "isNumber", function(){return true;});
	OO.declareMethod("Number", "+", function(_this, x){return _this + x;});
	OO.declareMethod("Number", "-", function(_this, x){return _this - x;});
	OO.declareMethod("Number", "*", function(_this, x){return _this * x;});
	OO.declareMethod("Number", "/", function(_this, x){return _this / x;});
	OO.declareMethod("Number", "%", function(_this, x){return _this % x;});
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
		for (var i = 0; i < instVarNames.length; i++) {
			if (i+1 < instVarNames.length) {
				if (instVarNames[i] == instVarNames[i+1]) {
					throw new Error("Duplicate variable name!");
				}
			}
			if (superClass.instVarNames.hasOwnProperty(instVarNames[i])) {
				throw new Error("Duplicate variable name!");
			}
		}
	}
	var vars = {};
	for (var i = 0; i < instVarNamesOrig.length; i++) {
		vars[instVarNamesOrig[i]] = true;
	}
	// is inst
	CT[name] = new _Class(name, superClassName, vars);
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
	var args = Array.prototype.slice.call(arguments, 1);
	var instance = new _ClassInstance(className);
	args.unshift(instance);
	classObj.methods["initialize"].apply(instance, args);
	return instance;
}

OO.send = function(recv, selector) {
	var classObj;
	if (typeof recv === "number") {
		classObj = OO.getClass("Number");
	} else {
		classObj = OO.classOf(recv);
	}
	if (classObj.methods.hasOwnProperty(selector)) {
		var method = classObj.methods[selector];
		var args = Array.prototype.slice.call(arguments, 2);
		args.unshift(recv);
		return method.apply(recv, args);
	} else {
		var parentName = classObj.superClassName;
		var parentObj;
		while (parentName) {
			parentObj = OO.getClass(parentName);
			if (parentObj.methods.hasOwnProperty(selector)) {
				var method = parentObj.methods[selector];
				var args = Array.prototype.slice.call(arguments, 2);
				args.unshift(recv);
				return method.apply(recv, args);
			}
			parentName = parentObj.superClassName;
		}
		throw new Error("Message not understood!");
	}
}

OO.classOf = function(obj) {
	return OO.getClass(obj.name);
}

OO.superSend = function(superClassName, recv, selector) {
	var classObj = OO.getClass(superClassName);
	if (classObj.methods.hasOwnProperty(selector)) {
		var method = classObj.methods[selector];
		var args = Array.prototype.slice.call(arguments, 3);
		args.unshift(recv);
		return method.apply(recv, args);
	} else {
		var parentName = classObj.superClassName;
		var parentObj;
		while (parentName) {
			parentObj = OO.getClass(parentName);
			if (parentObj.methods.hasOwnProperty(selector)) {
				var method = classObj.methods[selector];
				var args = Array.prototype.slice.call(arguments, 3);
				args.unshift(recv);
				return method.apply(recv, args);
			}
			parentName = parentObj.superClassName;
		}
		throw new Error("Message not understood!");
	}
}

OO.getInstVar = function(recv, instVarName) {
	if (recv.vars.hasOwnProperty(instVarName)) {
		return recv.vars[instVarName];
	}
	throw new Error("Undeclared variable instance!");
}

OO.setInstVar = function(recv, instVarName, value) {
	var classObj = OO.classOf(recv);
	if (classObj.instVarNames.hasOwnProperty(instVarName)) {
		recv.vars[instVarName] = value;
		return recv.vars[instVarName];
	} else {
		var parentName = classObj.superClassName;
		var parentObj;
		while (parentName) {
			parentObj = OO.getClass(parentName);
			if (parentObj.instVarNames.hasOwnProperty(instVarName)) {
				recv.vars[instVarName] = value;
				return recv.vars[instVarName];
			}
			parentName = parentObj.superClassName;
		}
	}
	throw new Error("Undeclared variable instance!");
}

// ...

