const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"


let selectOption = d3.select("#selDataset");
let selectDemographic = d3.select("#sample-metadata")
let result;
const sample = d3.json(url).then(function(data){
    console.log("Belly button samples: ", data)  
    let names = data.names;
    for ( let i = 0; i < names.length; i++){
        selectOption.append("option").text(names[i]).property("value", names[i]);
    }
    result = data;

 });


 function barChart(sampleValues, otuIds, otuLabels){
    let data = [{
        x: sampleValues,
        y: otuIds,
        text: otuLabels,
        marker : {size:8},
        type: "bar",
        orientation: 'h'
    }];

    Plotly.newPlot("bar", data)
 }

 function getMarkerSize(sampleValues){
    let size = sampleValues.map(function(data){
        return data / 2;
    })
    return size;
}

 function bubblePlot(otuIds, sampleValues, otuLabels){
    let data = [{
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode :'markers',
        marker: {
            color: otuIds, 
            size: getMarkerSize(sampleValues),
            showscale: true,
            colorscale: 'Earth'
        }  
    }];
    Plotly.newPlot('bubble', data)
 };

 function displayMetadata(metadata){
    selectDemographic.selectAll("*").remove();
    selectDemographic.append('span').text(`id : ${metadata.id}`);
    selectDemographic.append('br');
    selectDemographic.append('span').text(`ethnicity : ${metadata.ethnicity}`);
    selectDemographic.append('br');
    selectDemographic.append('span').text(`gender : ${metadata.gender}`);
    selectDemographic.append('br');
    selectDemographic.append('span').text(`age : ${metadata.age}`);
    selectDemographic.append('br');
    selectDemographic.append('span').text(`location : ${metadata.location}`);
    selectDemographic.append('br');
    selectDemographic.append('span').text(`bbtype : ${metadata.bbtype}`);
    selectDemographic.append('br');
    selectDemographic.append('span').text(`wfreq : ${metadata.wfreq}`);
 }

function onOptionChange(value) {
    let samples = result.samples;
    let metadata = result.metadata;
    let selected = samples.filter(function(data){
        return data.id === value;
    })[0]
    let selectedMetadata = metadata.filter(function(data){
         return data.id === parseInt(value);
    })[0]
    // console.log(filtered);
    // let index = result.names.indexOf(value);
    // let selected = samples[index];
    let topIds = selected.otu_ids.slice(0, 10)
        .map(function(otu) { return "OTU " + otu });
    let topValues = selected.sample_values.slice(0, 10);
    let otuLabel = selected.otu_labels.slice(0, 10);
    barChart(topValues.reverse(), topIds, otuLabel );
    bubblePlot( selected.otu_ids, selected.sample_values, otuLabel)
    displayMetadata(selectedMetadata)

}
