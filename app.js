
// BUDGET CONTROLLER
var budgetController = (function() {

    // Some code

})();




// UI CONTROLLER
var UIControllor = (function() {

    // String structure : Change easily entire class name. 
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn'
    };



    return {
        getInput: function() {                                     // It should be a Public function (method) in order to controller can use.    
            return {                                              // Get the three values from the input at the same time.
                type : document.querySelector(DOMstrings.inputType).value,       //will be either inc or exp
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : document.querySelector(DOMstrings.inputValue).value
            }
        },

        getDOMstrings: function() {                              // Exposing the DOMstrings into the public where can access from other module.
            return DOMstrings;
        }
    }

})();





// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

    // Event listeners
    var setupEventListeners = function() {

        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(e) {
            if (e.keycode === 13 || e.which === 13) {                   // "which" is for older blowser that doesn't identify "keycode".
                ctrlAddItem();
            }
        });
    };


    var ctrlAddItem = function() {

         // 1. Get the field the input data 
        var input = UICtrl.getInput();

        // 2. Add a item to the budget controller

        // 3. Add the item to the UI

        // 4. Calculate the budget

        // 5. Display the budget on the UI
    };

    return {
        init: function() {
            console.log('Application is started.');
            setupEventListeners();
        }
    };

})(budgetController, UIControllor);


controller.init();
