const TARGET=

document.addEventListener("DOMContentLoaded", function () {
  //var geneData = dataChinense;
  //var geneData = dataBaccatum;
  var geneData = dataAnnuum;




  var cy = cytoscape({
    container: document.getElementById("canvas"), // container to render in
    elements: geneData,
    style: [
      {
        selector: "node",
        style: {
          "background-color": "#666",
          
        },
      },
      {
        selector: "edge",
        style: {
          width: 3,
          "line-color": "#aaa",
          "curve-style": "bezier",
        },
      },
    ],
    layout: {
      name: "circle",
    },
  });

  let animation = anime({
    targets: '#canvas',
    rotate: [180, 160],
    duration: 20000,
    easing: 'easeInOutSine',
    direction: 'alternate',
    loop: true
  });


  var cy2 = cytoscape({
    container: document.getElementById("canvas2"), // container to render in
    elements: geneData,
    style: [
      {
        selector: "node",
        style: {
          "background-color": "#363",
          
        },
      },
      {
        selector: "edge",
        style: {
          width: 3,
          "line-color": "#363",
          "curve-style": "bezier",
        },
      },
    ],
    layout: {
      name: "circle",
    },
  });

  let animation2 = anime({
    targets: '#canvas2',
    rotate: [180, 200],
    duration: 20000,
    easing: 'easeInOutSine',
    direction: 'alternate',
    loop: true,
  })

  // let animation3 = anime({
  //   targets: '#canvas2'
  //   skewY: [0,-10],
  //   duration: 10000,
  //   easing: 'easeInOutSine',
  //   direction: 'alternate',
  //   loop: true
  // });

});


