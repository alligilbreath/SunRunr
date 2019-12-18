$(function(){
     $('#registerDevice').click(function(){
         $('#email').text("Don't know");
         $('#fullName').text("Don't care");
         $('#lastAccess').text("Don't wanna be there");
     });
    
    // Sample from canvasJS website
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    
    var data = [{y: 500}, {y: 450}, {y: 400}, {y: 350}, {y: 300}];
    
    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "light2",
        title:{
            text: "Speed During Activity"
        },
        axisY:{
            title: "Speed (mph)", 
            includeZero: false
        },
        axisX:{
            title: "Time (min)"
        },
        data: [{        
            type: "line",       
            dataPoints: [
                { y: 450 },
                { y: 414},
                { y: 520, indexLabel: "highest",markerColor: "red", markerType: "triangle" },
                { y: 460 },
                { y: 450 },
                { y: 500 },
                { y: 480 },
                { y: 480 },
                { y: 410 , indexLabel: "lowest",markerColor: "DarkSlateGrey", markerType: "cross" },
                { y: 500 },
                { y: 480 },
                { y: 510 }
            ]
        }]
    });
    chart.render();

    var chart2 = new CanvasJS.Chart("chartContainer2", {
        animationEnabled: true,
        theme: "light2",
        title:{
            text: "UV Exposure During Activity"
        },
        axisY:{
            title: "UV", 
            includeZero: false
        },
        axisX:{
            title: "Time (min)"
        },
        data: [{        
            type: "line",       
            dataPoints: data
        }]
    });
    chart2.render();
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    


    
    
    
    $('.collapsible').collapsible();


});