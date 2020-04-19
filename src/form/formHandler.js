export function createControl(config, validation) {
    return {
        ...config,
        validation,
        valid: !validation,
        touched: false,
    }
}

export function validate(value, validation = null) {
    //если нет объекта валидации, то валидируем
    if(!validation) {
        return true;
    }
    //если есть, то создаем переменную валидации, по умолчанию true
    let isValid = true;
    //если есть правило валидации required, проверяем
    if(validation.required) {
        isValid = value.trim() !== '' && isValid;
    }
    //после всех валидаций возвращаем переменную isValid
    return isValid;
}

export function validateForm(formControls) {
    let isFormValid = true;

    for (let control in formControls) {
        //если есть у самого объекта (а не у прототипа)
        if(formControls.hasOwnProperty(control)) {
            isFormValid = formControls[control].valid && isFormValid;
        }
    }

    return isFormValid;
}

export function validateFormForQuestion(formControls) {
    let isFormValid = true;

    for (let control in formControls) {
        //если есть у самого объекта (а не у прототипа)
        if(formControls.hasOwnProperty(control) && control !== 'quizName') {
            isFormValid = formControls[control].valid && isFormValid;
        }
    }

    return isFormValid;
}