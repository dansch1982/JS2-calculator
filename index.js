$("#numbers").on('click', 'button', function () {
    addInput(this.textContent)
});
$("#operators").on('click', 'button', function () {
    operate(this.textContent)
});

$("#input").on('keyup', function (event) {
    cleanInput()
})
$("#input").keypress(function (event) {
    setTimeout(() => {
        cleanInput()
    }, 1);
    return (event.charCode >= 48 && event.charCode <= 57) || (event.charCode == 46 && !$("#input").val().includes("."))
})
$(document).on('keydown', function (event) {
    let key = event.key.toLowerCase()
    if (key === "enter") key = "="
    else if (key === "escape") key = "c"
    else if (key === "backspace") {
        $("#input").val($("#input").val().slice(0, -1)) // FIX THIS
        return cleanInput()
    }

    let elementID;
    if ($('#input').is(':focus')) {
        elementID = "operators"
    } else {
        elementID = "calculator"
    }
    $("#" + elementID).find("button").each(function () {
        if (this.textContent.toLowerCase() === key.toLowerCase()) {
            this.click()
            this.classList.toggle("pressed")
            setTimeout(() => {
                this.classList.toggle("pressed")
            }, 100);
            return false
        }
    })
})
/**
 * @param {String} input 
 */
function addInput(input) {
    /**
     * @type {String}
     */
    let string = $("#input").val()
    if (input === "+/-") {
        string = string.startsWith("-") ? string.substring(1) : "-" + string
    } else if (input === ".") {
        if (!string.includes(".")) {
            string += input
        }
        if (string === ".") {
            string = 0 + string
        }
    } else if (string === "0") {
        string = string === input ? "0" : input
    } else {
        string += input
    }

    $("#input").val(string)
}

/**
 * @param {String} operator 
 */
function operate(operator) {
    switch (operator) {
        case "C":
            $("#input").val("0")
            $("#output").val("")
            $("#output").removeAttr("list")
            break;
        case "=":
            calculate();
            break;
        default:
            addOperator(operator);
            break;
    }
}
/**
 * @param {String} operator 
 */
function addOperator(operator) {
    let input = parseFloat($("#input").val()).toString()
    input = input === 0 ? "0" : input.endsWith('.') ? input.slice(0, -1) : input.startsWith(".") ? "0" + input : input
    if (!$("#output").attr("list")) {
        $("#output").attr("list", input + "," + operator)
    } else {
        $("#output").attr("list", $("#output").attr("list") + "," + input + "," + operator)
    }
    $("#input").val("0")
    $("#output").val($("#output").attr("list").replace(/,/g, ""))
}

function calculate() {
    const list = $("#output").attr("list") ? $("#output").attr("list").split(",") : []
    list.push($("#input").val())
    $("#input").val("0")
    $("#output").val(calcArray(list))
    $("#output").removeAttr("list")
}

/**
 * @param {Array} array
 */
function calcArray(array) {
    let operator;
    if (array.length === 1) {
        return array[0]
    } else if (array.includes('*')) {
        operator = "*"
    } else if (array.includes('/')) {
        operator = "/"
    } else if (array.includes('+')) {
        operator = "+"
    } else if (array.includes('-')) {
        operator = "-"
    }
    const operatorArray = {
        "*": (a, b) => {
            return a * b
        },
        "/": (a, b) => {
            return a / b
        },
        "+": (a, b) => {
            return a + b
        },
        "-": (a, b) => {
            return a - b
        },
    }
    const index = array.indexOf(operator)
    const number = operatorArray[operator](parseFloat(array[index - 1]), parseFloat(array[index + 1]))
    array.splice(index - 1, 3, number)
    return calcArray(array)
}

function cleanInput() {
    if ($("#input").val()[0] === "0" && $("#input").val().length > 1 && $("#input").val()[1] !== ".") {
        $("#input").val($("#input").val().substring(1))
    } else if (!$("#input").val()) {
        $("#input").val("0")
    }
}