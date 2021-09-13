const TARGET_ID = "target"
const SKELETAL_COLOR = "#aaa"

// Annuum
const BIRTHDAY_OF_MONTH = 1;
const DAYS_TO_RIPEN = 20;
const GROWTH_SPEED = 8022;
const FRUIT_HEIGHT = 7.6; //cm
const NEWBORN_COLOR = "#063813";
const RIPE_COLOR = "#fa4208";

var cyto1, cyto2;

let currentColor = RIPE_COLOR;
let currentSkeletalColor = NEWBORN_COLOR;

document.addEventListener("DOMContentLoaded", function () {

  //var geneData = dataChinense;
  //var geneData = dataBaccatum;
  const geneData = dataAnnuum;

  let dayOfMonth = (new Date()).getDate();

  const params = window.location.search.split("?day=")
  if(params.length==2) dayOfMonth = parseInt(params[1]);

  currentColor = RIPE_COLOR;
  currentSkeletalColor = NEWBORN_COLOR;

  if(dayOfMonth>=BIRTHDAY_OF_MONTH && dayOfMonth<=(BIRTHDAY_OF_MONTH+DAYS_TO_RIPEN)){
    var ripeningGradient = tinygradient(NEWBORN_COLOR,RIPE_COLOR);
    var ripeningColors = ripeningGradient.rgb(DAYS_TO_RIPEN);
    currentColor = '#'+ripeningColors[dayOfMonth-1].toHex();

    var skeletalGradient = tinygradient(SKELETAL_COLOR,NEWBORN_COLOR);
    var skeletalColors = skeletalGradient.rgb(DAYS_TO_RIPEN);
    currentSkeletalColor = '#'+skeletalColors[dayOfMonth-1].toHex();
  }

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
  graph1.addEventListener('mousedown', function (event) {
    event.stopPropagation();
  });
  container.appendChild(graph1)

  const graph2 = document.createElement('div');
  graph2.setAttribute("id","graph2")
  graph2.style.boxSizing="border-box";
  graph2.style.width="100%";
  graph2.style.flex="none";
  graph2.style.marginLeft="-100%";
  graph2.style.borderRadius="100%";
  graph2.addEventListener('mousedown', function (event) {
    event.stopPropagation();
  });
  container.appendChild(graph2)

  // Display the graphs
  cyto1 = cytoscape({
    container: document.getElementById("graph1"),
    elements: geneData,
    style: [
      {
        selector: "node",
        style: {
          "background-color": currentSkeletalColor,
          events: "no"
        },
      },
      {
        selector: "edge",
        style: {
          width: 3,
          "line-color": currentSkeletalColor,
          "curve-style": "bezier",
          events: "no"
        },
      },
      {
        selector: 'core',
        style: {
          'active-bg-size': 0
        }
      }
    ],
    layout: {
      name: "circle",
    },
  });

  cyto1.userPanningEnabled(false);
  cyto1.userZoomingEnabled(false);
  cyto1.boxSelectionEnabled(false);

  const startRotation = randomIntFromInterval(0,360);
  plant("#graph1",startRotation,1);
  setTimeout(function(){grow();}, GROWTH_SPEED+randomIntFromInterval(1000,5000));

  cyto2 = cytoscape({
    container: document.getElementById("graph2"), // container to render in
    elements: geneData,
    style: [
      {
        selector: "node",
        style: {
          "background-color": currentColor,
          events: "no"
        },
      },
      {
        selector: "edge",
        style: {
          width: 3,
          "line-color": currentColor,
          "curve-style": "bezier",
          events: "no"
        },
      },
      {
        selector: 'core',
        style: {
          'active-bg-size': 0
        }
      }
    ],
    layout: {
      name: "circle",
    },
  });

  plant("#graph2",startRotation,-1);

  cyto2.removeAllListeners();
  cyto2.userPanningEnabled(false);
  cyto2.userZoomingEnabled(false);
  cyto2.boxSelectionEnabled(false);
  cyto2.autounselectify(true);

  cyto2.off('background.*');
  cyto2.off('style.*');
  cyto2.off('bounds.*');
  cyto2.off('dirty.*');
  cyto2.off('mousedown');
  cyto2.off('click');

  document.getElementById("graph1").addEventListener('mousedown', function(event) {
    event.stopImmediatePropagation();
  });
  
  document.getElementById("graph2").addEventListener('mousedown', function(event) {
    event.stopImmediatePropagation();
  });
});



function plant(target, startRotation, n){
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
    duration: swingSpeed/3,
    easing: 'easeInOutSine',
    complete: function(){swing(target, startRotation, swingSpeed, n)}
  });
}

function swing(target, startRotation, swingSpeed, n){
  anime({
    targets: target,
    rotate: [startRotation+(10*n),startRotation-(10*n)],
    duration: swingSpeed/2,
    easing: 'easeInOutSine',
    direction: 'alternate',
    loop: true
  });
}

function grow(){
  const geneFeatures = [
    "exon",
    "gene",
    "CDS",
    "mRNA"
  ]
  growthEvent(geneFeatures[randomIntFromInterval(0,3)]);
  setTimeout(function(){
    grow();
  }, (GROWTH_SPEED/10)*randomIntFromInterval(1,20));
}

function growthEvent(geneFeature){
  cyto1.nodes("#"+geneFeature)[0].connectedEdges().animate({
    style: {lineColor: RIPE_COLOR, width: 6}
  })
  setTimeout(function(){
    cyto1.nodes("#"+geneFeature)[0].connectedEdges().animate({
      style: {lineColor: currentSkeletalColor, width: 3}
    })
  }, randomIntFromInterval(1000,3000));
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}


