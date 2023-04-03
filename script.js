console.log("Hey there");

const btn = document.querySelector(".btn-open");
const form = document.querySelector(".fact-form");
btn.addEventListener("click", function () {
  //   console.log("CLICK");
  if (form.classList.contains("hidden")) {
    form.classList.remove("hidden");
    btn.textContent = "Close";
  } else {
    form.classList.add("hidden");
    btn.textContent = "share a fact";
  }
});

function calcFactAge(year) {
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;

  if (age >= 0) return age;
  else return "Impossible year!!!";
}

years = calcFactAge(2012);
const str = `This fact is "${years} years" old.`;
console.log(str);

//Arrow Functions

const calcFactAge2 = (year) =>
  year <= new Date().getFullYear()
    ? new Date().getFullYear() - year
    : `Impossible year. Year needs to be less or equal to ${new Date().getFullYear()}`;
console.log(calcFactAge2(2012));
