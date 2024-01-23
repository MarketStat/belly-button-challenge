// Create a variable for the URL

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
let data;

// Fetch data using d3.json
d3.json(url).then((jsonData) => {
    data = jsonData;
    console.log(data);
    init();
});


function init() {
    // Select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Get sample names and populate the dropdown selector
    fillDropdown(dropdownMenu, data.names);

    // Set the first sample from the list
    let sample_one = data.names[0];
    console.log(sample_one);

    // Build the base for plots
    buildMetadata(data.metadata, sample_one);
    buildBarChart(data, sample_one);
    buildBubbleChart(data, sample_one);
    buildGaugeChart(sample_one);
}
  
  // Populate the dropdown menu with sample names
  function fillDropdown(dropdownMenu, samplenames) {
    samplenames.forEach((id) => {
      console.log(id);
      dropdownMenu.append("option")
        .text(id)
        .property("value", id);
    });
  }
  
  // Populate metadata information
  function buildMetadata(metadata, sample) {
    // Filter metadata based on the sample value
    let value = metadata.filter(result => result.id == sample);
    let valueData = value[0];

    // Clear out metadata
    d3.select("#sample-metadata").html("");

    // Add each key/value pair to the panel with bold labels
    Object.entries(valueData).forEach(([key, value]) => {
        console.log(key, value);
        d3.select("#sample-metadata").append("h5").html(`<strong>${key}:</strong> ${value}`);
    });
}

    // Build the bar chart based on sample data
    function buildBarChart(data, sample) {

        let sampleInfo = data.samples;

        let value = sampleInfo.find(result => result.id == sample);

        if (value) {
            // Extract relevant data for the chart
            let otu_ids = value.otu_ids;
            let otu_labels = value.otu_labels;
            let sample_values = value.sample_values;

            // Log the data to console
            console.log(otu_ids, otu_labels, sample_values);

            // Prepare data for the bar chart
            let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
            let xticks = sample_values.slice(0, 10).reverse();
            let labels = otu_labels.slice(0, 10).reverse();

            // Define the trace for the bar chart
            let trace = {
                x: xticks,
                y: yticks,
                text: labels.map(label => `<strong>${label}</strong>`),
                type: "bar",
                orientation: "h"
            };

            // Define the layout for the bar chart
            let layout = {
                title: `Top 10 OTUs Present in Each Individual`,
                xaxis: { title: 'Sample Values' },
                yaxis: { title: 'OTU ID' }
            };

            // Create and display the bar chart using Plotly
            Plotly.newPlot("bar", [trace], layout);
        } else {
            // Log an error message if sample data is not found
            console.error("Sample data not found for the selected sample.");
        }
    }

    // Build the bubble chart based on sample data
    function buildBubbleChart(data, sample) {
        // Extract sample information from the data
        let sampleInfo = data.samples;

        // Find the sample data for the selected sample ID
        let value = sampleInfo.find(result => result.id == sample);

        // Check if the sample data is found
        if (value) {
            // Extract relevant data for the chart
            let otu_ids = value.otu_ids;
            let otu_labels = value.otu_labels;
            let sample_values = value.sample_values;

            // Log the data to console
            console.log(otu_ids, otu_labels, sample_values);

            // Define the trace for the bubble chart
            let trace1 = {
                x: otu_ids,
                y: sample_values,
                text: otu_labels.map(label => `<strong>${label}</strong>`), // Bold labels using HTML
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Earth"
                }
            };

        // Define the layout for the bubble chart
        let layout = {
            title: { text: "Bacteria Per Sample", font: { size: 16, color: 'black', family: 'Arial, sans-serif', weight: 'bold' } },
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
            yaxis: { title: "Sample Values" }
        };

            // Create and display the bubble chart using Plotly
            Plotly.newPlot("bubble", [trace1], layout);
        } else {
            // Log an error message if sample data is not found
            console.error("Sample data not found for the selected sample.");
        }
    }

    // Build the gauge chart based on sample data
    function buildGaugeChart(sample) {
        d3.json(url).then((data) => {
            const metadata = data.metadata;
            const [result] = metadata.filter(sampleObj => sampleObj.id == sample);
            const washFreq = result ? result.wfreq : 0;
    
            const gaugeTrace = [
                {
                    domain: { x: [0, 1], y: [0, 1] },
                    value: washFreq,
                    title: { text: "Belly Button Washing Frequency <br> Scrubs per Week", font: { size: 18 } },
                    type: "indicator",
                    mode: "gauge+number",
                    gauge: {
                        axis: { range: [null, 10] },
                        bar: { color: "steelblue" },
                        steps: [
                            { range: [0, 1], color: 'rgba(0, 0, 255, 0.5)' },
                            { range: [1, 2], color: 'rgba(0, 0, 255, 0.5)' },
                            { range: [2, 3], color: 'rgba(183,28,255, .5)' },
                            { range: [3, 4], color: 'rgba(183,28,255, .5)' },
                            { range: [4, 5], color: 'rgba(249, 168, 255, .5)' },
                            { range: [5, 6], color: 'rgba(249, 168, 255, .5)' },
                            { range: [6, 7], color: 'rgba(110, 154, 255, .5)' },
                            { range: [7, 8], color: 'rgba(110, 154, 255, .5)' },
                            { range: [8, 9], color: 'rgba(14, 127, 255, .5)' },
                            { range: [9, 10], color: 'rgba(14, 127, 255, .5)' }
                        ],
                    }
                }
            ];
    
            const gaugeLayout = {
                width: 600,
                height: 500,
                margin: { t: 0, b: 0 }
            };
    
            Plotly.newPlot('gauge', gaugeTrace, gaugeLayout);
        });
    }

    function optionChanged(value) { 
        console.log(value); 
        buildMetadata(data.metadata, value);
        buildBarChart(data, value);
        buildBubbleChart(data, value);
        buildGaugeChart(value);
    }

init();