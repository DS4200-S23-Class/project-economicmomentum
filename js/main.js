// constants for plot design
const FRAME_HEIGHT = 450;
const FRAME_WIDTH = 900; 
const MARGINS = {left: 50, right: 50, top: 25, bottom: 25};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 

const SLIDE_HEIGHT = 100;
const SLIDE_WIDTH = 900; 
const SLIDE_MARGINS = {left: 50, right: 50, top: 10, bottom: 10};

const SLIDE_VIS_H = SLIDE_HEIGHT - MARGINS.top - MARGINS.bottom;
const SLIDE_VIS_W = SLIDE_WIDTH - MARGINS.left - MARGINS.right; 

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

    const max_list = 
        {"Payroll" : MaxPayroll,
        "CPI" : MaxCPI,
        "PPI" : MaxPPI,
        "Unemployment_Claims" : MaxUClaims,
        "Unemployment_Rate" : MaxURate};
        

   



    

    const dates = [];
    for (let obj of data) {
      dates.push(obj.DATE)
    }

    const domain = d3.extent(data, (d) => d.DATE);

    console.log(domain)
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
                    .attr("id", "mvis")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 

    // plot payroll counts
    const payrolls = MAIN.append('path')
                        .datum(data) // passed from .then  
                        .attr("d", d3.line()
                            .x((d) => {return MARGINS.left + MainXScale(d.DATE)})
                            .y((d) => {return MainYScale(d.Payrolls/MaxPayroll) + MARGINS.top}))
                        .attr("class", "Payroll"); 

    // plot unemployment rate
    const unemployment = MAIN.append('path')
                        .datum(data) // passed from .then  
                        .attr("d", d3.line()
                            .x((d) => {return MARGINS.left + MainXScale(d.DATE)})
                            .y((d) => {return MainYScale(d.URate/MaxURate) + MARGINS.top}))
                        .attr("class", "Unemployment_Rate"); 
    
    // plot PPI
    const ppi = MAIN.append('path')
                        .datum(data) // passed from .then  
                        .attr("d", d3.line()
                            .x((d) => {return MARGINS.left + MainXScale(d.DATE)})
                            .y((d) => {return MainYScale(d.PPI/MaxPPI) + MARGINS.top}))
                        .attr("class", "PPI"); 

    // plot CPI
    const cpi = MAIN.append('path')
                        .datum(data) // passed from .then  
                        .attr("d", d3.line()
                            .x((d) => {return MARGINS.left + MainXScale(d.DATE)})
                            .y((d) => {return MainYScale(d.CPI/MaxCPI) + MARGINS.top}))
                        .attr("class", "CPI");

     // plot claims
     const claims = MAIN.append('path')
                        .datum(data) // passed from .then  
                        .attr("d", d3.line()
                            .x((d) => {return MARGINS.left + MainXScale(d.DATE)})
                            .y((d) => {return MainYScale(d.UClaims/MaxUClaims) + MARGINS.top}))
                        .attr("class", "Unemployment_Claims");
                        
    // Add x axis to vis  
    const main_x_axis = MAIN.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
              "," + (VIS_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(MainXScale).ticks(8)) 
          .attr("font-size", '10px'); 

    // Add y axis to vis  
    const main_y_axis = MAIN.append("g") 
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

    // add a tooltip to the main viz
    // change the date time format
                       
    const dateFormat = d3.timeFormat("%-m/%-d/%Y");
                        
    function mouseMove(event, d) {


        
        // getting the class for the current object to be used in the tooltip
        let current_class = this.classList;

        if (current_class == "Unemployment_Rate") { 

            let maximum_class = max_list[current_class];
        

            //setting values
            let y_value = event.pageY / VIS_HEIGHT;
            let date = dateFormat(MainXScale.invert(event.offsetX - MARGINS.right));
            let value = (MainYScale.invert(event.offsetY - MARGINS.top));
            let value2 = (value * maximum_class) / 100;

            let stroke_color = d3.select(this).style("stroke");

            TOOLTIP.html("Metric: " + current_class + "</br>" + "Date: " + date + "</br>" + "Value: " + d3.format(".2%")(value2))
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 50) + "px")
                    .style("background-color", stroke_color)
                    .style("fill-opacity", 0.75);
        } else {
            let maximum_class = max_list[current_class];
        //setting values
            let y_value = event.pageY / VIS_HEIGHT;
            let date = dateFormat(MainXScale.invert(event.offsetX - MARGINS.right));
            let value = (MainYScale.invert(event.offsetY - MARGINS.top));
            let value2 = value * maximum_class;
            let stroke_color = d3.select(this).style("stroke");

            TOOLTIP.html("Metric: " + current_class + "</br>" + "Date: " + date + "</br>" + "Value: " + d3.format(",.0f")(value2))
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 50) + "px")
                    .style("background-color", stroke_color);

        };

        
    };


    function mouseOver(event, d) {
        TOOLTIP.style("opacity", 0.75);
    };


    function mouseLeave(event, d) {
        TOOLTIP.style("opacity", 0);
    };


    MAIN.selectAll(".Unemployment_Claims")
        .on("mouseover", mouseOver)
        .on("mousemove", mouseMove)
        .on("mouseleave", mouseLeave);

    MAIN.selectAll(".CPI")
        .on("mouseover", mouseOver)
        .on("mousemove", mouseMove)
        .on("mouseleave", mouseLeave);

    MAIN.selectAll(".PPI")
        .on("mouseover", mouseOver)
        .on("mousemove", mouseMove)
        .on("mouseleave", mouseLeave);

    MAIN.selectAll(".Unemployment_Rate")
        .on("mouseover", mouseOver)
        .on("mousemove", mouseMove)
        .on("mouseleave", mouseLeave);

    MAIN.selectAll(".Payroll")
        .on("mouseover", mouseOver)
        .on("mousemove", mouseMove)
        .on("mouseleave", mouseLeave);

    // slider plotting

    // setting scales
    const SlideXScale = d3.scaleTime() 
                      .domain(domain) 
                      .range([0, SLIDE_VIS_W]); 

    const SlideYScale = d3.scaleLinear() 
                      .domain([1, 0])  
                      .range([0, SLIDE_VIS_H]); 

    // setting up the graph
    const SLIDE = d3.select("#slider")
                  .append("svg")
                    .attr("id", "slidegraph")
                    .attr("height", SLIDE_HEIGHT)
                    .attr("width", SLIDE_WIDTH)
                    .attr("class", "frame"); 

    // plot payroll counts
    const s_payrolls = SLIDE.append('path')
                        .datum(data) // passed from .then  
                        .attr("d", d3.line()
                            .x((d) => {return SLIDE_MARGINS.left + SlideXScale(d.DATE)})
                            .y((d) => {return SlideYScale(d.Payrolls/MaxPayroll) + SLIDE_MARGINS.top}))
                        .attr("class", "slideline"); 

    // plot unemployment rate
    const s_unemployment = SLIDE.append('path')
                        .datum(data) // passed from .then  
                        .attr("d", d3.line()
                            .x((d) => {return SLIDE_MARGINS.left + SlideXScale(d.DATE)})
                            .y((d) => {return SlideYScale(d.URate/MaxURate) + SLIDE_MARGINS.top}))
                        .attr("class", "slideline"); 
    
    // plot PPI
    const s_ppi = SLIDE.append('path')
                        .datum(data) // passed from .then  
                        .attr("d", d3.line()
                            .x((d) => {return SLIDE_MARGINS.left + SlideXScale(d.DATE)})
                            .y((d) => {return SlideYScale(d.PPI/MaxPPI) + SLIDE_MARGINS.top}))
                        .attr("class", "slideline"); 

    // plot CPI
    const s_cpi = SLIDE.append('path')
                        .datum(data) // passed from .then  
                        .attr("d", d3.line()
                            .x((d) => {return SLIDE_MARGINS.left + SlideXScale(d.DATE)})
                            .y((d) => {return SlideYScale(d.CPI/MaxCPI) + SLIDE_MARGINS.top}))
                        .attr("class", "slideline");

     // plot claims
     const s_claims = SLIDE.append('path')
                        .datum(data) // passed from .then  
                        .attr("d", d3.line()
                            .x((d) => {return SLIDE_MARGINS.left + SlideXScale(d.DATE)})
                            .y((d) => {return SlideYScale(d.UClaims/MaxUClaims) + SLIDE_MARGINS.top}))
                        .attr("class", "slideline");

    // Add x axis to vis  
    SLIDE.append("g") 
        .attr("transform", "translate(" + SLIDE_MARGINS.left + 
              "," + (SLIDE_VIS_H + SLIDE_MARGINS.top) + ")") 
        .call(d3.axisBottom(SlideXScale).ticks(8)) 
          .attr("font-size", '10px');

    // Add brushing
    // adding brushing
    d3.select("#slidegraph")
          .call( d3.brushX()                    
            .extent( [ [SLIDE_MARGINS.left,0], [(SLIDE_VIS_W + SLIDE_MARGINS.left), (SLIDE_VIS_H + SLIDE_MARGINS.top)] ] )
            .on("start brush", updateMain)
          );
    
    function updateMain(event) {
        extent = event.selection  //get coordinates

        d3.selectAll("#mainvis > *").remove(); 

        renderMain(extent);
        console.log("updatemain called");
    }

    function renderMain(brush_coords){
        
        let x0 = brush_coords[0],
            x1 = brush_coords[1];
        
        console.log(x0);
        console.log(x1);
        
        //ISSUE IS HERE, date formatting and date domain formatting again I think
        const slideMin = SlideXScale.invert(x0).getTime();
        const slideMax = SlideXScale.invert(x1).getTime();

        console.log(slideMin)
        console.log(slideMax)

        const domain = [slideMin, slideMax];

        console.log(domain)
   
        //setting scales
        const MainXScale = d3.scaleTime() 
                            .domain(domain) 
                            .range([0, VIS_WIDTH]); 

        const MainYScale = d3.scaleLinear() 
                            .domain([0, 1])  
                            .range([0, VIS_HEIGHT]); 
      
        // setting up the graph
        const MAIN = d3.select("#mainvis")
                        .append("svg")
                          .attr("id", "mvis")
                          .attr("height", FRAME_HEIGHT)
                          .attr("width", FRAME_WIDTH)
                          .attr("class", "frame"); 

        // plot payroll counts
        const payrolls = MAIN.append('path')
            .datum(data) // passed from .then  
            .attr("d", d3.line()
                .x((d) => {return MARGINS.left + MainXScale(d.DATE)})
                .y((d) => {return MainYScale(d.Payrolls/MaxPayroll) + MARGINS.top}))
            .attr("class", "Payroll"); 

        // plot unemployment rate
        const unemployment = MAIN.append('path')
            .datum(data) // passed from .then  
            .attr("d", d3.line()
                .x((d) => {return MARGINS.left + MainXScale(d.DATE)})
                .y((d) => {return MainYScale(d.URate/MaxURate) + MARGINS.top}))
            .attr("class", "Unemployment_Rate"); 

        // plot PPI
        const ppi = MAIN.append('path')
            .datum(data) // passed from .then  
            .attr("d", d3.line()
                .x((d) => {return MARGINS.left + MainXScale(d.DATE)})
                .y((d) => {return MainYScale(d.PPI/MaxPPI) + MARGINS.top}))
            .attr("class", "PPI"); 

        // plot CPI
        const cpi = MAIN.append('path')
            .datum(data) // passed from .then  
            .attr("d", d3.line()
                .x((d) => {return MARGINS.left + MainXScale(d.DATE)})
                .y((d) => {return MainYScale(d.CPI/MaxCPI) + MARGINS.top}))
            .attr("class", "CPI");

        // plot claims
        const claims = MAIN.append('path')
            .datum(data) // passed from .then  
            .attr("d", d3.line()
                .x((d) => {return MARGINS.left + MainXScale(d.DATE)})
                .y((d) => {return MainYScale(d.UClaims/MaxUClaims) + MARGINS.top}))
            .attr("class", "Unemployment_Claims");
        
        // Add x axis to vis  
        const main_x_axis = MAIN.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
        "," + (VIS_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(MainXScale).ticks(8)) 
        .attr("font-size", '10px'); 

        // Add y axis to vis  
        const main_y_axis = MAIN.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
        "," + (MARGINS.top) + ")") 
        .call(d3.axisLeft(MainYScale).ticks(4).tickFormat(function(d) {
        return (d * 100) + "%"}))
        .attr("font-size", '10px'); 
      
    // add a tooltip to the brushed main viz
    // change the date time format
                       
    const dateFormat = d3.timeFormat("%-m/%-d/%Y");
                        
    function mouseMove(event, d) {
        let current_class = this.classList;
        let y_value = event.pageY / VIS_HEIGHT;
        let date = dateFormat(MainXScale.invert(event.offsetX - MARGINS.right));
        let value = Math.abs(MainYScale.invert(event.offsetY - MARGINS.top));
        let stroke_color = d3.select(this).style("stroke");

      
        
        TOOLTIP.html("Metric: " + current_class + "</br>" + "Date: " + date + "</br>" + "Value: " + d3.format(".2%")(value))
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 50) + "px")
                .style("background-color", stroke_color);
    };


    function mouseOver(event, d) {
        TOOLTIP.style("opacity", 100);
    };


    function mouseLeave(event, d) {
        TOOLTIP.style("opacity", 0);
    };


    MAIN.selectAll(".Unemployment_Claims")
        .on("mouseover", mouseOver)
        .on("mousemove", mouseMove)
        .on("mouseleave", mouseLeave);

    MAIN.selectAll(".CPI")
        .on("mouseover", mouseOver)
        .on("mousemove", mouseMove)
        .on("mouseleave", mouseLeave);

    MAIN.selectAll(".PPI")
        .on("mouseover", mouseOver)
        .on("mousemove", mouseMove)
        .on("mouseleave", mouseLeave);

    MAIN.selectAll(".Unemployment_Rate")
        .on("mouseover", mouseOver)
        .on("mousemove", mouseMove)
        .on("mouseleave", mouseLeave);

    MAIN.selectAll(".Payroll")
        .on("mouseover", mouseOver)
        .on("mousemove", mouseMove)
        .on("mouseleave", mouseLeave);



    };
    
});
};

build_plots();
