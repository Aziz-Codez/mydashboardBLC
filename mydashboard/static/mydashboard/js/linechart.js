document.addEventListener('DOMContentLoaded', function() {
    fetchPowerData();
    setInterval(fetchPowerData, 60000); // Fetch data every 60 seconds
});

var powerData = [];
var timestamps = [];
var powerChart;

function fetchPowerData() {
    console.log("fetchPowerData called");
    fetch("http://10.150.1.167:8002/prom/snmp/cur")
    .then(response => response.json())
    .then(data => {
        console.log("Data from API:", data);
        powerData.push(data.power);
        timestamps.push(new Date());
        if (powerChart) {
            updatePowerChart(powerData, timestamps);
        } else {
            drawPowerLineChart(powerData, timestamps);
        }
    })
    .catch(error => console.error("Error fetching data:", error));
}

function drawPowerLineChart(powerData, timestamps) {
    var ctx = document.getElementById('power-graph').getContext('2d');
    powerChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timestamps.map(timestamp => timestamp.toLocaleTimeString()),
            datasets: [{
                label: 'Power',
                data: powerData,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Power'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Power Line Chart'
                }
            },
            maintainAspectRatio: false
        }
    });
}

function updatePowerChart(powerData, timestamps) {
    powerChart.data.labels = timestamps.map(timestamp => timestamp.toLocaleTimeString());
    powerChart.data.datasets.forEach((dataset) => {
        dataset.data = powerData;
    });
    powerChart.update();
}
