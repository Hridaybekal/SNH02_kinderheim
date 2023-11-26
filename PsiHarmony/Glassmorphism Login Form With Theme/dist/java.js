// Dummy data for demonstration
const heartRateData = [80, 85, 78, 92, 88, 95, 90];
const stepsData = [1000, 1500, 2000, 2500, 3000, 3500, 4000];
const sleepData = [7, 6, 8, 7.5, 6.5, 8, 7];
const spo2Data = [98, 97, 99, 98, 96, 97, 98];
const caloriesData = [200, 300, 250, 350, 400, 320, 300];

// Function to create a line chart
function createLineChart(canvasId, data, label) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: data.length }, (_, i) => i + 1),
            datasets: [{
                label: label,
                data: data,
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 2,
                fill: false,
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom'
                },
                y: {
                    min: 60
                }
            }
        }
    });
}

// Function to create a bar chart
function createBarChart(canvasId, data, label) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.from({ length: data.length }, (_, i) => i + 1),
            datasets: [{
                label: label,
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    min: 0
                }
            }
        }
    });
}

// Update the total steps on the steps board
function updateTotalSteps() {
    const totalStepsElement = document.getElementById('totalSteps');
    const totalSteps = stepsData.reduce((acc, steps) => acc + steps, 0);
    totalStepsElement.textContent = totalSteps;
}

// Update the total calories on the calories board
function updateTotalCalories() {
    const totalCaloriesElement = document.getElementById('totalCalories');
    const totalCalories = caloriesData.reduce((acc, calories) => acc + calories, 0);
    totalCaloriesElement.textContent = totalCalories;
}

// Create charts on page load
document.addEventListener('DOMContentLoaded', () => {
    createLineChart('heartRateChart', heartRateData, 'Heart Rate');
    createBarChart('sleepChart', sleepData, 'Hours of Sleep');
    createBarChart('spo2Chart', spo2Data, 'SpO2 Level');
    updateTotalSteps();
    updateTotalCalories();
});

// Smooth scroll to sections when clicking on navigation links
document.querySelectorAll('.horizontal-nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
