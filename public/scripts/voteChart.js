const labels = ['Baby','Bob'];
const data = {
    labels: ['Baby1','Baby2'],
    datasets: [
        {
            barThickness: 100,
            maxBarThickness: 400,
            minBarLength: 0,
            data: [100,300],
            backgroundColor: [ 'rgb(213, 126, 126)', 'rgb(198, 213, 126)'],
            borderColor: ['rgb(213, 126, 126)', 'rgb(198, 213, 126)'],
        }

    ]
};

var img1 = new Image(100, 100);
img1.src = '/images/cat.png';

const barAvatar = {
    id: 'barAvatar',
    beforeDraw(chart, args, options){
        const {ctx, chartArea: {top, bottom, left, right, width, height},
        scales: {x,y}} = chart;
        ctx.save();
        // console.log('hi');
        // console.log(y.getPixelForValue(100));
        ctx.drawImage(img1, x.getPixelForValue(0) - (100/2), y.getPixelForValue(100) - 110, 100, 100);
        ctx.drawImage(img1, x.getPixelForValue(1) - (100/2), y.getPixelForValue(300) - 110, 100, 100);
    }
}

const config = {
    type: 'bar',
    data,
    plugins: [ChartDataLabels,barAvatar],
        options: {
            plugins: {
                legend: {
                    display: false
                },
                datalabels: {
                    color: 'black',
                    anchor: 'end',
                    align: 'top',
                    font: {
                        weight: 'bold',
                        size: 20
                    },
                },

            },
            reponsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    display: false,
                    suggestedMin: 0,
                    suggestedMax: 500
                },
                x: {
                    beginAtZero: true,
                    grid: {
                        display: false
                    },
                }
            },
        },
};

var myChart = new Chart(
    document.getElementById('myChart'),
    config
);