// constants for plot design
const FRAME_HEIGHT = 450;
const FRAME_WIDTH = 650; 
const MARGINS = {left: 25, right: 25, top: 25, bottom: 25};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 


// creation function
function build_plots() {

  // reading in the data
  d3.csv("data/NoNullsData.csv", 
  function(d){
    return { DATE : d3.timeParse("%-m/%-e/%Y")(d.DATE), 
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

    const dates = [];
    for (let obj of data) {
      dates.push(obj.DATE)
    }

    const domain = d3.extent(data, (d) => d.DATE);

    //setting scales
    const MainXScale = d3.scaleTime() 
                      .domain(domain) 
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

    // plot payroll counts
    const payrolls = MAIN.append('path')
                        .datum(data) // passed from .then  
                        .attr("d", d3.line()
                            .x((d) => {return MARGINS.left + MainXScale(d.DATE)})
                            .y((d) => {return MainYScale(d.Payrolls/MaxPayroll) + MARGINS.top}))
                        .attr("class", "payrollline data-point"); 

    // plot unemployment rate
    const unemployment = MAIN.append('path')
                        .datum(data) // passed from .then  
                        .attr("d", d3.line()
                            .x((d) => {return MARGINS.left + MainXScale(d.DATE)})
                            .y((d) => {return MainYScale(d.URate/MaxURate) + MARGINS.top}))
                        .attr("class", "urateline"); 
    
    // plot PPI
    const ppi = MAIN.append('path')
                        .datum(data) // passed from .then  
                        .attr("d", d3.line()
                            .x((d) => {return MARGINS.left + MainXScale(d.DATE)})
                            .y((d) => {return MainYScale(d.PPI/MaxPPI) + MARGINS.top}))
                        .attr("class", "ppiline"); 

    // plot CPI
    const cpi = MAIN.append('path')
                        .datum(data) // passed from .then  
                        .attr("d", d3.line()
                            .x((d) => {return MARGINS.left + MainXScale(d.DATE)})
                            .y((d) => {return MainYScale(d.CPI/MaxCPI) + MARGINS.top}))
                        .attr("class", "cpiline");

     // plot claims
     const claims = MAIN.append('path')
                        .datum(data) // passed from .then  
                        .attr("d", d3.line()
                            .x((d) => {return MARGINS.left + MainXScale(d.DATE)})
                            .y((d) => {return MainYScale(d.UClaims/MaxUClaims) + MARGINS.top}))
                        .attr("class", "claimsline");
                        
    // Add x axis to vis  
    MAIN.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
              "," + (VIS_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(MainXScale).ticks(8)) 
          .attr("font-size", '10px'); 

    // Add y axis to vis  
    MAIN.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
              "," + (MARGINS.top) + ")") 
        .call(d3.axisLeft(MainYScale).ticks(4)) 
          .attr("font-size", '10px'); 

    // add a tooltip to the visualization
    const TOOLTIP = d3.select("#mainvis")
                        .append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0);

    function mouseMove(event, d) {
        TOOLTIP.html("tooltip test")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 50) + "py");
    };

    function barMouseOver(event, d) {
        TOOLTIP.style("opacity", 1);
    };


    function mouseLeave(event, d) {
        TOOLTIP.style("opacity", 0);
    };


    MAIN.selectAll(".path")
        .on("mouseOver", barMouseOver)
        .on("mousemove", mouseMove)
        .on("mouseLeave", mouseLeave);

  });

};

build_plots()
