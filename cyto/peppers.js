const TARGET_ID = "target"

const GROWTH_SPEED = 10000;
const FRUIT_HEIGHT = 7.6; //cm
const BIRTHDAY_OF_MONTH = 3;

document.addEventListener("DOMContentLoaded", function () {

  //var geneData = dataChinense;
  //var geneData = dataBaccatum;
  const geneData = dataAnnuum;

  // Build the stage
  // Implement in JS so there's no depenedency on html or css
  const target = document.getElementById(TARGET_ID);

  const container = document.createElement('div');
  container.setAttribute("id","container");
  container.style.height="100%";
  container.style.width="100%";
  container.style.backgroundColor="#FCF5E5";
  container.style.display="flex";
  container.style.flexFlow="row nowrap";
  target.appendChild(container);

  // Overlay without absolute positioning:
  // https://stackoverflow.com/a/48877138/4338238

  const graph1 = document.createElement('div');
  graph1.setAttribute("id","graph1")
  graph1.style.boxSizing="border-box";
  graph1.style.width="100%";
  graph1.style.flex="none";
  graph1.style.borderRadius="100%";
  container.appendChild(graph1)

  const graph2 = document.createElement('div');
  graph2.setAttribute("id","graph2")
  graph2.style.boxSizing="border-box";
  graph2.style.width="100%";
  graph2.style.flex="none";
  graph2.style.marginLeft="-100%";
  graph2.style.borderRadius="100%";
  container.appendChild(graph2)

  // Display the graphs
  const cyto1 = cytoscape({
    container: document.getElementById("graph1"),
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

  const startRotation = randomIntFromInterval(0,360);
  grow("#graph1",startRotation,1)

  const cyto2 = cytoscape({
    container: document.getElementById("graph2"), // container to render in
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

  grow("#graph2",startRotation,-1)

});

function grow(target, startRotation, n){
  anime({
    targets: target,
    rotate: startRotation,
    duration: 1,
    easing: 'easeInOutSine',
    complete: function(){ skew(target, startRotation, n) }
  });
}

function skew(target, startRotation, n){
  const skew = FRUIT_HEIGHT*randomIntFromInterval(0.5,5)*n;
  anime({
    targets: target,
    skew: [skew,0],
    duration: (GROWTH_SPEED/2)+randomIntFromInterval(100,200),
    complete: function(){startSwing(target, startRotation, n);}
  });
}

function startSwing(target, startRotation, n){
  const swingSpeed = (GROWTH_SPEED*2)+randomIntFromInterval(100,1000);
  anime({
    targets: target,
    rotate: [startRotation, startRotation+(10*n)],
    duration: swingSpeed/5,
    easing: 'easeInOutSine',
    complete: function(){swing(target, startRotation, swingSpeed, n)}
  });
}

function swing(target, startRotation, swingSpeed, n){
  anime({
    targets: target,
    rotate: [startRotation+(10*n),startRotation-(10*n)],
    duration: swingSpeed/5.5,
    easing: 'easeInOutSine',
    direction: 'alternate',
    loop: true
  });
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}


