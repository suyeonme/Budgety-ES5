
// BUDGET CONTROLLER    : It tracks all income, expense, budget itself and percentage (Calculator)
var budgetController = (function() {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };


    // Data structure
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }

    return {
        addItem: function(type, des, val){
            var newItem, ID;

            // ID = last ID + 1

            // Create a new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }   else {
                ID = 0;
            }
    

            // Create new item based on 'inc' or 'exp'type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            // Push it into our data structure
            data.allItems[type].push(newItem);

            // Return the new element
            return newItem;
        },
        testing: function() {
            console.log(data);
        }
    };

})();




// UI CONTROLLER
var UIControllor = (function() {

    // String structure : Change easily entire class name. 
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    };



    return {
        getInput: function() {                                     // It should be a Public function (method) in order to controller can use.    
            return {                                              // Get the three values from the input at the same time.
                type : document.querySelector(DOMstrings.inputType).value,       //will be either inc or exp
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },

        addListItem: function (obj, type) {     // obj == newItem
            var html, newHtml, element;

            // Create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace the placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);


            // Insert the HTML into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields: function() {
            var fields, fieldsArr;
            
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue); // List
            
            fieldsArr = Array.prototype.slice.call(fields);    
            // Returns the selected elements in an array, as a new array object.
            // Chage fieldsArr to an array using slice().
            
            fieldsArr.forEach(function(current, index, array) {       
                current.value = "";
            });
            // foreach is an Array method which can execute a function on each element in an array.

            fieldsArr[0].focus();   
            // focus on the first element(description) in array.
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


    var updateBudget = function() {

         // 1. Calculate the budget

         // 2. Return the budget

        // 3. Display the budget on the UI
    }


    // Center of controller
    var ctrlAddItem = function() {
        var input, newItem;

         // 1. Get the field the input data 
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {      
        // Prevent to add an empty input.
        // isNaN: non number = true, number = flase / !isNaN : number = true, non number = flase.
        // It should be a number. 

            // 2. Add a item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the fields
            UICtrl.clearFields();

            // 5. Calculate and update the budget
            updateBudget();
        }
    };

    return {
        init: function() {
            console.log('Application is started.');
            setupEventListeners();
        }
    };

})(budgetController, UIControllor);


controller.init();
