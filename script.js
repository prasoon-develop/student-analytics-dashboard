let allStudents = [];

let performanceChart;
let pieChart;
let subjectAverageChart;

async function loadDashboard() {

try {

    const response = await fetch("data.json");

    allStudents = await response.json();

    renderDashboard(allStudents);

    document
        .getElementById("searchInput")
        .addEventListener("input", filterStudents);

    document
        .getElementById("subjectFilter")
        .addEventListener("change", filterStudents);

}

catch (error) {

    console.error(error);

}

}

function filterStudents() {

const searchText =
    document
    .getElementById("searchInput")
    .value
    .toLowerCase();

const filteredStudents = allStudents.filter(student =>
    student.name.toLowerCase().includes(searchText)
);

renderDashboard(filteredStudents);

}

function renderDashboard(data) {

calculateAverages(data);

renderStats(data);

renderPerformanceChart(data);

renderPieChart(data);

renderSubjectAverageChart(data);

renderRanking(data);

renderRiskAlert(data);

}

function calculateAverages(data) {

data.forEach(student => {

    student.average = (

        student.math +
        student.science +
        student.english +
        student.hindi

    ) / 4;

});

}

function renderStats(data) {

let totalAverage = 0;

let passCount = 0;

data.forEach(student => {

    totalAverage += student.average;

    if (student.average >= 40) {

        passCount++;

    }

});

const sorted =
    [...data]
    .sort((a, b) => b.average - a.average);

const topStudent = sorted[0];

const lowestStudent = sorted[sorted.length - 1];

const classAverage =
    (totalAverage / data.length).toFixed(1);

const passPercentage =
    ((passCount / data.length) * 100).toFixed(0);

document.getElementById("statsContainer").innerHTML = `
<div class="stats-grid">
    <div class="card">
        <h2>${data.length}</h2>
        <p>Total Students</p>
    </div>

    <div class="card">
        <h2>${classAverage}</h2>
        <p>Class Average</p>
    </div>

    <div class="card top-card">
        <h2>${topStudent.name}</h2>
        <p>Top Performer</p>
    </div>

    <div class="card low-card">
        <h2>${lowestStudent.name}</h2>
        <p>Needs Improvement</p>
    </div>

    <div class="card pass-card">
        <h2>${passPercentage}%</h2>
        <p>Pass Percentage</p>
    </div>

    <div class="card">
        <h2>${topStudent.average.toFixed(1)}</h2>
        <p>Highest Average</p>
    </div>
</div>
`;

}

function renderPerformanceChart(data) {

const selectedSubject =
    document.getElementById("subjectFilter").value;

const labels =
    data.map(student => student.name);

let datasets = [];

if (selectedSubject === "all") {

    datasets = [

        {
            label: "Math",
            data: data.map(student => student.math)
        },

        {
            label: "Science",
            data: data.map(student => student.science)
        },

        {
            label: "English",
            data: data.map(student => student.english)
        },

        {
            label: "Hindi",
            data: data.map(student => student.hindi)
        }

    ];

}

else {

    datasets = [

        {
            label: selectedSubject.toUpperCase(),
            data: data.map(student => student[selectedSubject])
        }

    ];

}

if (performanceChart) {

    performanceChart.destroy();

}

performanceChart = new Chart(

    document.getElementById("performanceChart"),

    {

        type: "bar",

        data: {

            labels: labels,

            datasets: datasets

        },

        options: {

            responsive: true,

            scales: {

                y: {

                    beginAtZero: true,

                    max: 100

                }

            }

        }

    }

);

}

function renderPieChart(data) {

let excellent = 0;
let average = 0;
let support = 0;

data.forEach(student => {

    if (student.average >= 85) {

        excellent++;

    }

    else if (student.average >= 70) {

        average++;

    }

    else {

        support++;

    }

});

if (pieChart) {

    pieChart.destroy();

}

pieChart = new Chart(

    document.getElementById("performancePieChart"),

    {

        type: "pie",

        data: {

            labels: [

                "Excellent",
                "Average",
                "Needs Support"

            ],

            datasets: [

                {

                    data: [

                        excellent,
                        average,
                        support

                    ]

                }

            ]

        }

    }

);

}

function renderSubjectAverageChart(data) {

const mathAverage =
    (
        data.reduce((sum, s) => sum + s.math, 0)
        / data.length
    ).toFixed(1);

const scienceAverage =
    (
        data.reduce((sum, s) => sum + s.science, 0)
        / data.length
    ).toFixed(1);

const englishAverage =
    (
        data.reduce((sum, s) => sum + s.english, 0)
        / data.length
    ).toFixed(1);

const hindiAverage =
    (
        data.reduce((sum, s) => sum + s.hindi, 0)
        / data.length
    ).toFixed(1);

if (subjectAverageChart) {

    subjectAverageChart.destroy();

}

subjectAverageChart = new Chart(

    document.getElementById("subjectAverageChart"),

    {

        type: "bar",

        data: {

            labels: [

                "Math",
                "Science",
                "English",
                "Hindi"

            ],

            datasets: [

                {

                    label: "Subject Average",

                    data: [

                        mathAverage,
                        scienceAverage,
                        englishAverage,
                        hindiAverage

                    ]

                }

            ]

        },

        options: {

            responsive: true,

            scales: {

                y: {

                    beginAtZero: true,

                    max: 100

                }

            }

        }

    }

);

}

function renderRanking(data) {

const sorted =
    [...data]
    .sort((a, b) => b.average - a.average);

let rows = "";

sorted.forEach((student, index) => {

    rows += `

    <tr>

        <td>${index + 1}</td>

        <td>${student.name}</td>

        <td>${student.average.toFixed(1)}</td>

    </tr>

    `;

});

document.getElementById("rankingContainer").innerHTML = `

<h2>🏆 Student Rankings</h2>

<table>

    <tr>

        <th>Rank</th>

        <th>Name</th>

        <th>Average</th>

    </tr>

    ${rows}

</table>

`;

}

function renderRiskAlert(data) {


const riskStudents =
    data.filter(student => student.average < 75);

if (riskStudents.length === 0) {

    document.getElementById("alertContainer").innerHTML = "";

    return;

}

const names =
    riskStudents
    .map(student => student.name)
    .join(", ");

document.getElementById("alertContainer").innerHTML = `

<div class="risk-alert">

    ⚠ Students Requiring Academic Support:
    ${names}

</div>

`;

}

loadDashboard();
