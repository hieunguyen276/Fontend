
// Đối tượng Validator
function Validator(options) {
    function getParent(element, selector) {
        while (element.parentElement) {
            //matches: kiểm tra xem có class "selector" k nếu có thì lấy
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    var selectorRules = {};

    //Hàm thực hiện validate
    function validate(inputElement, rule) {


        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
        var errorMessage;

        // Lấy ra các rules của selector
        var rules = selectorRules[rule.selector];

        // Lặp qua từng rules & kiểm tra
        // Nếu có lỗi dừng việc kiểm tra
        for (var i = 0; i < rules.length; ++i) {
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    );
                    break;
                default:
                    errorMessage = rules[i](inputElement.value);
            }   
            
            if (errorMessage) break;
        }

        if (errorMessage) {
            errorElement.innerHTML = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add('invalid');
        } else {
            errorElement.innerHTML = '';
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
        }

        return !errorMessage;
    }
    
    // Lấy element của form cần validate
    var formElement = document.querySelector(options.form);

    if(formElement) {
        // Khi submit form 
        formElement.onsubmit = function (e) {
            e.preventDefault();

            var isFormValid = true;

            // Lặp qua từng rules và validate
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
            
                var isValid =  validate(inputElement, rule); 
                if (!isValid) {
                    isFormValid = false;
                }    
            });

            var enableInputs = formElement.querySelectorAll('[name]');

            console.log(enableInputs)

            if (isFormValid) {
                // Trường hợp submit vs javascript
                if (typeof options.onSubmit === 'function') {
                    var formValues = Array.from(enableInputs).reduce(function (values, input) {
                        
                        switch(input.type) {
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                                break;
                           
                            default:
                                values[input.name] = input.value;
                        }

                        return values;
                    }, {});

                    options.onSubmit(formValues);
                } 

                else {
                    formElement.submit();
                }
            }

        }

        // Lặp qua mỗi rule và xử lý (lắng nghe sự kiện blur, input,...)
        options.rules.forEach(function (rule) {

            // Lưu lại các rules cho mỗi input

            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }


            var inputElements = formElement.querySelectorAll(rule.selector);
            
            Array.from(inputElements).forEach(function (inputElement) {
                if(inputElement) {
                    // Xử lý trường hợp blur khỏi input
                    inputElement.onblur = function () {
                        //value: inputElement.value

                        validate(inputElement, rule);       
                    }
    
                    // Xử lý mỗi khi người dùng nhập vào input
                    inputElement.oninput = function () {
                        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
                        errorElement.innerHTML = '';
                        getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
                    }
                }
             });

            
        });
    }

}


// Định nghĩa rules

Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            //value.trim() : loại các dấu cách
            return value ? undefined : message || 'Vui lòng nhập trường này'
        }
    };
}

Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
            return regex.test(value) ? undefined : message || 'Vui lòng nhập email';
        }
    };
}

Validator.minLength = function (selector, min, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} ký tự`;
        }
    };
}

Validator.isConfirmed = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || 'Gía trị nhập vào không chính xác';
        }
    };
}

Validator.isVietnamesePhoneNumber = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/ ;
            return regex.test(value) ? undefined : message || 'Vui lòng nhập số điện thoại';
        }
    };
}



