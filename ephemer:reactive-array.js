// Uses inheritance pattern from here:
// http://javascriptissexy.com/oop-in-javascript-what-you-need-to-know/

function inheritPrototype(childObject, parentObject) {
	var copyOfParent = Object.create(parentObject.prototype);
	copyOfParent.constructor = childObject;
	childObject.prototype = copyOfParent;
}


// --------------------------------------------------------------------
// Make the ReactiveArray constructor

ReactiveArray = function (initialValue) {
	if (! (this instanceof ReactiveArray))
		// called without `new`
		return new ReactiveArray(initialValue);

	if(!_.isArray(initialValue)) initialValue = [];
	ReactiveVar.call(this, initialValue, arraysEqual);
	
	function arraysEqual (oldArray, newArray) {
		return _(oldArray).isEqual(newArray);
	}
}

inheritPrototype(ReactiveArray, ReactiveVar);



// --------------------------------------------------------------------
// Add functions to make ReactiveArray do something special

_.extend(ReactiveArray.prototype, {

	// Allow setting of element by index via reactiveArray.set(index, newValue);
	set: _(ReactiveArray.prototype.set).wrap(function(origFn, newValue, index){
		// When we have a normal set function (setting the whole array):
		if (typeof index === "undefined"){
			
			// Allow user to call array.set() to undefined / with no args:
			if (typeof newValue === "undefined") newValue = [];

			// Otherwise ensure user is setting an array
			if (_.isArray(newValue)) return origFn.call(this, newValue);
			else throw new Meteor.Error("A ReactiveArray must always be set to an array!");
		
		}

		// Otherwise we're setting a particular value
		var curValue = this.curValue[index];
		if (curValue === newValue) return;

		this.curValue[index] = newValue;
		this.dep.changed();

	}),

	// Array-specific functions:
	push: function (/*arguments*/){
		Array.prototype.push.apply(this.curValue, arguments);
		this.dep.changed();
	},

	slice: function (/*arguments*/){
		Array.prototype.slice.apply(this.curValue, arguments);
		this.dep.changed();	
	},

	splice: function (/*arguments*/){
		Array.prototype.splice.apply(this.curValue, arguments);
		this.dep.changed();	
	},

})
