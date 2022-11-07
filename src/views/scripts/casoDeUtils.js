

function init() {
    if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
    var $ = go.GraphObject.make;  // for conciseness in defining templates

    myDiagram =
        $(go.Diagram, "myDiagramDiv",  // must name or refer to the DIV HTML element
            { layout: $(go.LayeredDigraphLayout, { layeringOption: go.LayeredDigraphLayout.LayerLongestPathSource }) });





    // define the Node template
    myDiagram.nodeTemplate =
        $(go.Node, "Spot",
            { locationObjectName: "ICON", locationSpot: go.Spot.Center },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            { selectionObjectName: "ICON" },
            // define the node primary shape
            $(go.Shape, "RoundedRectangle",
                {
                    name: "ICON",
                    parameter1: 10,  // the corner has a medium radius
                    desiredSize: new go.Size(80, 55),
                    fill: $(go.Brush, "Linear", { 0: "rgb(254, 201, 0)", 1: "rgb(254, 162, 0)" }),
                    stroke: "black",
                    portId: "",
                    cursor: "pointer"
                }),
            $(go.Shape,  // provide interior area where the user can grab the node
                { fill: "transparent", stroke: null, desiredSize: new go.Size(30, 30) }),
            $(go.TextBlock,
                {
                    font: "bold 11pt helvetica, bold arial, sans-serif",
                    editable: true,  // editing the text automatically updates the model data
                    _isNodeLabel: true,
                    cursor: "move"  // visual hint that the user can do something with this node label
                },
                new go.Binding("text", "text").makeTwoWay(),
                // The GraphObject.alignment property is what the NodeLabelDraggingTool modifies.
                // This TwoWay binding saves any changes to the same named property on the node data.
                new go.Binding("alignment", "alignment", go.Spot.parse).makeTwoWay(go.Spot.stringify)
            )
        );




    // replace the default Link template in the linkTemplateMap
    myDiagram.linkTemplate =
        $(go.Link,  // the whole link panel
            { curve: go.Link.Bezier, adjusting: go.Link.Stretch, reshapable: true },
            new go.Binding("points").makeTwoWay(),
            new go.Binding("curviness", "curviness"),
            $(go.Shape,  // the link shape
                { strokeWidth: 1.5 }),
            $(go.Shape,  // the arrowhead
                { toArrow: "standard", stroke: null }),
            $(go.Panel, "Auto",
                $(go.Shape,  // the label background, which becomes transparent around the edges
                    {
                        fill: $(go.Brush, "Radial",
                            { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" }),
                        stroke: null
                    }),
                $(go.TextBlock, "transition",  // the label text
                    {
                        textAlign: "center",
                        font: "10pt helvetica, arial, sans-serif",
                        stroke: "black",
                        margin: 4,
                        editable: true  // editing the text automatically updates the model data
                    },
                    new go.Binding("text", "text").makeTwoWay())
            )
        );

    // read in the JSON-format data from the "mySavedModel" element
    load();
}

// Show the diagram's model in JSON format
function save() {
    document.getElementById("mySavedModel").value = myDiagram.model.toJson();
    myDiagram.isModified = false;
}

function load() {

    var links = []
    nodes.forEach((node) => {
        node.text = node.numReq
        if (node.condicoes[0].condicao != "*") {

            node.condicoes.forEach((condicao) => {

                links.push({ from: condicao.id_requisitos_funcionais, to: condicao.id_requisitos_funcionais1, text: condicao.condicao })

            })
        }
    })
    nodes.forEach((node) => {
        let search = links.find((link) => node.id == link.to)
        if (!search) {
            links.push({ from: 0, to: node.id, text: '' })
        }
  
    })
    nodes.push({ id: 0, text: 'actor' })

    myDiagram.model = go.Model.fromJson({
        "class": "go.GraphLinksModel",
        "nodeKeyProperty": "id",
        "nodeDataArray": nodes,
        "linkDataArray": links
    });
}
window.addEventListener('DOMContentLoaded', init);