document.addEventListener('DOMContentLoaded', function() {
    fetchPowerData();
    setInterval(fetchPowerData, 60000); // Her 60 saniyede bir veri çek
});

var powerData = [];
var timestamps = [];
var powerChart;

function fetchPowerData() {
    console.log("fetchPowerData çağrıldı");
    fetch("http://10.150.1.167:8002/prom/snmp/cur")
    .then(response => response.json())
    .then(data => {
        console.log("API'den gelen veri:", data);
        powerData.push(data.power); // 'power' değerini diziye ekle
        timestamps.push(new Date()); // Şu anki zamanı diziye ekle
        if (powerChart) {
            console.log("API'den gelen veri:", data.power);
            updatePowerChart(powerData, timestamps);
        } else {
            drawPowerBarChart(powerData, timestamps);
        }
    })
    .catch(error => console.error("Veri çekme sırasında hata oluştu:", error));
}

function drawPowerBarChart(powerData, timestamps) {
    var ctx = document.getElementById('power-graph').getContext('2d');
    powerChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: timestamps.map(timestamp => timestamp.toLocaleTimeString()),
            datasets: [{
                label: 'Power',
                data: powerData,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
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
                    text: 'Power Bar Chart'
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
