
// BUDGET CONTROLLER    : It tracks all income, expense, budget itself and percentage (Calculator)
var budgetController = (function() {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);     // Integer number
        } else {
            this.percentage= -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
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
        },
        budget: 0,
        percentage: -1          // non-existent element
    };

    return {
        addItem: function(type, des, val){
            var newItem, ID;

            // Create new ID 
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
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

        deleteItem: function(type, id) {
            var ids, index;

            // data.allItems[type][id] is not working.
            // id = 6
            // ids = [1, 2. 4. 6]
            // index = 3

            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }

        },

        calculateBudge: function() {

            // Calculate total expensed and income
            calculateTotal('exp');
            calculateTotal('inc');

            // Calculate the budget: income - expense
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate the percentage of income that we spent
            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
                // Expense = 100 Income = 200 , spent 50% = 100 / 200 = 0.5 * 100 
            } else {
                data.percentage = -1;
            }
    },

    calcPercentages: function() {
        data.allItems.exp.forEach(function(current) {
            current.calcPercentage(data.totals.inc);
        });
    },

    getPercentages: function() {
        var allPerc = data.allItems.exp.map(function(current) {         // map returns sth and store it to the variable (!== forEach)
            return current.getPercentage();                             // if items were 5 in array, then It will be called 5 times.
        });
        return allPerc;             // Returns array with percentages
    },

    getBudget: function() {
        return {
            budget: data.budget,
            totalInc: data.totals.inc,
            totalExp: data.totals.exp,
            percentage: data.percentage
        };
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel:'.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensePercLabel: '.item__percentage'
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

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace the placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);


            // Insert the HTML into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID);

            el.parentNode.removeChild(el);  
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

        displayBudget: function(obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        displayPercentages: function(percentages) {
            var fields = document.querySelectorAll(DOMstrings.expensePercLabel);    // querySelectorAll returns a nodeList not an array.

            var nodeListForEach = function(nodeList, callback) {
                for(var i = 0; i < nodeList.length; i++) {      // We can't use forEach (array mehtod). IT is HACK for 'forEach' method.
                    callback(nodeList[i], i)                    // nodeList[i] = current /  i = index
                }
            };

            nodeListForEach(fields, function(current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });

            /*  another way 
            Array.prototype.slice.call(fileds);
            fileds.forEach(current, index) {
                ...
            }
            */
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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);   
        // Event delegation 
         // "container" is the parents element containing expenses and income. / bubbling up
    };


    var updateBudget = function() {

         // 1. Calculate the budget
        budgetCtrl.calculateBudge();

         // 2. Return the budget
        var budget = budgetCtrl.getBudget(); 

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    var updatePercentage = function() {

        // 1. Calculate  percentages.
        budgetCtrl.calcPercentages();

        // 2. Read percentages from the budget controller.
        var percentages = budgetCtrl.getPercentages();

        // 3. Update the UI with the new percentages.
        UICtrl.displayPercentages(percentages);
    };


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

            // 6. Calculate and update percentage
            updatePercentage();
        }
    };

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;      
        // event.target: read the target element where event is fired.
        // parentNode: move up to the parents/ from icon to <div>item / 4 times / and select ID of item
        
        if(itemID) {        // if 'itemID' exists, It is true

            splitID = itemID.split('-');
            // var test = 'exp-1' ==> test.split('-') ==> ["exp", "1"]

            type = splitID[0];  // inc or exp
            ID = parseInt(splitID[1]);    // ID 

            // 1. Delete the item from data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete the item from UI
            UICtrl.deleteListItem(itemID);
            
            // 3. Update and show the new budget
            updateBudget();

            // 4. Calculate and update percentage
            updatePercentage();
        }
    };

    return {
        init: function() {
            console.log('Application is started.');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };

})(budgetController, UIControllor);


controller.init();
