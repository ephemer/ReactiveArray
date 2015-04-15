# ReactiveArray

Allows creating a ReactiveArray type, based on ReactiveVar, that reacts when you use Array's inbuilt functions (currently push, slice, splice... that's all I've ever needed, but push requests are welcome).

## Usage:

var rArray = new ReactiveArray();

Tracker.autorun(function() {
    console.log(rArray.get());
});

rArray.push(1);
// --> logs: [1]

rArray.push(3,5,6);
// --> logs: [1,3,5,6]

etc.


This is the current implementation:

```

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
```