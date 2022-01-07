const labels = ['Baby','Bob'];
const data = {
    labels: labels,
    datasets: [
        // {
        //     label: 'Baby',
        //     backgroundColor: 'rgb(213, 126, 126)',
        //     borderColor: 'rgb(213, 126, 126)',
        //     data: [100],
        // },
        // {
        //     label: 'Bob',
        //     backgroundColor: 'rgb(198, 213, 126)',
        //     borderColor: 'rgb(198, 213, 126)',
        //     data: [150],
        // },
        {
        barThickness: 100,
        maxBarThickness: 200,
        minBarLength: 20,
        data: [100,150],
        backgroundColor: [ 'rgb(213, 126, 126)', 'rgb(198, 213, 126)'],
        borderColor: ['rgb(213, 126, 126)', 'rgb(198, 213, 126)']
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
        console.log(y.getPixelForValue(100));
        ctx.drawImage(img1, x.getPixelForValue(0) - (100/2), y.getPixelForValue(100) - 100, 100, 100);
        ctx.drawImage(img1, x.getPixelForValue(1) - (100/2), y.getPixelForValue(150) - 100, 100, 100);
    }
}

const config = {
    type: 'bar',
    data,
    options: {
        //indexAxis: 'y',
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                // grid: {
                //     display: false
                // },
                display: false,
                suggestedMin: 0,
                suggestedMax: 200
            },
            x: {
                beginAtZero: true,
                grid: {
                    display: false
                },
                // display: false
            }
        },
        plugins: { 
            legend: { 
                display: false ,
            },
            title: {
                display: true,
                text: 'Baby vs Baby',
                font: {
                    size: 20
                }
            },
            
        },
        
    },
    plugins: [barAvatar]
};

var myChart = new Chart(
    document.getElementById('myChart'),
    config
);
// var myImage = new Image(100, 200);
// myImage.src = '/images/book.png';
// document.getElementById("testpic").appendChild(myImage); 