// constants for plot design
const FRAME_HEIGHT = 450;
const FRAME_WIDTH = 1000; 
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



    function mouseMove(event, d) {
        let current_class = this.classList
        console.log(current_class)
        TOOLTIP.html("Metric: " + current_class + "</br>" + "Date:" + MainXScale.invert(event.pageX, event.pageY) + "</br>" + "Value: " + MainYScale.invert(event.pageX, event.pageY))
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
const indicator_info_text_cpi = "CPI info"
const indicator_info_text_ppi = "PPI info"
const indicator_info_text_urate = "Unemployment Rate info"
const indicator_info_text_uclaims = "Unemployment Claims info"
const indicator_info_text_payrolls = "Payrolls info"

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
    const DETAIL_FRAME_HEIGHT = 225;
    const DETAIL_FRAME_WIDTH = 550; 
    const DETAIL_MARGINS = {left: 50, right: 50, top: 25, bottom: 25};

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

    (d) => {
    if (index == 0) {
      detail_dynamic(PayrollYScale, d.Payrolls, "payrollline");
    }
    if (index == 1) {
      detail_dynamic(URateYScale, d.URate, "urateline");
    }
    if (index == 2) {
      detail_dynamic(CPIYScale, d.CPI, "cpiline");
    }
    if (index == 3) {
      detail_dynamic(PPIYScale, d.PPI, "ppiline");
    }
    if (index == 4) {
      detail_dynamic(UClaimsYScale, d.UClaims, "claimsline");
    }
  };
    
    //function to draw the correct line
    function detail_dynamic(scale, col, line_class) {

      // setting up svg to put the visual in
      const DETAIL = d3.select("#detailgraph")
        .append("svg")
        .attr("id", "detail")
        .attr("height", DETAIL_FRAME_HEIGHT)
        .attr("width", DETAIL_FRAME_WIDTH)
        .attr("class", "frame"); 

      const DETAIL_LINE = DETAIL.append('path')
                            .datum(data)
                            .attr("d", d3.line()
                                .x((d) => {return DETAIL_MARGINS.left + DetailXScale(d.DATE)})
                                .y((d) => {return scale(col) + DETAIL_MARGINS.top}))
                            .attr("class", line_class); 

      // Add x axis to vis  
      DETAIL.append("g") 
      .attr("transform", "translate(" + DETAIL_MARGINS.left + 
        "," + (DETAIL_VIS_HEIGHT + DETAIL_MARGINS.top) + ")") 
      .call(d3.axisBottom(DetailXScale).ticks(8)) 
      .attr("font-size", '10px'); 

      // Add y axis to vis  
      DETAIL.append("g") 
        .attr("transform", "translate(" + DETAIL_MARGINS.left + 
          "," + (DETAIL_MARGINS.top) + ")") 
        .call(d3.axisLeft(scale).ticks(4))
        .attr("font-size", '10px'); 
    };

    // // plot payroll counts
    // const payrolls_DETAIL = DETAIL.append('path')
    //                         .datum(data) // passed from .then  
    //                         .attr("d", d3.line()
    //                             .x((d) => {return DETAIL_MARGINS.left + DetailXScale(d.DATE)})
    //                             .y((d) => {return DetailYScale(d.Payrolls) + DETAIL_MARGINS.top}))
    //                         .attr("class", "payrollline"); 
    
    // // plot payroll counts
    // const urate_DETAIL = DETAIL.append('path')
    //                         .datum(data) // passed from .then  
    //                         .attr("d", d3.line()
    //                             .x((d) => {return DETAIL_MARGINS.left + DetailXScale(d.DATE)})
    //                             .y((d) => {return DetailYScale(d.URate) + DETAIL_MARGINS.top}))
    //                         .attr("class", "payrolldetailline"); 

    // // plot payroll counts
    // const cpi_DETAIL = DETAIL.append('path')
    //                         .datum(data) // passed from .then  
    //                         .attr("d", d3.line()
    //                             .x((d) => {return DETAIL_MARGINS.left + DetailXScale(d.DATE)})
    //                             .y((d) => {return DetailYScale(d.CPI) + DETAIL_MARGINS.top}))
    //                         .attr("class", "payrolldetailline"); 

    // // plot payroll counts
    // const ppi_DETAIL = DETAIL.append('path')
    //                         .datum(data) // passed from .then  
    //                         .attr("d", d3.line()
    //                             .x((d) => {return DETAIL_MARGINS.left + DetailXScale(d.DATE)})
    //                             .y((d) => {return DetailYScale(d.PPI) + DETAIL_MARGINS.top}))
    //                         .attr("class", "payrolldetailline"); 

    // // plot payroll counts
    // const uclaims_DETAIL = DETAIL.append('path')
    //                         .datum(data) // passed from .then  
    //                         .attr("d", d3.line()
    //                             .x((d) => {return DETAIL_MARGINS.left + DetailXScale(d.DATE)})
    //                             .y((d) => {return DetailYScale(d.UClaims) + DETAIL_MARGINS.top}))
    //                         .attr("class", "payrolldetailline"); 
  });
};

// initialize deatilvis with payrolls information
function initial_detail() {
  document.getElementById('indicatortext').innerHTML = indicator_text_payrolls;
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

  detail_vis(selected_index);
}

// altering the detailtextbox
function update_detail(x) {

  // checking the given index and altering the contents of detailtextbox 
  if (x == 1) {
    document.getElementById('indicatortext').innerHTML = indicator_text_urate;
    document.getElementById('indicatorinfotext').innerHTML = indicator_info_text_urate;
  } 
  
  if (x == 2) {
    document.getElementById('indicatortext').innerHTML = indicator_text_cpi;
    document.getElementById('indicatorinfotext').innerHTML = indicator_info_text_cpi;
  } 
  
  if (x == 3) {
    document.getElementById('indicatortext').innerHTML = indicator_text_ppi;
    document.getElementById('indicatorinfotext').innerHTML = indicator_info_text_ppi;
  } 
  
  if (x == 4) {
    document.getElementById('indicatortext').innerHTML = indicator_text_uclaims;
    document.getElementById('indicatorinfotext').innerHTML = indicator_info_text_uclaims;
  } 
  
  if (x == 0) {
    document.getElementById('indicatortext').innerHTML = indicator_text_payrolls;
    document.getElementById('indicatorinfotext').innerHTML = indicator_info_text_payrolls;
  }

}

// Add event handler to button 
document.getElementById('selectedindicator').addEventListener('change', submitClicked);