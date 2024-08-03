function updateYearsValue(value) {
    document.getElementById('yearsValue').textContent = value;
}

function updateRateValue(value) {
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
    let lumpsum = parseFloat(document.getElementById('lumpsum').value);
    let monthly = parseFloat(document.getElementById('monthly').value);
    const years = parseFloat(document.getElementById('years').value);
    const rate = parseFloat(document.getElementById('rate').value);

    // Default to 0 if lumpsum or monthly is NaN
    if (isNaN(lumpsum)) {
        lumpsum = 0;
    }
    if (isNaN(monthly)) {
        monthly = 0;
    }

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

    window.futureValue = futureValue;
    window.monthlyRate = monthlyRate;
    window.lumpsum = lumpsum;
    window.monthly = monthly;
    window.years = years;
}

function showDialog(content) {
    document.getElementById('dialogText').innerHTML = content;
    document.getElementById('dialog').style.display = 'block';
}

function closeDialog() {
    document.getElementById('dialog').style.display = 'none';
}

function showYearlyBreakdown() {
    const years = window.years;
    const monthlyRate = window.monthlyRate;
    const lumpsum = window.lumpsum;
    const monthly = window.monthly;

    let content = "<h2>Yearly Breakdown</h2><table><tr><th>Year</th><th>Investment</th><th>Return</th><th>Total</th></tr>";
    let totalInvestment = lumpsum;
    let futureValue = lumpsum;
    for (let i = 1; i <= years; i++) {
        futureValue = futureValue * Math.pow(1 + monthlyRate, 12) + monthly * (Math.pow(1 + monthlyRate, 12) - 1) / monthlyRate * (1 + monthlyRate);
        totalInvestment += monthly * 12;
        content += `<tr><td>${i}</td><td>${formatNumberWithCommas(totalInvestment.toFixed(2))}</td><td>${formatNumberWithCommas((futureValue - totalInvestment).toFixed(2))}</td><td>${formatNumberWithCommas(futureValue.toFixed(2))}</td></tr>`;
    }
    content += "</table>";
    showDialog(content);
}

function showMonthlyBreakdown() {
    const years = window.years;
    const monthlyRate = window.monthlyRate;
    const lumpsum = window.lumpsum;
    const monthly = window.monthly;
    const months = years * 12;

    let content = "<h2>Monthly Breakdown</h2><table><tr><th>Month</th><th>Investment</th><th>Return</th><th>Total</th></tr>";
    let totalInvestment = lumpsum;
    let futureValue = lumpsum;
    for (let i = 1; i <= months; i++) {
        futureValue = futureValue * (1 + monthlyRate) + monthly;
        totalInvestment += monthly;
        content += `<tr><td>${i}</td><td>${formatNumberWithCommas(totalInvestment.toFixed(2))}</td><td>${formatNumberWithCommas((futureValue - totalInvestment).toFixed(2))}</td><td>${formatNumberWithCommas(futureValue.toFixed(2))}</td></tr>`;
    }
    content += "</table>";
    showDialog(content);
}
