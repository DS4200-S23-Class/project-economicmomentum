
    
    // constants for plot design
    const DETAIL_FRAME_HEIGHT = 225;
    const DETAIL_FRAME_WIDTH = 350; 
    const DETAIL_MARGINS = {left: 25, right: 25, top: 25, bottom: 25};

    const DETAIL_VIS_HEIGHT = DETAIL_FRAME_HEIGHT - DETAIL_MARGINS.top - DETAIL_MARGINS.bottom;
    const DETAIL_VIS_WIDTH = DETAIL_FRAME_WIDTH - DETAIL_MARGINS.left - DETAIL_MARGINS.right; 


    //setting scales
    const DetailXScale = d3.scaleTime() 
                      .domain(domain) 
                      .range([0, DETAIL_VIS_WIDTH]); 

    const DetailYScale = d3.scaleLinear() 
                      .domain([MaxPayroll, 0])  
                      .range([0, DETAIL_VIS_HEIGHT]); 

    const DETAIL = d3.select("#detailgraph")
                  .append("svg")
                    .attr("id", "length")
                    .attr("height", DETAIL_FRAME_HEIGHT)
                    .attr("width", DETAIL_FRAME_WIDTH)
                    .attr("class", "frame"); 

    // plot payroll counts
    const payrolls_DETAIL = DETAIL.append('path')
                            .datum(data) // passed from .then  
                            .attr("d", d3.line()
                                .x((d) => {return DETAIL_MARGINS.left + DetailXScale(d.DATE)})
                                .y((d) => {return DetailYScale(d.Payrolls) + DETAIL_MARGINS.top}))
                            .attr("class", "payrolldetailline"); 

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
        .call(d3.axisLeft(DetailYScale).ticks(4))
          .attr("font-size", '10px'); 