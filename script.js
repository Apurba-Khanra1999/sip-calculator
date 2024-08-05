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

    document.getElementById('totalInvestment').textContent = '₹ ' + formatNumberWithCommas(totalInvestment.toFixed(2));
    document.getElementById('totalReturn').textContent = '₹ ' + formatNumberWithCommas(totalReturn.toFixed(2));
    document.getElementById('finalAmount').textContent = '₹ ' + formatNumberWithCommas(futureValue.toFixed(2));

    window.futureValue = futureValue;
    window.monthlyRate = monthlyRate;
    window.lumpsum = lumpsum;
    window.monthly = monthly;
    window.years = years;

    updateChart();
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


function updateChart() {
    if (window.myChart) {
        window.myChart.destroy();
    }

    const ctx = document.getElementById('doughnutChart').getContext('2d');
    window.myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Total Investment', 'Total Returns'],
            datasets: [{
                data: [window.lumpsum + window.monthly * window.years * 12, window.futureValue - (window.lumpsum + window.monthly * window.years * 12)],
                backgroundColor: ['#5D3FD3', '#b9a7fe'],
                hoverBackgroundColor: ['#5D3FD3', '#b9a7fe']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function formatNumberWithCommas(number) {
    const [integerPart, decimalPart] = number.toString().split(".");
    const lastThreeDigits = integerPart.slice(-3);
    const otherDigits = integerPart.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    const formattedNumber = otherDigits ? otherDigits + "," + lastThreeDigits : lastThreeDigits;
    return decimalPart ? formattedNumber + "." + decimalPart : formattedNumber;
}


function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const lumpsum = parseFloat(document.getElementById('lumpsum').value);
    const monthly = parseFloat(document.getElementById('monthly').value);
    const years = parseFloat(document.getElementById('years').value);
    const rate = parseFloat(document.getElementById('rate').value);

    const totalInvestment = parseFloat(document.getElementById('totalInvestment').textContent.replace(/[^0-9.-]+/g, ""));
    const totalReturn = parseFloat(document.getElementById('totalReturn').textContent.replace(/[^0-9.-]+/g, ""));
    const finalAmount = parseFloat(document.getElementById('finalAmount').textContent.replace(/[^0-9.-]+/g, ""));

    const date = new Date();
    const dateString = date.toLocaleDateString().replace(/\//g, '-');
    const timeString = date.toLocaleTimeString().replace(/:/g, '-');
    
    // Watermark function
    function addWatermark(doc) {
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text('apurba', doc.internal.pageSize.width / 2, doc.internal.pageSize.height / 2, { align: 'center', angle: 45 });
    }

    // Function to add date and timestamp
    function addDateAndTimestamp(doc) {
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Date: ${date.toLocaleDateString()}`, 10, doc.internal.pageSize.height - 20);
        doc.text(`Time: ${date.toLocaleTimeString()}`, 10, doc.internal.pageSize.height - 10);
    }

    // Add watermark and timestamp to each page
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('SIP Report', 10, 10);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Lumpsum Amount: ₹ ${lumpsum}`, 10, 30);
    doc.text(`Monthly Investment Amount: ₹ ${monthly}`, 10, 40);
    doc.text(`Years: ${years}`, 10, 50);
    doc.text(`Rate of Interest: ${rate}%`, 10, 60);

    doc.text(`Total Investment: ₹ ${totalInvestment.toFixed(2)}`, 10, 70);
    doc.text(`Total Returns: ₹ ${totalReturn.toFixed(2)}`, 10, 80);
    doc.text(`Final Amount: ₹ ${finalAmount.toFixed(2)}`, 10, 90);

    addDateAndTimestamp(doc);
    addWatermark(doc);

    let yOffset = 100;

    // Yearly Breakdown Table
    doc.text('Yearly Breakdown', 10, yOffset);
    yOffset += 10;
    doc.autoTable({
        head: [['Year', 'Investment', 'Return', 'Total']],
        body: generateYearlyBreakdown(years, lumpsum, monthly, rate),
        startY: yOffset,
        margin: { top: 10, bottom: 10 },
    });

    // Monthly Breakdown Table
    doc.addPage();
    doc.text('Monthly Breakdown', 10, 10);
    yOffset = 20;
    doc.autoTable({
        head: [['Month', 'Investment', 'Return', 'Total']],
        body: generateMonthlyBreakdown(years, lumpsum, monthly, rate),
        startY: yOffset,
        margin: { top: 10, bottom: 10 },
    });

    // Add watermark and timestamp to new page
    addDateAndTimestamp(doc);
    addWatermark(doc);

    // Save the PDF with date and timestamp in the file name
    doc.save(`sip-report_${dateString}_${timeString}.pdf`);
}


function generateYearlyBreakdown(years, lumpsum, monthly, rate) {
    const data = [];
    let totalInvestment = lumpsum;
    let futureValue = lumpsum;
    const monthlyRate = rate / 12 / 100;

    for (let year = 1; year <= years; year++) {
        const months = year * 12;
        futureValue = lumpsum * Math.pow(1 + monthlyRate, months);

        for (let i = 0; i < months; i++) {
            futureValue += monthly * Math.pow(1 + monthlyRate, months - i);
        }

        totalInvestment += monthly * 12;
        const yearlyReturn = futureValue - totalInvestment;
        data.push([year, formatNumberWithCommas(totalInvestment.toFixed(2)), formatNumberWithCommas(yearlyReturn.toFixed(2)), formatNumberWithCommas(futureValue.toFixed(2))]);
    }

    return data;
}

function generateMonthlyBreakdown(years, lumpsum, monthly, rate) {
    const data = [];
    let totalInvestment = lumpsum;
    let futureValue = lumpsum;
    const monthlyRate = rate / 12 / 100;

    for (let month = 1; month <= years * 12; month++) {
        futureValue = lumpsum * Math.pow(1 + monthlyRate, month);

        for (let i = 0; i < month; i++) {
            futureValue += monthly * Math.pow(1 + monthlyRate, month - i);
        }

        totalInvestment += monthly;
        const monthlyReturn = futureValue - totalInvestment;
        data.push([month, formatNumberWithCommas(totalInvestment.toFixed(2)), formatNumberWithCommas(monthlyReturn.toFixed(2)), formatNumberWithCommas(futureValue.toFixed(2))]);
    }

    return data;
}




document.addEventListener('DOMContentLoaded', function () {
    calculateSIP();
});
