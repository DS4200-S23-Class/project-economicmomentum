// constants for plot design
const FRAME_HEIGHT = 510;
const FRAME_WIDTH = 850; 
const MARGINS = {left: 75, right: 5, top: 25, bottom: 25};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 

const SLIDE_HEIGHT = 115;
const SLIDE_WIDTH = FRAME_WIDTH; 
const SLIDE_MARGINS = {left: MARGINS.left, right: MARGINS.right, top: 10, bottom: 20};

const SLIDE_VIS_H = SLIDE_HEIGHT - MARGINS.top - MARGINS.bottom;
const SLIDE_VIS_W = SLIDE_WIDTH - MARGINS.left - MARGINS.right; 

// creation function
function build_plots() {

  // reading in the data
  d3.csv("data/NoNullsData.csv", 
  d3.csv("data/GDPwDates.csv",
  function(d){
    return {DATE : d3.timeParse("%-m/%-d/%Y")(d.DATE), 
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

    // setting constants for legend on main viz   
    const vis1_keys = ['CPI', 'PPI', "Unemployment Rate", "Unemployment Claims", "Payrolls"];
    const key_colors = ["rgb(27, 139, 27)", "rgba(211, 23, 23, 0.824)", "rgb(237, 138, 0)", "Purple", "rgb(49, 49, 183)"];
    const spacing = [10, 60, 110, 250, 400];


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


    function draw_recession(start, end) {
        const formatDate = d3.timeParse("%-m/%-d/%Y");

        const recession_bar = MAIN.append("rect")
            .attr("x", MARGINS.left + (MainXScale((formatDate(start)))))
            .attr("y", MARGINS.top)
            .attr("height", VIS_HEIGHT)
            .attr("width", ((MainXScale((formatDate(end)))) - (MainXScale((formatDate(start))))))
            .attr("class", 'recession_bar')
            .attr("start", start)
            .attr("end", end);

            return recession_bar;
    };
    

    /// add 1990 recession
    const _1990_bar = draw_recession("1/1/1990", "3/1/1991");        
    // add 2001 recession
    const _2001_bar = draw_recession("1/1/2001", "12/31/2001");
    
    // add 2008 recession
    const _2008_bar = draw_recession("1/1/2008", "12/31/2008");
    
    // add covid 2020 recession
    const _2020_bar = draw_recession("1/1/2020", "12/31/2020");

    // adding recession tooltip

    const TOOLTIP_BAR = d3.select("#mainvis")
                        .append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0);

    function mouseMove_BAR(event, d) {
        const formatDate = d3.timeFormat("%-m/%-d/%Y");
        const start = d3.select(this).attr("start");
        const end = d3.select(this).attr("end");
        const formattedStart = formatDate(d3.timeParse("%-m/%-d/%Y")(start));
        const formattedEnd = formatDate(d3.timeParse("%-m/%-d/%Y")(end));

        TOOLTIP_BAR.html("Recession Start: " + start + "</br>" + "Recession End: " + end)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 50) + "px")
                    .attr("class", "recession_tooltip");

    };

    function mouseOver_BAR(event, d) {
        TOOLTIP_BAR.style("opacity", 1);
    };


    function mouseLeave_BAR(event, d) {
        TOOLTIP_BAR.style("opacity", 0);
    };

    MAIN.selectAll(".recession_bar")
        .on("mouseover", mouseOver_BAR)
        .on("mousemove", mouseMove_BAR)
        .on("mouseleave", mouseLeave_BAR);
    

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
          .attr("font-size", '10px')
          .attr("font-weight", "bold"); 

    // Add y axis to vis  
    const main_y_axis = MAIN.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
              "," + (MARGINS.top) + ")") 
        .call(d3.axisLeft(MainYScale).ticks(4).tickFormat(function(d) {
            return (d * 100) + "%"}))
          .attr("font-size", '10px')
          .attr("font-weight", "bold"); 
          
    // Add y axis label 
    main_y_axis.append("text")
    .attr("class", "y-axis-label")
    .attr("x", -VIS_HEIGHT / 2)
    .attr("y", -MARGINS.left / 2 - 5)
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .text("% of Maximum");

    // dot for legend
    MAIN.selectAll("mydots")
        .data(vis1_keys)
        .enter()
        .append("circle")
        .attr("cx", function(d,i){ return MARGINS.left + spacing[i]})
        .attr("cy", MARGINS.top - 10) 
        .attr("r", 4)
        .style("fill", function(d,i){ return key_colors[i]});

    // square for legend
    MAIN.selectAll("myrect")
        .data(vis1_keys)
        .enter()
        .append("rect")
        .attr("x", 540)
        .attr("y", MARGINS.top - 18)
        .attr("height", 15)
        .attr("width", 15)
        .attr("fill", "grey")
        .style("opacity", 0.5);

    // text for legend
    MAIN.selectAll("mylabels")
        .data(vis1_keys)
        .enter()
        .append("text")
        .attr("x", function(d,i){ return MARGINS.left + spacing[i] + 10})
        .attr("y", MARGINS.top - 10)
        .style("fill", function(d,i){ return key_colors[i]})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("font-weight", "bold")
        .style("alignment-baseline", "middle")
        .style("font-size","12px");

    // adding another label for the rectangle
    MAIN.selectAll("mylabels")
        .data(vis1_keys)
        .enter()
        .append("text")
        .attr("x", 540 + 20)
        .attr("y", MARGINS.top - 10)
        .style("fill", "grey")
        .text("Economic Recession")
        .attr("text-anchor", "left")
        .style("font-weight", "bold")
        .style("alignment-baseline", "middle")
        .style("font-size","12px");

    // add a tooltip to the visualization
    const TOOLTIP = d3.select("#mainvis")
                        .append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0);

    // add a tooltip to the main viz
    // change the date time format
                       
    const dateFormat = d3.timeFormat("%-m/%-d/%Y");
                        
    function mouseMove(event, d) {

        let current_class = this.classList;
        let maximum_class = max_list[current_class];
        //setting values
        let y_value = event.pageY / VIS_HEIGHT;
        let date = dateFormat(MainXScale.invert(event.offsetX - MARGINS.right));
        let value = (MainYScale.invert(event.offsetY - MARGINS.top));
        let value2 = value * maximum_class;
        let stroke_color = d3.select(this).style("stroke");
        // getting the class for the current object to be used in the tooltip
        
        // checking if the current class if unemployment rate because it needs to be formatted differently
        if (current_class == "Unemployment_Rate") { 

            TOOLTIP.html("Metric: " + current_class + "</br>" + "Date: " + date + "</br>" + "Value: " + d3.format(".2%")(value2))
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 50) + "px")
                    .style("background-color", stroke_color);
                 
        } else {

            TOOLTIP.html("Metric: " + current_class + "</br>" + "Date: " + date + "</br>" + "Value: " + d3.format(",.0f")(value2))
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 50) + "px")
                    .style("background-color", stroke_color);
        };
    };


    function mouseOver(event, d) {
        TOOLTIP.style("opacity", 1);
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
                        .attr("class", "slidepayroll"); 

    // plot unemployment rate
    const s_unemployment = SLIDE.append('path')
                        .datum(data) // passed from .then  
                        .attr("d", d3.line()
                            .x((d) => {return SLIDE_MARGINS.left + SlideXScale(d.DATE)})
                            .y((d) => {return SlideYScale(d.URate/MaxURate) + SLIDE_MARGINS.top}))
                        .attr("class", "slideurate"); 
    
    // plot PPI
    const s_ppi = SLIDE.append('path')
                        .datum(data) // passed from .then  
                        .attr("d", d3.line()
                            .x((d) => {return SLIDE_MARGINS.left + SlideXScale(d.DATE)})
                            .y((d) => {return SlideYScale(d.PPI/MaxPPI) + SLIDE_MARGINS.top}))
                        .attr("class", "slideppi"); 

    // plot CPI
    const s_cpi = SLIDE.append('path')
                        .datum(data) // passed from .then  
                        .attr("d", d3.line()
                            .x((d) => {return SLIDE_MARGINS.left + SlideXScale(d.DATE)})
                            .y((d) => {return SlideYScale(d.CPI/MaxCPI) + SLIDE_MARGINS.top}))
                        .attr("class", "slidecpi");

     // plot claims
     const s_claims = SLIDE.append('path')
                        .datum(data) // passed from .then  
                        .attr("d", d3.line()
                            .x((d) => {return SLIDE_MARGINS.left + SlideXScale(d.DATE)})
                            .y((d) => {return SlideYScale(d.UClaims/MaxUClaims) + SLIDE_MARGINS.top}))
                        .attr("class", "slideline");

    // add recession bars to the slider

    function draw_recession_slider (start, end) {
        const formatDate = d3.timeParse("%-m/%-d/%Y");

        const recession_bar = SLIDE.append("rect")
            .attr("x", SLIDE_MARGINS.left + (SlideXScale((formatDate(start)))))
            .attr("y", SLIDE_MARGINS.top)
            .attr("height", SLIDE_VIS_H)
            .attr("width", ((SlideXScale((formatDate(end)))) - (SlideXScale((formatDate(start))))))
            .attr("class", 'recession_bar');
    }
    

    /// add 1990 recession
    const _1990_bar_2 = draw_recession_slider("1/1/1990", "3/1/1991");        
    // add 2001 recession
    const _2001_bar_2 = draw_recession_slider("1/1/2001", "12/31/2001");
    
    // add 2008 recession
    const _2008_bar_2 = draw_recession_slider("1/1/2008", "12/31/2008");
    
    // add covid 2020 recession
    const _2020_bar_2 = draw_recession_slider("1/1/2020", "12/31/2020");

    // Add x axis to vis  
    SLIDE.append("g") 
        .attr("transform", "translate(" + SLIDE_MARGINS.left + 
              "," + (SLIDE_VIS_H + SLIDE_MARGINS.top) + ")") 
        .call(d3.axisBottom(SlideXScale).ticks(8)) 
          .attr("font-size", '10px')
          .attr("font-weight", "bold");

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
    }

    function renderMain(brush_coords){


        let x0 = brush_coords[0],
            x1 = brush_coords[1];
        
        
        
        //ISSUE IS HERE, date formatting and date domain formatting again I think
        const slideMin = SlideXScale.invert(x0 - SLIDE_MARGINS.left).getTime();
        const slideMax = SlideXScale.invert(x1  - SLIDE_MARGINS.left).getTime();


        // Create new data with the selection?
        let dataFilter1 = data.filter(function(row){
            return row['DATE'] >= slideMin});

        let dataFilter = dataFilter1.filter(function(row){
            return row['DATE'] <= slideMax});

        const domain = [slideMin, slideMax];
   
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
            .datum(dataFilter) // passed from .then  
            .attr("d", d3.line()
                .x((d) => {return MARGINS.left + MainXScale(d.DATE)})
                .y((d) => {return MainYScale(d.Payrolls/MaxPayroll) + MARGINS.top}))
            .attr("class", "Payroll"); 

        // plot unemployment rate
        const unemployment = MAIN.append('path')
            .datum(dataFilter) // passed from .then  
            .attr("d", d3.line()
                .x((d) => {return MARGINS.left + MainXScale(d.DATE)})
                .y((d) => {return MainYScale(d.URate/MaxURate) + MARGINS.top}))
            .attr("class", "Unemployment_Rate"); 

        // plot PPI
        const ppi = MAIN.append('path')
            .datum(dataFilter) // passed from .then  
            .attr("d", d3.line()
                .x((d) => {return MARGINS.left + MainXScale(d.DATE)})
                .y((d) => {return MainYScale(d.PPI/MaxPPI) + MARGINS.top}))
            .attr("class", "PPI"); 

        // plot CPI
        const cpi = MAIN.append('path')
            .datum(dataFilter) // passed from .then  
            .attr("d", d3.line()
                .x((d) => {return MARGINS.left + MainXScale(d.DATE)})
                .y((d) => {return MainYScale(d.CPI/MaxCPI) + MARGINS.top}))
            .attr("class", "CPI");

        // plot claims
        const claims = MAIN.append('path')
            .datum(dataFilter) // passed from .then  
            .attr("d", d3.line()
                .x((d) => {return MARGINS.left + MainXScale(d.DATE)})
                .y((d) => {return MainYScale(d.UClaims/MaxUClaims) + MARGINS.top}))
            .attr("class", "Unemployment_Claims")
            .style("stroke_color", "purple");


        function draw_recession(start, end) {
            const formatDate = d3.timeParse("%-m/%-d/%Y");

            if ((formatDate(start)) >= slideMin) {
                MAIN.append("rect")
                .attr("x", MARGINS.left + (MainXScale((formatDate(start)))))
                .attr("y", MARGINS.top)
                .attr("height", VIS_HEIGHT)
                .attr("width", ((MainXScale((formatDate(end)))) - (MainXScale((formatDate(start))))))
                .attr("class", 'recession_bar')
                .attr("start", start)
                .attr("end", end); 
            }
                
        };
    

    /// add 1990 recession
    const _1990_bar = draw_recession("1/1/1990", "3/1/1991");        
    // add 2001 recession
    const _2001_bar = draw_recession("1/1/2001", "12/31/2001");
    
    // add 2008 recession
    const _2008_bar = draw_recession("1/1/2008", "12/31/2008");
    
    // add covid 2020 recession
    const _2020_bar = draw_recession("1/1/2020", "12/31/2020");

    const TOOLTIP_BAR = d3.select("#mainvis")
                        .append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0);

    function mouseMove_BAR(event, d) {
        const formatDate = d3.timeFormat("%-m/%-d/%Y");

        const start = d3.select(this).attr("start");
        const end = d3.select(this).attr("end");
        const formattedStart = formatDate(d3.timeParse("%-m/%-d/%Y")(start));
        const formattedEnd = formatDate(d3.timeParse("%-m/%-d/%Y")(end));

        TOOLTIP_BAR.html("Recession Start: " + start + "</br>" + "Recession End: " + end)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 50) + "px")
                    .attr("class", "recession_tooltip");

    };

    function mouseOver_BAR(event, d) {
        TOOLTIP_BAR.style("opacity", 1);
    };


    function mouseLeave_BAR(event, d) {
        TOOLTIP_BAR.style("opacity", 0);
    };

    MAIN.selectAll(".recession_bar")
        .on("mouseover", mouseOver_BAR)
        .on("mousemove", mouseMove_BAR)
        .on("mouseleave", mouseLeave_BAR);
        
    // Add x axis to vis  
    const main_x_axis = MAIN.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
        "," + (VIS_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(MainXScale).ticks(8)) 
        .attr("font-size", '10px')
        .style("font-weight", "bold"); 

    // Add y axis to vis  
    const main_y_axis = MAIN.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
        "," + (MARGINS.top) + ")") 
        .call(d3.axisLeft(MainYScale).ticks(4).tickFormat(function(d) {
        return (d * 100) + "%"}))
        .attr("font-size", '10px')
        .attr("font-weight", "bold");

    main_y_axis.append("text")
            .attr("class", "y-axis-label")
            .attr("x", -VIS_HEIGHT / 2)
            .attr("y", -MARGINS.left / 2 - 5)
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .style("text-anchor", "middle")
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .text("% of Maximum");
    

    // dot for legend
    MAIN.selectAll("mydots")
        .data(vis1_keys)
        .enter()
        .append("circle")
        .attr("cx", function(d,i){ return MARGINS.left + spacing[i]})
        .attr("cy", MARGINS.top - 10) 
        .attr("r", 4)
        .style("fill", function(d,i){ return key_colors[i]});

    // square for legend
    MAIN.selectAll("myrect")
        .data(vis1_keys)
        .enter()
        .append("rect")
        .attr("x", 540)
        .attr("y", MARGINS.top - 18)
        .attr("height", 15)
        .attr("width", 15)
        .attr("fill", "grey")
        .style("opacity", 0.5);

    // text for legend
    MAIN.selectAll("mylabels")
        .data(vis1_keys)
        .enter()
        .append("text")
        .attr("x", function(d,i){ return MARGINS.left + spacing[i] + 10})
        .attr("y", MARGINS.top - 10)
        .style("fill", function(d,i){ return key_colors[i]})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("font-weight", "bold")
        .style("alignment-baseline", "middle")
        .style("font-size","12px");

    // adding another label for the rectangle
    MAIN.selectAll("mylabels")
        .data(vis1_keys)
        .enter()
        .append("text")
        .attr("x", 540 + 20)
        .attr("y", MARGINS.top - 10)
        .style("fill", "grey")
        .text("Economic Recession")
        .attr("text-anchor", "left")
        .style("font-weight", "bold")
        .style("alignment-baseline", "middle")
        .style("font-size","12px");
      
    // add a tooltip to the brushed main viz
    const TOOLTIP = d3.select("#mainvis")
                        .append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0);
      
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
    
}));
};

build_plots();