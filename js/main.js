// constants for plot design
const FRAME_HEIGHT = 450;
const FRAME_WIDTH = 900; 
const MARGINS = {left: 50, right: 50, top: 25, bottom: 25};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 


// creation function
function build_plots() {

  // reading in the data
  d3.csv("data/NoNullsData.csv", 
  function(d){
    return { DATE : d3.timeParse("%-m/%-d/%Y")(d.DATE), 
            Payrolls : +d.Payrolls,
            CPI : +d.CPI,
            UClaims : +d.UClaims,
            PPI : +d.PPI,
            URate : +d.URate}
  }

  ).then((data) => {

    // printing the first 10 lines of the data
    console.log("First 10 Lines of the Data:");
    console.log(data.slice(0, 10));

    // getting max values for indicators 
    const MaxPayroll = d3.max(data, (d) => { return d.Payrolls; });
   
    const MaxCPI = d3.max(data, (d) => { return d.CPI; });
    
    const MaxPPI = d3.max(data, (d) => { return d.PPI; });
  
    const MaxURate = d3.max(data, (d) => { return d.URate; });
    
    const MaxUClaims = d3.max(data, (d) => { return d.UClaims; });
    

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
                        .attr("class", "payrollline"); 

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
        .call(d3.axisLeft(MainYScale).ticks(4).tickFormat(function(d) {
            return (d * 100) + "%"}))
          .attr("font-size", '10px'); 

    // add a tooltip to the visualization
    const TOOLTIP = d3.select("#mainvis")
                        .append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0);


    const dateFormat = d3.timeFormat("%-m/%-d/%Y");
                        
    function mouseMove(event, d) {
        let current_class = this.classList;
        let date = dateFormat(MainXScale.invert(event.pageX, event.pageY));
        let value = Math.abs(MainYScale.invert(event.pageX - MARGINS.top, event.pageY));
      
        console.log(d3.format(".2%")(value));

        TOOLTIP.html("Metric: " + current_class + "</br>" + "Date: " + date + "</br>" + "Value: " + d3.format(".2%")(value))
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 50) + "px");
    };


    function mouseOver(event, d) {
        TOOLTIP.style("opacity", 100);
        
    };


    function mouseLeave(event, d) {
        TOOLTIP.style("opacity", 0);
        
    };


    MAIN.selectAll(".claimsline")
        .on("mouseover", mouseOver)
        .on("mousemove", mouseMove)
        .on("mouseleave", mouseLeave);

    MAIN.selectAll(".cpiline")
        .on("mouseover", mouseOver)
        .on("mousemove", mouseMove)
        .on("mouseleave", mouseLeave);

    MAIN.selectAll(".ppiline")
        .on("mouseover", mouseOver)
        .on("mousemove", mouseMove)
        .on("mouseleave", mouseLeave);

    MAIN.selectAll(".urateline")
        .on("mouseover", mouseOver)
        .on("mousemove", mouseMove)
        .on("mouseleave", mouseLeave);

    MAIN.selectAll(".payrollline")
        .on("mouseover", mouseOver)
        .on("mousemove", mouseMove)
        .on("mouseleave", mouseLeave);
  });

};

build_plots()


//global constant for detail vis info box
//constants for indicator header
const indicator_text_cpi = "CPI"
const indicator_text_ppi = "PPI"
const indicator_text_urate = "Unemployment Rate"
const indicator_text_uclaims = "Unemployment Claims"
const indicator_text_payrolls = "Payrolls"

//constants for the indicator information
const indicator_info_text_cpi = "The Consumer Price Index is a price index of a basket of goods and services paid by consumers. Percent changes in the price index measure the inflation rate between any two time periods. The most common inflation metric is the percent change from one year ago. It can also represent the buying habits of consumers. CPIs are based on prices for food, clothing, shelter, and fuels; transportation fares; and sales taxes. CPI can be used to recognize periods of inflation and deflation. Significant increases in the CPI within a short time frame might indicate a period of inflation, and significant decreases in CPI within a short time frame might indicate a period of deflation."
const indicator_info_text_ppi = "The Producer Price Index is a family of indexes that measures the average change over time in selling prices received by domestic producers of goods and services from the perspective of the seller. There are three main PPI classification structures: industry classification (a measure of changes in industry's net), commodity classification (organizes products and services by similarity or material composition, regardless of the industry classification), and Commodity-based Final Demand-Intermediate Demand (FD-ID) System (Commodity-based FD-ID price indexes regroup commodity indexes according to the type of buyer and the amount of physical processing the products have undergone)."
const indicator_info_text_urate = "The unemployment rate represents the number of unemployed as a percentage of the labor force. Labor force data are restricted to people 16 years of age and older, who currently reside in 1 of the 50 states or the District of Columbia, who do not reside in institutions (e.g., penal and mental facilities, homes for the aged), and who are not on active duty in the Armed Forces. This rate is also defined as the U-3 measure of labor underutilization."
const indicator_info_text_uclaims = "An initial claim is a claim filed by an unemployed individual after a separation from an employer. The claim requests a determination of basic eligibility for the Unemployment Insurance program."
const indicator_info_text_payrolls = "All Employees: Total Nonfarm, commonly known as Total Nonfarm Payroll, is a measure of the number of U.S. workers in the economy that excludes proprietors, private household employees, unpaid volunteers, farm employees, and the unincorporated self-employed. This measure accounts for approximately 80 percent of the workers who contribute to Gross Domestic Product (GDP). This measure provides useful insights into the current economic situation because it can represent the number of jobs added or lost in an economy. Increases in employment might indicate that businesses are hiring which might also suggest that businesses are growing. "

function detail_vis(index) {
  // reading in the data
  d3.csv("data/NoNullsData.csv", 
  function(d){
    return { DATE : d3.timeParse("%-m/%-d/%Y")(d.DATE), 
            Payrolls : +d.Payrolls,
            CPI : +d.CPI,
            UClaims : +d.UClaims,
            PPI : +d.PPI,
            URate : +d.URate}
  }
  ).then((data) => {

    // getting max values for indicators 
    const MaxPayroll = d3.max(data, (d) => { return d.Payrolls; });
    const MaxCPI = d3.max(data, (d) => { return d.CPI; });
    const MaxPPI = d3.max(data, (d) => { return d.PPI; });
    const MaxURate = d3.max(data, (d) => { return d.URate; });
    const MaxUClaims = d3.max(data, (d) => { return d.UClaims; });
    
    //getting dates and date range
    const dates = [];
    for (let obj of data) {
      dates.push(obj.DATE)
    }
    const domain = d3.extent(data, (d) => d.DATE);

    // constants for plot design
    const DETAIL_FRAME_HEIGHT = 275;
    const DETAIL_FRAME_WIDTH = 550; 
    const DETAIL_MARGINS = {left: 55, right: 50, top: 25, bottom: 25};

    const DETAIL_VIS_HEIGHT = DETAIL_FRAME_HEIGHT - DETAIL_MARGINS.top - DETAIL_MARGINS.bottom;
    const DETAIL_VIS_WIDTH = DETAIL_FRAME_WIDTH - DETAIL_MARGINS.left - DETAIL_MARGINS.right; 

    // setting x scale and axis (used regardless of indicator)
    const DetailXScale = d3.scaleTime() 
                      .domain(domain) 
                      .range([0, DETAIL_VIS_WIDTH]); 

    // setting constants for each indicator
    const PayrollYScale = d3.scaleLinear() 
                      .domain([MaxPayroll, 0])  
                      .range([0, DETAIL_VIS_HEIGHT]); 
    
    const URateYScale = d3.scaleLinear() 
                      .domain([MaxURate, 0])  
                      .range([0, DETAIL_VIS_HEIGHT]); 
                      
    const UClaimsYScale = d3.scaleLinear() 
                      .domain([MaxUClaims, 0])  
                      .range([0, DETAIL_VIS_HEIGHT]); 
    
    const PPIYScale = d3.scaleLinear() 
                      .domain([MaxPPI, 0])  
                      .range([0, DETAIL_VIS_HEIGHT]); 

    const CPIYScale = d3.scaleLinear() 
                      .domain([MaxCPI, 0])  
                      .range([0, DETAIL_VIS_HEIGHT]); 

    //adding svg
    const DETAIL = d3.select("#detailgraph")
                    .append("svg")
                      .attr("id", "detail")
                      .attr("height", DETAIL_FRAME_HEIGHT)
                      .attr("width", DETAIL_FRAME_WIDTH)
                      .attr("class", "frame"); 

    // adding x axis
    DETAIL.append("g") 
       .attr("transform", "translate(" + DETAIL_MARGINS.left + 
         "," + (DETAIL_VIS_HEIGHT + DETAIL_MARGINS.top) + ")") 
       .call(d3.axisBottom(DetailXScale).ticks(8)) 
       .attr("font-size", '10px'); 

    // check for payroll, plot if true
    if (index == 0) {
      const DETAIL_LINE = DETAIL.append('path')
                                 .datum(data)
                                 .attr("d", d3.line()
                                     .x((d) => {return DETAIL_MARGINS.left + DetailXScale(d.DATE)})
                                     .y((d) => {return PayrollYScale(d.Payrolls) + DETAIL_MARGINS.top}))
                                 .attr("class", "payrollline"); 

      // Add y axis to vis  
      const DETAIL_Y_AXIS = DETAIL.append("g") 
                            .attr("transform", "translate(" + DETAIL_MARGINS.left + 
                              "," + (DETAIL_MARGINS.top) + ")") 
                            .call(d3.axisLeft(PayrollYScale).ticks(4))
                            .attr("font-size", '10px'); 
    }

    // check for urate, plot if true
    if (index == 1) {
      const DETAIL_LINE = DETAIL.append('path')
                                 .datum(data)
                                 .attr("d", d3.line()
                                     .x((d) => {return DETAIL_MARGINS.left + DetailXScale(d.DATE)})
                                     .y((d) => {return URateYScale(d.URate) + DETAIL_MARGINS.top}))
                                 .attr("class", "urateline"); 

      // Add y axis to vis  
      const DETAIL_Y_AXIS = DETAIL.append("g") 
                            .attr("transform", "translate(" + DETAIL_MARGINS.left + 
                              "," + (DETAIL_MARGINS.top) + ")") 
                            .call(d3.axisLeft(URateYScale).ticks(4))
                            .attr("font-size", '10px'); 
    }
    // check for cpi, plot if true
    if (index == 2) {
      const DETAIL_LINE = DETAIL.append('path')
                                 .datum(data)
                                 .attr("d", d3.line()
                                     .x((d) => {return DETAIL_MARGINS.left + DetailXScale(d.DATE)})
                                     .y((d) => {return CPIYScale(d.CPI) + DETAIL_MARGINS.top}))
                                 .attr("class", "cpiline"); 

      // Add y axis to vis  
      const DETAIL_Y_AXIS = DETAIL.append("g") 
                            .attr("transform", "translate(" + DETAIL_MARGINS.left + 
                              "," + (DETAIL_MARGINS.top) + ")") 
                            .call(d3.axisLeft(CPIYScale).ticks(4))
                            .attr("font-size", '10px'); 
    }
    // check for ppi, plot if true
    if (index == 3) {
      const DETAIL_LINE = DETAIL.append('path')
                                 .datum(data)
                                 .attr("d", d3.line()
                                     .x((d) => {return DETAIL_MARGINS.left + DetailXScale(d.DATE)})
                                     .y((d) => {return PPIYScale(d.PPI) + DETAIL_MARGINS.top}))
                                 .attr("class", "ppiline"); 

      // Add y axis to vis  
      const DETAIL_Y_AXIS = DETAIL.append("g") 
                            .attr("transform", "translate(" + DETAIL_MARGINS.left + 
                              "," + (DETAIL_MARGINS.top) + ")") 
                            .call(d3.axisLeft(PPIYScale).ticks(4))
                            .attr("font-size", '10px'); 
    }
    // check for uclaims, plot if true
    if (index == 4) {
      const DETAIL_LINE = DETAIL.append('path')
                                 .datum(data)
                                 .attr("d", d3.line()
                                     .x((d) => {return DETAIL_MARGINS.left + DetailXScale(d.DATE)})
                                     .y((d) => {return UClaimsYScale(d.UClaims) + DETAIL_MARGINS.top}))
                                 .attr("class", "claimsline"); 

      // Add y axis to vis  
      const DETAIL_Y_AXIS = DETAIL.append("g") 
                            .attr("transform", "translate(" + DETAIL_MARGINS.left + 
                              "," + (DETAIL_MARGINS.top) + ")") 
                            .call(d3.axisLeft(UClaimsYScale).ticks(4))
                            .attr("font-size", '10px'); 
    }
  });
};

// initialize detailvis with payrolls information
function initial_detail() {
  document.getElementById('indicatorinfotext').innerHTML = indicator_info_text_payrolls;

  detail_vis(0);
};

initial_detail();

// getting information from the change of the dropdown
function submitClicked() {
  // getting selected x value from drop down
  let indicator = document.getElementById("indicators");
  let selected_ind = indicator.options[indicator.selectedIndex].value;
  let selected_index = indicator.selectedIndex;

  update_detail(selected_index);

  d3.selectAll("#detailgraph > *").remove(); 
  
  detail_vis(selected_index);
}

// altering the detailtextbox
function update_detail(x) {

  // checking the given index and altering the contents of detailtextbox 
  if (x == 1) {
    document.getElementById('indicatorinfotext').innerHTML = indicator_info_text_urate;
  } 
  
  if (x == 2) {
    document.getElementById('indicatorinfotext').innerHTML = indicator_info_text_cpi;
  } 
  
  if (x == 3) {
    document.getElementById('indicatorinfotext').innerHTML = indicator_info_text_ppi;
  } 
  
  if (x == 4) {
    document.getElementById('indicatorinfotext').innerHTML = indicator_info_text_uclaims;
  } 
  
  if (x == 0) {
    document.getElementById('indicatorinfotext').innerHTML = indicator_info_text_payrolls;
  }

}

// Add event handler to button 
document.getElementById('selectedindicator').addEventListener('change', submitClicked);