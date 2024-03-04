const inputSlider = document.querySelector('[data-lengthslider]');
const lengthDisplay = document.querySelector('[data-lengthnumber]');
const passwordDisplay = document.querySelector('[data-passwordDisplay]');
const copybtn = document.querySelector('.copyBtn');
const copyMsg = document.querySelector('[data-copy-msg]');
const uppercase = document.querySelector('#uppercase');
const lowerCase = document.querySelector('#lowercase');
const numberChk = document.querySelector('#numbers');
const symbolChk = document.querySelector('#symbols');
const indicator = document.querySelector('[data-indicator]');
const genrateBtn = document.querySelector('.genratepassword');
let allCheckBoxes = document.querySelectorAll('input[type=checkbox]');
const symbol = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = '';

let checkCount = 0;
// site strength

// slider------->>>>>>
let passwordLength = 10;
sliderHandler();
function sliderHandler() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
}

inputSlider.addEventListener('input', (e) => {
  passwordLength = e.target.value;
  sliderHandler();
});

function colorindicator(color) {
  indicator.style.backgroundColor = color;
  // ?shadow
}
function randomint(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function generateRandomnum() {
  return randomint(0, 10);
}
function generateUppercase() {
  return String.fromCharCode(randomint(65, 91));
}
function generateLowercase() {
  return String.fromCharCode(randomint(97, 123));
}
function generateSymbol() {
  let randomNum = randomint(0, symbol.length);
  return symbol.charAt(randomNum);
}

function handleCheckBoxCHange() {
  checkCount = 0;

  allCheckBoxes.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    sliderHandler();
  }
}

// events on check boxa

allCheckBoxes.forEach((checkbox) => {
  checkbox.addEventListener('change', handleCheckBoxCHange);
});

function calStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNumber = false;
  let hassymbol = false;
  if (uppercase.checked) hasUpper = true;
  if (lowerCase.checked) hasLower = true;
  if (numberChk.checked) hasNumber = true;
  if (symbolChk.checked) hassymbol = true;

  if (hasUpper && hasLower && (hasNumber || hassymbol) && passwordLength >= 8) {
    colorindicator('#0f0');
  } else if (
    (hasLower || hasUpper) &&
    (hasNumber || hassymbol) &&
    passwordLength >= 6
  ) {
    colorindicator('#ff0');
  } else {
    colorindicator('#f00');
  }
}

async function copyContent() {
  try {
    // throw error if password is empty
    if (password === '') {
      alert('First Generate Password to copy');
      throw 'Failed';
    }

    await navigator.clipboard.writeText(password);
    copyMsg.innerText = 'Copied';
  } catch (error) {
    // catch() will only run if any error is thrown by the try block
    copyMsg.innerText = error;
  }

  copyMsg.classList.add('active');
  setTimeout(() => {
    copyMsg.classList.remove('active');
  }, 2000);
}
copybtn.addEventListener('click', () => {
  //   if (passwordDisplay.value)
  copyContent();
  // copytext();
  // navigator.clipboard.writeText(password);
});

// using fisher yates methods
//     We define a function called shuffleArray that takes an array as input.
// We iterate through the array in reverse order (from array.length - 1 to 1).
// In each iteration, we generate a random index j between 0 and i (inclusive).
// We then swap the elements at indices i and j.
// Finally, we return the shuffled array.
function shufflePassword(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = '';
  array.forEach((el) => (str += el));
  return str;
}

function genratePass() {
  if (checkCount <= 0) {
    alert('At least check one checkbox');
    return;
  }

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    sliderHandler();
  }
  // remove oldpassword
  if (password.length) password = '';

  let funcAry = [];
  if (uppercase.checked) funcAry.push(generateUppercase);
  if (lowerCase.checked) funcAry.push(generateLowercase);
  if (numberChk.checked) funcAry.push(generateRandomnum);
  if (symbolChk.checked) funcAry.push(generateSymbol);

  // compulsory addition of the generate functions to the arry if the checked box
  for (let i = 0; i < funcAry.length; i++) {
    password += funcAry[i](); //it will add the first single charachters  from the function indexes to password
  }
  //   console.log(password+"cump")
  for (let i = 0; i < passwordLength - funcAry.length; i++) {
    let randIndex = randomint(0, funcAry.length);
    password += funcAry[randIndex]();
  }

  // lets shuffle the password
  password = shufflePassword(Array.from(password));
  //   console.log(password);
  //   console.log(password);

  //update Ui
  passwordDisplay.value = password;

  //calcu strength
  calStrength();
}
genrateBtn.addEventListener('click', genratePass);
