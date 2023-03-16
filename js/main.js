// constants for plot design
const FRAME_HEIGHT = 450;
const FRAME_WIDTH = 600; 
const MARGINS = {left: 25, right: 25, top: 25, bottom: 25};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 


// creation function
function build_plots() {

  // reading in the data
  d3.csv("data/4200ProjectData.csv", 
  function(d){
    return { DATE : d3.timeParse("%f/%e/%Y")(d.date), 
            Payrolls : d.Payrolls,
            CPI : d.CPI,
            UClaims : d.UClaims,
            PPI : d.PPI,
            URate : d.URate}
  }

  ).then((data) => {

    
    // getting max values for indicators 
    const MaxPayroll = d3.max(data, (d) => { return parseInt(d.Payrolls); });
    console.log(MaxPayroll)
    const MaxCPI = d3.max(data, (d) => { return parseInt(d.CPI); });
    console.log(MaxCPI)
    const MaxPPI = d3.max(data, (d) => { return parseInt(d.PPI); });
    console.log(MaxPPI)
    const MaxURate = d3.max(data, (d) => { return parseInt(d.URate); });
    console.log(MaxURate)
    const MaxUClaims = d3.max(data, (d) => { return parseInt(d.UClaims); });
    console.log(MaxUClaims)

    // first and last date
    const MaxDate = ((d) => {new Date(Math.max(d.DATE))});
    console.log(MaxDate)
    //d3.max(data, (d) => { return parseInt(d.DATE); });
    //const MinDate = d3.max(data, (d) => { return parseInt(d.DATE); });

    //setting scales
    const MainXScale = d3.scaleTime() 
                      .domain([MinDate, MaxDate]) 
                      .range([0, VIS_WIDTH]); 

    const MainYScale = d3.scaleLinear() 
                      .domain([1, 0])  
                      .range([0, VIS_HEIGHT]); 

    // setting up the graph
    const MAIN = d3.select("#mainvis")
                  .append("svg")
                    .attr("id", "length")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 

    // plot unemployment rate
    // plot points
    const unemployment = MAIN.append('path')
                        .datum(data) // passed from .then  
                        .attr("d", d3.line()
                            .x(function(d) {return MainXScale(d.DATE)})
                            .y(function(d) {return MainYScale(d.Payrolls/MaxPayroll)}))
                        .attr("class", "unemploymentline"); 

    // Add x axis to vis  
    MAIN.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
              "," + (VIS_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(MainXScale).ticks(4)) 
          .attr("font-size", '10px'); 

    // Add y axis to vis  
    MAIN.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
              "," + (MARGINS.top) + ")") 
        .call(d3.axisLeft(MainYScale).ticks(4)) 
          .attr("font-size", '10px'); 

  });

}

build_plots()
