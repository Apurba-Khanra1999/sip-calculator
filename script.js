function updateYearsValue(value) {
    document.getElementById('yearsValue').textContent = value;
    document.getElementById('yearsInput').value = value;
}

function updateRateValue(value) {
    document.getElementById('rateValue').textContent = value;
    document.getElementById('rateInput').value = value;
}

function updateYearsSlider(value) {
    document.getElementById('years').value = value;
    document.getElementById('yearsValue').textContent = value;
}

function updateRateSlider(value) {
    document.getElementById('rate').value = value;
    document.getElementById('rateValue').textContent = value;
}

function formatNumberWithCommas(number) {
    const [integerPart, decimalPart] = number.toString().split(".");
    const lastThreeDigits = integerPart.slice(-3);
    const otherDigits = integerPart.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    const formattedNumber = otherDigits ? otherDigits + "," + lastThreeDigits : lastThreeDigits;
    return decimalPart ? formattedNumber + "." + decimalPart : formattedNumber;
}

function calculateSIP() {
    const lumpsum = parseFloat(document.getElementById('lumpsum').value);
    const monthly = parseFloat(document.getElementById('monthly').value);
    const years = parseFloat(document.getElementById('years').value);
    const rate = parseFloat(document.getElementById('rate').value);

    const months = years * 12;
    const monthlyRate = rate / 12 / 100;

    let futureValue = lumpsum * Math.pow(1 + monthlyRate, months);
    let totalInvestment = lumpsum + monthly * months;

    for (let i = 0; i < months; i++) {
        futureValue += monthly * Math.pow(1 + monthlyRate, months - i);
    }

    const totalReturn = futureValue - totalInvestment;

    document.getElementById('totalInvestment').textContent = formatNumberWithCommas(totalInvestment.toFixed(2));
    document.getElementById('totalReturn').textContent = formatNumberWithCommas(totalReturn.toFixed(2));
    document.getElementById('finalAmount').textContent = formatNumberWithCommas(futureValue.toFixed(2));
}
