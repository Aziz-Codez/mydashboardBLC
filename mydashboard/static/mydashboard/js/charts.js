document.addEventListener('DOMContentLoaded', function() {
    fetchPowerData();
    setInterval(fetchPowerData, 60000); // Fetch data every 60 seconds
});

var powerData = [];
var powerChart;
var powerBarChart;

function fetchPowerData() {
    console.log("fetchPowerData called");
    fetch("http://10.150.1.167:8002/prom/snmp/cur")
    .then(response => response.json())
    .then(data => {
        console.log("Data from API:", data);
        powerData = [data.power, getRandomValue(), getRandomValue(), getRandomValue()];

        if (powerChart) {
            updatePowerChart(powerData);
        } else {
            drawPowerPieChart(powerData);
        }

        if (powerBarChart) {
            updatePowerBarChart(data.power);
        } else {
            drawPowerBarChart(data.power);
        }
    })
    .catch(error => console.error("Error fetching data:", error));
}

function getRandomValue() {
    return Math.floor(Math.random() * 100);
}

function drawPowerPieChart(powerData) {
    var ctxPie = document.getElementById('power-graph').getContext('2d');
    powerChart = new Chart(ctxPie, {
        type: 'pie',
        data: {
            labels: ['Power', 'Random 1', 'Random 2', 'Random 3'],
            datasets: [{
                data: powerData,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Power Pie Chart'
                }
            }
        }
    });
}

function updatePowerChart(powerData) {
    powerChart.data.datasets.forEach((dataset) => {
        dataset.data = powerData;
    });
    powerChart.update();
}

function drawPowerBarChart(powerValue) {
    var ctxBar = document.getElementById('power-bar-graph').getContext('2d');
    powerBarChart = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: ['Power'],
            datasets: [{
                label: 'Power',
                data: [powerValue],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Power Bar Chart'
                }
            }
        }
    });
}

function updatePowerBarChart(powerValue) {
    powerBarChart.data.datasets.forEach((dataset) => {
        dataset.data = [powerValue];
    });
    powerBarChart.update();
}
