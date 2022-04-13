var img1 = new Image(100, 100);
var img2 = new Image(100, 100);
img1.src = '/images/cat.png';
img2.src = '/images/dog.png';
let imgList = []
imgList.push(img1);
imgList.push(img2);



var voteCount = []; // Number of people who already voted.
var candidateName = [];
var voteInfo; 

/* ---------start chartjs setup--------- */
var data = {
    labels: candidateName,
    datasets: [
        {
            barThickness: 100,
            maxBarThickness: 400,
            minBarLength: 0,
            data: voteCount,
            backgroundColor: [ 'rgb(213, 126, 126)', 'rgb(198, 213, 126)'],
            borderColor: ['rgb(213, 126, 126)', 'rgb(198, 213, 126)'],
        }

    ]
};
//draw image on top of the chart
const barAvatar = {
    id: 'barAvatar',
    beforeDraw(chart, args, options){
        const {ctx, chartArea: {top, bottom, left, right, width, height},
        scales: {x,y}} = chart;
        ctx.save();
        //drawImage(img,x,y,width,heigh)
        let count = 0;
        for(var i = 0 ; i < voteCount.length; i++){
            if(count == 0){
                ctx.drawImage(img1, x.getPixelForValue(i) - (100/2), y.getPixelForValue(voteCount[i]) - 115, 100, 100);
                count++;
            }else{
                ctx.drawImage(img2, x.getPixelForValue(i) - (100/2), y.getPixelForValue(voteCount[i]) - 115, 100, 100);
                count = 0;
            }
        }
        // ctx.drawImage(img1, x.getPixelForValue(i) - (100/2), y.getPixelForValue(voteCount[0]) - 115, 100, 100);
        // ctx.drawImage(img2, x.getPixelForValue(i) - (100/2), y.getPixelForValue(voteCount[1]) - 115, 100, 100);

    }
}
//config chartjs
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
                    suggestedMax: Math.max(voteCount)+200
                },
                x: {
                    beginAtZero: true,
                    grid: {
                        display: false
                    },
                }
            },
        }
}
/* ---------End create setup--------- */
function createChart(){
    var myChart = new Chart(
        document.getElementById('myChart'),
        config
    );
}


async function getVoteInfo(){
    var response = await axios.get('/vote-info');
    if(response.error){
        console.log(response.data);
    }
    for(i in response.data.data){
        voteCount.push(response.data.data[i].Number_vote);
        candidateName.push(response.data.data[i].fullname);
    }
    voteInfo = response;
    createChart()
}
getVoteInfo();
console.log(imgList);


