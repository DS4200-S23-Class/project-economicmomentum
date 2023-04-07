// code for detail graph and info box

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
    const DETAIL_FRAME_HEIGHT = 375;
    const DETAIL_FRAME_WIDTH = 550; 
    const DETAIL_MARGINS = {left: 65, right: 25, top: 25, bottom: 25};

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
                                 .attr("class", "Payroll");

    // add a tooltip to the visualization
    const TOOLTIP = d3.select("#detailgraph")
                        .append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0);                           

    const dateFormat = d3.timeFormat("%-m/%-d/%Y");
                        
    function mouseMove(event, d) {
        let current_class = this.classList;
        let date = dateFormat(DetailXScale.invert(event.offsetX - DETAIL_MARGINS.left));
        let value = Math.abs(PayrollYScale.invert(event.offsetY - DETAIL_MARGINS.top));
      
        console.log(d3.format(".2%")(value));

        TOOLTIP.html("Date: " + date + "</br>" + "Value: " + d3.format(",.0f")(value))
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 50) + "px")
                .style("background-color", "gray");
    };


    function mouseOver(event, d) {
        TOOLTIP.style("opacity", 100);
    };


    function mouseLeave(event, d) {
        TOOLTIP.style("opacity", 0);
    };

    DETAIL.selectAll(".Payroll")
        .on("mouseover", mouseOver)
        .on("mousemove", mouseMove)
        .on("mouseleave", mouseLeave);
 

      // Add y axis to vis  
    const DETAIL_Y_AXIS = DETAIL.append("g") 
                            .attr("transform", "translate(" + DETAIL_MARGINS.left + 
                              "," + (DETAIL_MARGINS.top) + ")") 
                            .call(d3.axisLeft(PayrollYScale).ticks(4))
                            .attr("font-size", '10px'); 
     // Add y axis labels to vis  
    DETAIL_Y_AXIS.append("text")
        .attr("class", "y-axis-label")
        .attr("x", - DETAIL_VIS_HEIGHT / 2)
        .attr("y", - DETAIL_MARGINS.left / 2 - 20)
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text("Thousands of Persons");

    };

    

    // check for urate, plot if true
    if (index == 1) {
      const DETAIL_LINE = DETAIL.append('path')
                                 .datum(data)
                                 .attr("d", d3.line()
                                     .x((d) => {return DETAIL_MARGINS.left + DetailXScale(d.DATE)})
                                     .y((d) => {return URateYScale(d.URate) + DETAIL_MARGINS.top}))
                                 .attr("class", "Unemployment_Rate"); 

      const TOOLTIP = d3.select("#detailgraph")
                        .append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0);                           

    const dateFormat = d3.timeFormat("%-m/%-d/%Y");
                        
    function mouseMove(event, d) {
        let current_class = this.classList;
        let date = dateFormat(DetailXScale.invert(event.offsetX - DETAIL_MARGINS.left));
        let value = Math.abs(URateYScale.invert(event.offsetY - DETAIL_MARGINS.top));
      
        TOOLTIP.html("Date: " + date + "</br>" + "Value: " + d3.format("0.2%")(value / 100))
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 50) + "px")
                .style("background-color", "gray");
    };


    function mouseOver(event, d) {
        TOOLTIP.style("opacity", 100);
    };


    function mouseLeave(event, d) {
        TOOLTIP.style("opacity", 0);
    };

    DETAIL.selectAll(".Unemployment_Rate")
        .on("mouseover", mouseOver)
        .on("mousemove", mouseMove)
        .on("mouseleave", mouseLeave);

      // Add y axis to vis  
      const DETAIL_Y_AXIS = DETAIL.append("g") 
                            .attr("transform", "translate(" + DETAIL_MARGINS.left + 
                              "," + (DETAIL_MARGINS.top) + ")") 
                            .call(d3.axisLeft(URateYScale).ticks(4))
                            .attr("font-size", '10px');
       // Add y axis labels to vis  
        DETAIL_Y_AXIS.append("text")
            .attr("class", "y-axis-label")
            .attr("x", - DETAIL_VIS_HEIGHT / 2)
            .attr("y", - DETAIL_MARGINS.left / 2 - 20)
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .style("text-anchor", "middle")
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .text("Percent"); 
    }
    // check for cpi, plot if true
    if (index == 2) {
      const DETAIL_LINE = DETAIL.append('path')
                                 .datum(data)
                                 .attr("d", d3.line()
                                     .x((d) => {return DETAIL_MARGINS.left + DetailXScale(d.DATE)})
                                     .y((d) => {return CPIYScale(d.CPI) + DETAIL_MARGINS.top}))
                                 .attr("class", "CPI"); 

      const TOOLTIP = d3.select("#detailgraph")
                        .append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0);                           

    const dateFormat = d3.timeFormat("%-m/%-d/%Y");
                        
    function mouseMove(event, d) {
        let current_class = this.classList;
        let date = dateFormat(DetailXScale.invert(event.offsetX - DETAIL_MARGINS.left));
        let value = Math.abs(CPIYScale.invert(event.offsetY - DETAIL_MARGINS.top));

        TOOLTIP.html("Date: " + date + "</br>" + "Value: " + d3.format(",.0f")(value))
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 50) + "px")
                .style("background-color", "gray");
    };


    function mouseOver(event, d) {
        TOOLTIP.style("opacity", 100);
    };


    function mouseLeave(event, d) {
        TOOLTIP.style("opacity", 0);
    };

    DETAIL.selectAll(".CPI")
        .on("mouseover", mouseOver)
        .on("mousemove", mouseMove)
        .on("mouseleave", mouseLeave);

    // Add y axis to vis  
    const DETAIL_Y_AXIS = DETAIL.append("g") 
                            .attr("transform", "translate(" + DETAIL_MARGINS.left + 
                              "," + (DETAIL_MARGINS.top) + ")") 
                            .call(d3.axisLeft(CPIYScale).ticks(4))
                            .attr("font-size", '10px');
     // Add y axis labels to vis  
    DETAIL_Y_AXIS.append("text")
        .attr("class", "y-axis-label")
        .attr("x", - DETAIL_VIS_HEIGHT / 2)
        .attr("y", - DETAIL_MARGINS.left / 2 - 20)
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text("Price Level");

    }
    // check for ppi, plot if true
    if (index == 3) {
      const DETAIL_LINE = DETAIL.append('path')
                                 .datum(data)
                                 .attr("d", d3.line()
                                     .x((d) => {return DETAIL_MARGINS.left + DetailXScale(d.DATE)})
                                     .y((d) => {return PPIYScale(d.PPI) + DETAIL_MARGINS.top}))
                                 .attr("class", "PPI"); 

      const TOOLTIP = d3.select("#detailgraph")
                        .append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0);                           

    const dateFormat = d3.timeFormat("%-m/%-d/%Y");
                        
    function mouseMove(event, d) {
        let current_class = this.classList;
        let date = dateFormat(DetailXScale.invert(event.offsetX - DETAIL_MARGINS.left));
        let value = Math.abs(PPIYScale.invert(event.offsetY - DETAIL_MARGINS.top));
      

        TOOLTIP.html("Date: " + date + "</br>" + "Value: " + d3.format(",.0f")(value))
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 50) + "px")
                .style("background-color", "gray");
    };


    function mouseOver(event, d) {
        TOOLTIP.style("opacity", 100);
    };


    function mouseLeave(event, d) {
        TOOLTIP.style("opacity", 0);
    };

    DETAIL.selectAll(".PPI")
        .on("mouseover", mouseOver)
        .on("mousemove", mouseMove)
        .on("mouseleave", mouseLeave);

    // Add y axis to vis  
    const DETAIL_Y_AXIS = DETAIL.append("g") 
                            .attr("transform", "translate(" + DETAIL_MARGINS.left + 
                              "," + (DETAIL_MARGINS.top) + ")") 
                            .call(d3.axisLeft(PPIYScale).ticks(4))
                            .attr("font-size", '10px'); 
    // Add y axis labels to vis  
    DETAIL_Y_AXIS.append("text")
        .attr("class", "y-axis-label")
        .attr("x", - DETAIL_VIS_HEIGHT / 2)
        .attr("y", - DETAIL_MARGINS.left / 2 - 20)
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text("Price Level");

    }
    // check for uclaims, plot if true
    if (index == 4) {
      const DETAIL_LINE = DETAIL.append('path')
                                 .datum(data)
                                 .attr("d", d3.line()
                                     .x((d) => {return DETAIL_MARGINS.left + DetailXScale(d.DATE)})
                                     .y((d) => {return UClaimsYScale(d.UClaims) + DETAIL_MARGINS.top}))
                                 .attr("class", "Unemployment_Claims"); 

      const TOOLTIP = d3.select("#detailgraph")
                        .append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0);                           

    const dateFormat = d3.timeFormat("%-m/%-d/%Y");
                        
    function mouseMove(event, d) {
        let current_class = this.classList;
        let date = dateFormat(DetailXScale.invert(event.offsetX - DETAIL_MARGINS.left));
        let value = Math.abs(UClaimsYScale.invert(event.offsetY - DETAIL_MARGINS.top));
      

        TOOLTIP.html("Date: " + date + "</br>" + "Value: " + d3.format(",.0f")(value))
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 50) + "px")
                .style("background-color", "gray");
    };


    function mouseOver(event, d) {
        TOOLTIP.style("opacity", 100);
    };


    function mouseLeave(event, d) {
        TOOLTIP.style("opacity", 0);
    };

    DETAIL.selectAll(".Unemployment_Claims")
        .on("mouseover", mouseOver)
        .on("mousemove", mouseMove)
        .on("mouseleave", mouseLeave);

      // Add y axis to vis  
      const DETAIL_Y_AXIS = DETAIL.append("g") 
                            .attr("transform", "translate(" + DETAIL_MARGINS.left + 
                              "," + (DETAIL_MARGINS.top) + ")") 
                            .call(d3.axisLeft(UClaimsYScale).ticks(4))
                            .attr("font-size", '10px'); 
    
    // Add y axis labels to vis  
    DETAIL_Y_AXIS.append("text")
        .attr("class", "y-axis-label")
        .attr("x", - DETAIL_VIS_HEIGHT / 2)
        .attr("y", - DETAIL_MARGINS.left / 2 - 20)
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text("Count");
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