const formElements = []
const form_errors = []
let maxFreeResponseLength = 200;

window.addEventListener("DOMContentLoaded", init);

function init() {
    const name = document.querySelector('#name');
    if (name) {
        formElements.push(name);
        name.addEventListener('input', regexChecker);
    }

    const email = document.querySelector('#email');
    if (email) formElements.push(email);

    const importance = document.querySelector('#slider');
    if (importance) formElements.push(importance);

    const reason = document.querySelector('#school');
    if (reason) formElements.push(reason);

    const textArea = document.querySelector('#free-response');
    if (textArea) {
        formElements.push(textArea);
        textArea.addEventListener('input', changeCharacterCount);
    }

    const submitButton = document.querySelector('#submit-button');
    submitButton.addEventListener('click', handleSubmit);
}

function handleSubmit(e) {
    console.log(e);
    e.preventDefault();

    let errors = {}, errorCount = 0
    formElements.forEach((elem) => {
        if (!elem.checkValidity()) {
            errorCount += 1;
            elem.reportValidity();

            errors[elem.id] = elem.validationMessage;
        }
    })

    if (errorCount == 1) {
        setError('There is an error, please fix it.');
        form_errors.push(errors);
    } else if (errorCount > 1) {
        setError('There are multiple errors in this form. Please fix them.');
        form_errors.push(errors);
    } else {
        hideOutput(document.querySelector('#errors'));
        
        const formErrorsElem = document.querySelector('#form-errors');
        if (formErrorsElem) formErrorsElem.value = JSON.stringify(form_errors);

        document.forms["contact-form"].submit();
    }
}

let timeoutId;
function regexChecker(e) {
    if (this.validity.patternMismatch) {
        this.dataset.regexMismatch = 'true';
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(hideOutput, 5000, document.querySelector('#info'));
        setInfo(`Expected name to contain at least two space-separated words, 
                    with all words of length at least 2, and no special characters
                    except for ' and .`);
    } else {
        delete this.dataset.regexMismatch;
        window.clearTimeout(timeoutId);
        hideOutput(document.querySelector('#info'));
    }
}

function changeCharacterCount(e) {
    const cc = document.querySelector('#character-count');
    cc.innerHTML = this.maxLength - this.value.length;

    if (Number(this.maxLength - this.value.length) <= 20) {
        cc.dataset.low = 'true';
    } else {
        delete cc.dataset.low;
    }
}

function setInfo(input) {
    const errorOutput = document.querySelector('#info');
    errorOutput.dataset.display = 'true';
    errorOutput.value = `INFO: ${input}`;
}

function setError(input) {
    const errorOutput = document.querySelector('#errors');
    errorOutput.dataset.display = 'true';
    errorOutput.value = `ERROR: ${input}`;
}

function hideOutput(object) {
    delete object.dataset.display;
    object.value = '';
}