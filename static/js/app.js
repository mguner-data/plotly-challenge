// Read JSON file 
function bar_bubblePlots(sample) {
d3.json("samples.json").then((importedData) => {
    // console.log(importedData);
    const data = importedData;
        console.log(data);
    const samples = data.samples
    const filterArray = samples.filter(sampleObject => sampleObject.id == sample);
    const result = filterArray[0];
    const otuIDs = result.otu_ids.slice(0,10);
        console.log(otuIDs);
    const sampleValues =  result.sample_values.slice(0,10);
        console.log(sampleValues)
    const labels =  result.otu_labels.slice(0,10);
        console.log (labels)
    const ylabels = otuIDs.map((item, index)=> {
        const genus = labels[index].split(";").reverse()[0];
        return `${item} ${genus}`
    })
       const bar1trace1 = {
            x: sampleValues,
            y: ylabels,
            //text:
            //
            type: "bar",
            orientation: "h"}
        const barlayout ={title: `Top 10 Bacteria - Subject ${sample} `,
        showlegend: false,
        autosize: true,
        margin: {
            l: 150,
            r: 0,
            t: 100,
            b: 30
        }
}
    Plotly.newPlot("bar1", [bar1trace1],barlayout);

    const otuIDs2 = result.otu_ids;
    const sampleValues2 =  result.sample_values
    const labels2 =  result.otu_labels
    const xlabels2 = {}
        labels.map((item, index)=> {
        let family = item.split(";");
        const familyindex = family.length
        if (familyindex >= 6){
            family = family.slice(0,familyindex-1).join(";")
            
        }
        else {
            family = family.join(";")
        }

        if (xlabels2[family]){
            xlabels2[family]+=sampleValues2[index]
        }
        else {
            xlabels2[family]=sampleValues2[index] 
        }
    })
    console.log(xlabels2)
    //Bubble map 
        var trace1 = {
            x: Object.values(xlabels2),
            y: Object.keys(xlabels2),
            mode: 'markers',
            marker: {
            size: sampleValues2
            }
          };
          
          var bubbledata = [trace1];
          
          var layout = {
            title: `Count of Bacteria by Family - Subject ${sample}`,
            showlegend: false,
            autosize: true,
            margin: {
                l: 500,
                r: 100,
                //t: 100,
                //b: 30
            }
            
          };
           
          Plotly.newPlot('bubble', bubbledata, layout);
})
}
// Filling Demographics Data
function fillTable(sample) {
    // read the json file to get data
        d3.json("samples.json").then((data2)=> {
    // get the metadata info for the demographic panel
            const metadata = data2.metadata;
    
            console.log(metadata)
    
          // filter meta data info by id
           const filterArray = metadata.filter(meta => meta.id == sample);
           const result2 = filterArray[0]
          // select demographic panel to put data
           const demographicInfo = d3.select("#sample-metadata");
            
         // empty the demographic info panel each time before getting new id info
           demographicInfo.html("");
    
         // grab the necessary demographic data data for the id and append the info to the panel
            Object.entries(result2).forEach((key1) => {   
                demographicInfo.append("h5").text(key1[0] + ": " + key1[1] + "\n");    
            });
        });
    }
    

function optionChanged(sample) {
    bar_bubblePlots(sample);
    fillTable(sample);
}

function init() {
    // Select the dropdown element
    const dropdown = d3.select("#selDataset");
    
    // Populate the dropdown with subject ID's from the list of sample Names
      d3.json("samples.json").then((data3) => {
        
        data3.names.forEach((name) => {
        
       dropdown.append("option")
          .text(name)
          .property("value", name);
        });
      
  
    
      bar_bubblePlots(data3.names[0]);
      fillTable(data3.names[0]);
    });
  }
  init();
  