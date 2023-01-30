'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Lakshmanan Raj',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'INR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Kavitha',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% | create Userame | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

const creatUserNames = function (accs) {
  accs.forEach(function (acc) {
     acc.username = acc.owner
    .toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join('');
    // console.log(acc.username);
  }); 
};

creatUserNames(accounts);
// console.log(accounts);
// console.log(creatUserNames("Bala Guru"));
// creatUserNames('Bala Guru');

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% | Histry - Movements | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

const displayMovements = function (acc,sort = false) {

  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice()
  .sort((a,b) => a-b) : acc.movements;

  movs.forEach(function (mov,i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);

    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();

    const displayDate = `${day}/${month}/${year}`

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov.toFixed(2)} ₹</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin',html);
  });
};
// displayMovements(account1.movements);
// console.log(containerMovements.innerHTML);

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% | Balance | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

const calcDisplayBalance = function (acc) {
  const balance = acc.movements.reduce((acc,cur) => acc + cur,0);
  acc.balance = balance;
  labelBalance.textContent = `${acc.balance.toFixed(2)} ₹`
};
// calcDisplayBalance(account1);

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% | Summary in, out, interst | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

const calcDisplaySummary = function (acc) {

  // ************** | in | ************** 
  const incomes = acc.movements
  .filter(mov => mov > 0)
  .reduce((acc,mov) => acc + mov,0);
  labelSumIn.textContent = `${incomes.toFixed(2)}₹`;

  // ************** | out | ************** 
  const outGoing = acc.movements
                 .filter(mov => mov < 0)
                 .reduce((acc,mov) => acc + mov,0);
  labelSumOut.textContent = `${Math.abs(outGoing).toFixed(2)}₹`;

  // ************** | interest | ************** 
  const interest = acc.movements
                 .filter(mov => mov > 0)        // plus value mattum eduka
                 .map((deposit,i,arr) => {
                  // console.log(arr)
                  return (deposit * acc.interestRate) / 100
                 })
                 .filter((int,i,arr) => {       // 0 - irundha adhakula interest poda mudiyadhu
                  // console.log(arr)
                  return int > 1
                 })
                 .reduce((acc,int) => acc + int);
  labelSumInterest.textContent = `${interest.toFixed(2)}₹`;
}
// calcDisplaySummary(account1);

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% | Update UI | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

const updateUI = function (acc) {
  // ************** | Display Movement | ************** 
      displayMovements(acc);

    // ************** | Display balance | ************** 
      calcDisplayBalance(acc);

    // ************** | Display Summary | ************** 
      calcDisplaySummary(acc);
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% | login | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Event Handler

let currentAccount;

// FAKE ALWAYS LOGGED IN
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;



// ************** | login inputs | ************** 

btnLogin.addEventListener('click',function (e) {
  // Prevent form from Submitting
  e.preventDefault(); 

  // get Correct Account
  currentAccount = accounts
    .find(acc => acc.username === inputLoginUsername.value);
  // console.log(currentAccount);
  if (currentAccount?.pin === +(inputLoginPin.value)) {
    
    // ************** | Display UI and Message | ************** 
      labelWelcome.textContent = `👋 Welcome back, ${currentAccount.owner.split(' ')[0]}`;
      containerApp.style.opacity = 100;

    // ************** | Date | ************** 

    const now = new Date();

    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);
    const sec = now.getSeconds();

    const displayDate= `${day}/${month}/${year}, ${hour}:${min}`
    labelDate.textContent = displayDate;

    // Update UI
      updateUI(currentAccount);
  };
  // ************** | Clear inputs | **************   
      inputLoginUsername.value = inputLoginPin.value = '';
      inputLoginPin.blur();
});

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% | Transfer Money | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

btnTransfer.addEventListener('click',function (e) {
  // Prevent form from Submitting
  e.preventDefault();

  const amount = +(inputTransferAmount.value);
  const receiverAcc = accounts
  .find(acc => acc.username === inputTransferTo.value);
  // console.log(amount, receiverAcc);

 // Tranfer valid
  if (amount > 0 &&
      receiverAcc &&
      currentAccount.balance >= amount &&
      receiverAcc?.username !== currentAccount.username) 
  {
    // console.log('Transfer Valid');
  // Doing Transfer 
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

  // Add Transfer Date
    currentAccount.movementsDates.push(new Date().toISOString().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

  // Update UI
    updateUI(currentAccount);
};
// clean inputs
    inputTransferTo.value = inputTransferAmount.value = '';
    inputTransferTo.blur();
    inputTransferAmount.blur();

});

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% | Request Loan | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

btnLoan.addEventListener('click',function (e) {
  // preventDefault
  e.preventDefault();

  const loanAmount = Math.floor(inputLoanAmount.value);
  const percentAge = currentAccount.movements.some(mov => mov >= loanAmount * 0.1);

  if (loanAmount > 0 && percentAge ) {
      // Add Movement
      currentAccount.movements.push(loanAmount);

      // Add loan Date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
        updateUI(currentAccount);
    }
    // clean input
        inputLoanAmount.value = '';
        inputLoanAmount.blur();
});

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% | Close Account | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

btnClose.addEventListener('click',function (e) {
  // preventDefault
  e.preventDefault();
  let user = inputCloseUsername.value;
  let pin = +(inputClosePin.value);

  if (currentAccount.username === user &&
      currentAccount.pin === pin) {

    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    // console.log(index);

    // Delete Account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  };
  // clean Input
    inputCloseUsername.value = inputClosePin.value = '';
    inputCloseUsername.blur();
    inputClosePin.blur();
});

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% | Sorting Movements | %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

let stored = false;

btnSort.addEventListener('click',function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements,!stored);
  stored = !stored;
});


/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
/*
console.log(23 === 23.0);

// Base 10 - 0 t0 9. | 1/10 = 0.1. - 3/10 = 3.33333333
// Binary base 2 - 0 1.

console.log(0.1 + 0.2 === 0.3);

// convert string to number
console.log(Number('23'));
console.log(+'23');

// parsing

// int
console.log(Number.parseInt('30px',10));
console.log(Number.parseInt('e23',10));

// Float
// console.log(Number.parseInt('23.95px'));
console.log(Number.parseFloat('    23.95px  ')); // | SPACE is not affect

// isNAN
console.log(Number.isNaN(20));          // false
console.log(Number.isNaN('20'));        // false
console.log(Number.isNaN(+'20'));       // false
console.log(Number.isNaN(+'20px'));     // true
console.log(Number.isNaN(23/0));        // false

// isFinite
console.log(Number.isFinite(20));       // true
console.log(Number.isFinite('20'));     // false
console.log(Number.isFinite(+'20'));    // true
console.log(Number.isFinite(+'20px'));  // false
console.log(Number.isFinite(20/0));     // false

// isInteger
console.log(Number.isInteger(23));
console.log(Number.isInteger(23.0));
console.log(Number.isInteger(23.9));
console.log(Number.isInteger(23/0));

// Math.sqrt
console.log(Math.sqrt(25));
console.log(25 ** (1/2));
console.log(8 ** (1/3));

// Math.max() & Math.min()
console.log(Math.max(5,1,45,23,56,30)); // 56
console.log(Math.max(5,1,45,'23',56,30)); // 56
console.log(Math.max(5,1,45,'23px',56,30)); // NaN

console.log(Math.min(5,1,45,23,56,30)); // 1
console.log(Math.min(5,1,45,'23',56,30));// 1

// Math.pin
console.log(Math.PI * Number.parseInt('10px') ** 2)
console.log(Math.PI * Number.parseFloat('10px') ** 2)

console.log((Math.trunc(Math.random() * 6) + 1));

// Math.random() ---> 10 to 20 Kulla
const randomInt = (min,max) => Math.floor(Math.random() * ((max-min) + 1 ) + min);
console.log(randomInt(10,20));

// Rounded Integers/////////////////////////////////////////////////

// trunc
console.log('<---- trunc ---->')
// +
console.log(Math.trunc(23.2));
console.log(Math.trunc(23.8));
// -
console.log(Math.trunc(-23.2)); 
console.log(Math.trunc(-23.8));

// floor      
console.log('<---- floor ---->')
// +
console.log(Math.floor(23.2));
console.log(Math.floor(23.8));
// -
console.log(Math.floor(-23.2));
console.log(Math.floor(-23.8)); // -24

// ceil
console.log('<---- ceil ---->')
// +
console.log(Math.ceil(23.2));
console.log(Math.ceil(23.8));
// -
console.log(Math.ceil(-23.2));
console.log(Math.ceil(-23.8));
// round
console.log('<---- round ---->')
// +
console.log(Math.round(23.2));
console.log(Math.round(23.8));
// -
console.log(Math.round(-23.2));
console.log(Math.round(-23.8));

// Rounding Decimals
console.log((2.7).toFixed(0));
console.log((2.3).toFixed(3));
console.log(+((2.335).toFixed(2)));

// Reminder
console.log(5 % 2);
console.log(5 / 2); // 5 => 2 * 2 + 1 -> 1 is reminder

console.log(8 % 3);
console.log(8 / 3); // 8 => 2 * 3 + 2 -> 2 is reminder

console.log(6 % 2);
console.log(6 / 2);

const isEven = n => n % 2 === 0;
console.log(isEven(10))
console.log(isEven(15))
console.log(isEven(23))

labelBalance.addEventListener('click',function () {
[...document.querySelectorAll('.movements__row')]
.forEach(function (row,i) {
  if (i % 2 === 0) {
    console.log(row);
    row.style.backgroundColor = '#B9F3FC'
  }else{
    row.style.backgroundColor = '#FFF'
  }
})
})

const diameter = 287_460_000_000;
console.log(diameter)             // 287460000000

const price = 345_99;
console.log(price)

const transfer1 = 15_00;
const transfer2 = 1_500;

const PI = 3.1415;
console.log(PI)

console.log(Number('23_000')) // NaN
console.log(Number.parseInt('230_000'))

console.log(2 ** 53 -1)
console.log(Number.MAX_SAFE_INTEGER)
console.log(2 ** 53 +0)
console.log(2 ** 53 +1)
console.log(2 ** 53 +2)
console.log(2 ** 53 +3)
console.log(651854561645963226295265265491654165495635494)
console.log(651854561645963226295265265491654165495635494n)
console.log(BigInt(651854561645963226295265265491654165495635494))


console.log(10000n + 10000n);
console.log(216465165496461984651521657974598762165964651n * 514564584n)

// const huge = 21546358134657958713565485943132264154n;
// const num = 23n;

const huge = 21546358134657958713565485943132264154n;
const num = 23;

console.log(huge * BigInt(num))
console.log(20n > 10)
console.log(typeof 20n)
console.log(20n === 20)

console.log(11n / 3n) // 3n
console.log(11 / 3)   // 3.666666666666666

// Create Date 
const now = new Date()
console.log(now)

console.log(new Date('jan 21 2000 21:15:55'))
console.log(new Date('January 21,2000'))
console.log(new Date('account1.movementsDates[0]'))
console.log(new Date(2000,1,21,4,30,22))

console.log(new Date(0))
console.log(new Date(21 * 24 * 60 * 60 * 1000))

const future = new Date() 
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate());
console.log(future.getDay());
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.getTime());

console.log(future.toISOString());
console.log(new Date(1675081933986))
console.log(Date.now())

future.setFullYear(2000)
console.log(future)
*/



















