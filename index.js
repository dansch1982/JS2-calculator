$("#numbers").on('click', 'button', function () {
    addInput(this.textContent)
});
$("#operators").on('click', 'button', function () {
    operate(this.textContent)
});

$("#input").on('keyup', function () {
    cleanInput()
})
$("#output").keypress(function () {
    return false
})
$("#output").on('click', function () {
    this.select()
})
$("#input").keypress(function (event) {
    setTimeout(() => {
        cleanInput()
    }, 1);
    return (event.charCode >= 48 && event.charCode <= 57) || (event.charCode == 46 && !$("#input").val().includes("."))
})
$(document).on('keydown', function (event) {
    if (event.ctrlKey) {
        return
    }
    let key = event.key.toLowerCase()
    let elementID;
    if ($('#input').is(':focus')) {
        elementID = "operators"
    } else {
        elementID = "calculator"
        $(':focus').blur();
    }
    if (key === "enter") key = "="
    else if (key === "escape") key = "c"
    else if (key === "backspace" && !$('#input').is(':focus')) {
        $("#input").val($("#input").val().slice(0, -1))
        return cleanInput()
    }

    $("#" + elementID).find("button").each(function () {
        if (this.textContent.toLowerCase().startsWith(key.toLowerCase())) {
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
    if (input === "±") {
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
        case "Clear":
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
    let index;
    if (array.length <= 1) {
        return parseFloat(array[0])
    } else if (array.includes('*') || array.includes('/')) {
        const firstIndex = array.indexOf("*")
        const secondIndex = array.indexOf("/")
        index = firstIndex < secondIndex ? firstIndex < 0 ? secondIndex : firstIndex : secondIndex < 0 ? firstIndex : secondIndex
    } else if (array.includes('+') || array.includes('-')) {
        const firstIndex = array.indexOf("+")
        const secondIndex = array.indexOf("-")
        index = firstIndex < secondIndex ? firstIndex < 0 ? secondIndex : firstIndex : secondIndex < 0 ? firstIndex : secondIndex
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
    const operator = array[index]
    const number = operatorArray[operator](parseFloat(array[index - 1]), parseFloat(array[index + 1]))
    array.splice(index - 1, 3, number)
    return calcArray(array)
}

function cleanInput() {
    const value = $("#input").val();
    if (value[0] === "0" && value.length > 1 && value[1] !== ".") {
        $("#input").val(value.substring(1))
    } else if (!value) {
        $("#input").val("0")
    }
}