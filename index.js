const formCalculator = document.forms.calculator;
const buttonSend = formCalculator.elements.buttonSend;
const formFields = document.querySelectorAll('.form-field');
const result = document.querySelector('.result-text');
const carMake = formCalculator.elements['car-make'];
const carModel = formCalculator.elements['car-model'];
const carConditions = formCalculator.elements['condition'];


//Модели автомобилей с базовой стоимостью
const dictCarModels = {
    reno: [
        { model: 'Renault Clio', price: 1000000 },
        { model: 'Renault Megane', price: 1200000 },
        { model: 'Renault Captur', price: 1300000 }
    ],
    opel: [
        { model: 'Opel Astra', price: 1100000 },
        { model: 'Opel Corsa', price: 900000 },
        { model: 'Opel Insignia', price: 1400000 }
    ],
    mazda: [
        { model: 'Mazda 3', price: 1200000 },
        { model: 'Mazda CX-5', price: 1500000 },
        { model: 'Mazda 6', price: 1400000 }
    ],
    jaguar: [
        { model: 'Jaguar XE', price: 2000000 },
        { model: 'Jaguar F-Pace', price: 2500000 },
        { model: 'Jaguar XF', price: 2200000 }
    ]
};

//Коэффициенты к виду топлива
const coeffTypeFuel = {
    gasoline: 1.1,
    diesel: 1.08,
    gas: 1.05,
    electricity: 1.12,
};

//Коэффициенты к объему двигателя
const coeffEngineCapacity = {
    small: 1.16,
    medium: 1.20,
    large: 1.22,
};

//Коэффициенты к б/у автомобилю
const coeffUsedCar = {
    oneTwoOwners: 1.16,
    threeOwners: 1.20,
};


const userData = {};
let errors = false;
let fullPrice = 0;


function checkMakeCar() {
    
    carMake.addEventListener('change', () => {
        carModel.innerHTML = '<option value="" selected>Модель</option>';
        
        if (dictCarModels[carMake.value]) {

            dictCarModels[carMake.value].forEach(car => {
                const option = document.createElement('option');
                option.setAttribute('value', car.model.toLowerCase().replace(/ /, '-'));
                option.textContent = car.model;
                carModel.appendChild(option);
            })
        }
    });
}

checkMakeCar();

function checkСondition() {
    const numOwners = document.querySelector('.num-owners');

    carConditions.forEach(condition => {
        condition.addEventListener('change', () => {
            if (condition.checked && condition.value === 'used-car') {
                numOwners.classList.remove('hidden');
            } else {
                numOwners.classList.add('hidden');
            }
        })
    })
}

checkСondition();

function checkInputCar(input) {
    if (input.value === '') {
        errors = true;
    } else {
        userData[input.name] = input.value;
    }
}

function checkInputTypeFuel() {
    const typeFuels = formCalculator.querySelectorAll('input[name="fuel"]');
    const fuelSelected = Array.from(typeFuels).some(fuel => fuel.checked);

    if (!fuelSelected) {
        errors = true;
    } else if (fuelSelected) {
        typeFuels.forEach(fuel => {
            if (fuel.checked) {
                userData[fuel.name] = fuel.value;
            }    
        })
    }
}

function validityInputEngCapacity(input) {
    const validity = input.validity;
    const error = document.querySelector('.error');

    if (validity.valueMissing) {
        error.textContent = 'Заполните поле';
        errors = true;
    } else if (validity.rangeOverflow) {
        const max = input.getAttribute('max');
        error.textContent = `Максимальное значение ${max} л.`;
        errors = true;   
    } else if (validity.rangeUnderflow) {
        const min = input.getAttribute('min');
        error.textContent = `Минимальное значение ${min} л.`;
        errors = true;
    } else {
        error.textContent = '';
        userData[input.name] = input.value;
    }
}

function checkInputNumOwners() {
    const numOwners = formCalculator.querySelectorAll('input[name="owner"]');
    const numOwnerSelected = Array.from(numOwners).some(owner => owner.checked);

    if (!numOwnerSelected) {
        errors = true;
    } else if (numOwnerSelected) {
        numOwners.forEach(owner => {
            if (owner.checked) {
                userData[owner.name] = owner.value;
            }
        })
    }
}

function checkInputСondition() {
    const conditionsCar = formCalculator.querySelectorAll('input[name="condition"]');
    const conditionSelected = Array.from(conditionsCar).some(condition => condition.checked);

    if (!conditionSelected) {
        errors = true;
    } else if (conditionSelected) {
        conditionsCar.forEach(condition => {
            if (condition.checked) {
                userData[condition.name] = condition.value;
                if (condition.value === 'used-car') {
                    checkInputNumOwners();
                }
            }    
        })   
    }
}

function checkInputTypePayment() {
    const payments = formCalculator.querySelectorAll('input[name="payment"]');
    const paymentSelected = Array.from(payments).some(payment => payment.checked);

    if (!paymentSelected) {
        errors = true;
    } else if (paymentSelected) {
        payments.forEach(payment => {
            if (payment.checked) {
                userData[payment.name] = payment.value;
            }
        })
    }
}

function formValidity() {
    formFields.forEach(input => {
        if (input.name === 'car-make' || input.name === 'car-model') checkInputCar(input);
        if (input.name === 'engine-capacity') validityInputEngCapacity(input);
    });

    checkInputTypeFuel();
    checkInputСondition();
    checkInputTypePayment();
}


function calculatePrice() {

    if (userData['car-model']) {
        const selectedCarModel = Object.values(dictCarModels).flat().find(car => car.model.toLowerCase().replace(/ /, '-') === userData['car-model']);

        fullPrice += Number(selectedCarModel.price);
        console.log(fullPrice);
    }

    if (userData['fuel']) {
        for (let key in coeffTypeFuel) {
            if (key === userData['fuel']) {
            console.log('*' + coeffTypeFuel[key]);
            fullPrice *= coeffTypeFuel[key];
            }
        };
        console.log(fullPrice);
    }

    if (userData['engine-capacity']) {
        let sizeEngine;

        if (Number(userData['engine-capacity']) < 2) sizeEngine = 'small';
        else if (Number(userData['engine-capacity']) >= 2 && Number(userData['engine-capacity']) <= 2.9) sizeEngine = 'medium';
        else sizeEngine = 'large';

        for (let key in coeffEngineCapacity) {
            if (key === sizeEngine) {
            console.log('*' + coeffEngineCapacity[key]);
            fullPrice *= coeffEngineCapacity[key];
            }
        };
        console.log(fullPrice);
    }

    if (userData['owner']) {
        for (let key in coeffUsedCar) {
            if (key === userData['owner']) {
            console.log('/' + coeffUsedCar[key]);
            fullPrice /= coeffUsedCar[key];
            }
        };
        console.log(+
            fullPrice);
    }
}

formCalculator.addEventListener('submit', function(evt) {
    evt.preventDefault();
    
    Object.keys(userData).forEach(key => delete userData[key]);
    errors = false;
    fullPrice = 0;
    result.textContent = '';

    formValidity();
    
    if (errors === false) {
        console.log(userData);
        calculatePrice();

        result.textContent = `Стоимость автомобиля ${userData['car-model'].toUpperCase()} составляет ${fullPrice.toLocaleString('ru-RU')} рублей.`;
    } else {
        result.textContent = 'Заполните все поля для расчета стоимости автомобиля!';
    }
})
