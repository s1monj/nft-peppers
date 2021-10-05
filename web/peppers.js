const TOKEN_ID_START = 1001;
const TARGET_ID = "pepperPot";

const SPECIES = ["Capsicum annuum", "Capsicum baccatum", "Capsicum chinense"];
const FARMERS_NAME = ["Red Pepper", "Yellow Pepper", "Orange Pepper"];
const BIRTHDAY_OF_MONTH = [1, 1, 1];
const DAYS_TO_RIPEN = [21, 23, 26];
const GROWTH_DENOMINATOR = [9012, 9188, 9766];
const FRUIT_HEIGHT = [7.6, 5.1, 6.3];
const NEWBORN_COLOR = ["#063813", "#2f4812", "#49711c"];
const RIPE_COLOR = ["#fa4208", "#f2f285", "#ff8e00"];
const SKELETAL_COLOR = ["#aaa", "#999", "#ccc"];
const SKELETAL_WIDTH = [1, 2, 2];
const BGCOLOR = ["#fcf5e5", "#fcf5e5", "#fcf5e5"];

var seqNum, tokenId, cyto1, cyto2, currentColor, currentSkeletalColor;
var seqNum = 0;

document.addEventListener("DOMContentLoaded", function () {
  
  let tokenIdParam = getParameterByName("tokenId");
  if(tokenIdParam){
    tokenIdParam = parseInt(tokenIdParam);
    if(tokenIdParam && tokenIdParam>=TOKEN_ID_START && tokenIdParam<=(TOKEN_ID_START+SPECIES.length-1)) seqNum = tokenIdParam;
  }

  if(!seqNum) seqNum = TOKEN_ID_START;
  seqNum = seqNum-TOKEN_ID_START;
  
  setTimeout(function () {
    window.document.dispatchEvent(new Event("DOMContentLoaded", {
      bubbles: true,
      cancelable: true
    }));
  }, 1000*60*60);

  document.title = `${SPECIES[seqNum]} (${FARMERS_NAME[seqNum]})`;
  document.body.style.background = BGCOLOR[seqNum];
  var genomicData = [dataChinense, dataBaccatum, dataAnnuum];

  let now = new Date();
  let dayOfMonth = now.getDate();
  if(getParameterByName("day")) dayOfMonth = parseInt(getParameterByName("day"));

  let hourOfDay = now.getHours();
  if(getParameterByName("hour")) hourOfDay = parseInt(getParameterByName("hour"));
  if(hourOfDay>23) hourOfDay = 23;
  if(hourOfDay<1) hourOfDay = 1;

  currentColor = RIPE_COLOR[seqNum];
  currentSkeletalColor = NEWBORN_COLOR[seqNum];

  if (
    dayOfMonth >= BIRTHDAY_OF_MONTH[seqNum] &&
    dayOfMonth < BIRTHDAY_OF_MONTH[seqNum] + DAYS_TO_RIPEN[seqNum]
  ) {
    var ripeningGradient = tinygradient(NEWBORN_COLOR[seqNum], RIPE_COLOR[seqNum]);
    var ripeningColors = ripeningGradient.rgb(DAYS_TO_RIPEN[seqNum]*24);
    currentColor = "#" + ripeningColors[((dayOfMonth - 1)*24)+hourOfDay].toHex();

    var skeletalGradient = tinygradient(SKELETAL_COLOR[seqNum], NEWBORN_COLOR[seqNum]);
    var skeletalColors = skeletalGradient.rgb(DAYS_TO_RIPEN[seqNum]*24);
    currentSkeletalColor = "#" + skeletalColors[((dayOfMonth - 1)*24)+hourOfDay].toHex();
  }

  const target = document.getElementById(TARGET_ID);
  const container = document.createElement("div");
  container.setAttribute("id", "container");
  container.style.height = "100%";
  container.style.width = "100%";
  container.style.backgroundColor = BGCOLOR[seqNum];
  container.style.display = "flex";
  container.style.flexFlow = "row nowrap";
  target.appendChild(container);

  const graph1 = document.createElement("div");
  graph1.setAttribute("id", "graph1");
  graph1.style.boxSizing = "border-box";
  graph1.style.width = "100%";
  graph1.style.flex = "none";
  graph1.style.borderRadius = "100%";
  graph1.addEventListener("mousedown", function (event) {
    event.stopPropagation();
  });
  container.appendChild(graph1);

  const graph2 = document.createElement("div");
  graph2.setAttribute("id", "graph2");
  graph2.style.boxSizing = "border-box";
  graph2.style.width = "100%";
  graph2.style.flex = "none";
  graph2.style.marginLeft = "-100%";
  graph2.style.borderRadius = "100%";
  graph2.addEventListener("mousedown", function (event) {
    event.stopPropagation();
  });
  container.appendChild(graph2);

  cyto1 = cytoscape({
    container: document.getElementById("graph1"),
    elements: genomicData[seqNum],
    style: [
      {
        selector: "node",
        style: {
          "background-color": currentSkeletalColor,
          events: "no",
        },
      },
      {
        selector: "edge",
        style: {
          width: SKELETAL_WIDTH[seqNum],
          "line-color": currentSkeletalColor,
          "curve-style": "bezier",
          events: "no",
        },
      },
      {
        selector: "core",
        style: {
          "active-bg-size": 0,
        },
      },
    ],
    layout: {
      name: "circle",
    },
  });

  cyto1.userPanningEnabled(false);
  cyto1.userZoomingEnabled(false);
  cyto1.boxSelectionEnabled(false);

  const startRotation = randomIntFromInterval(0, 360);
  plant("#graph1", startRotation, 1);
  setTimeout(function () {
    grow();
  }, GROWTH_DENOMINATOR[seqNum] + randomIntFromInterval(1000, 5000));

  cyto2 = cytoscape({
    container: document.getElementById("graph2"),
    elements: genomicData[seqNum],
    style: [
      {
        selector: "node",
        style: {
          "background-color": currentColor,
          events: "no",
        },
      },
      {
        selector: "edge",
        style: {
          width: SKELETAL_WIDTH[seqNum],
          "line-color": currentColor,
          "curve-style": "bezier",
          events: "no",
        },
      },
      {
        selector: "core",
        style: {
          "active-bg-size": 0,
        },
      },
    ],
    layout: {
      name: "circle",
    },
  });

  plant("#graph2", startRotation, -1);

  cyto2.removeAllListeners();
  cyto2.userPanningEnabled(false);
  cyto2.userZoomingEnabled(false);
  cyto2.boxSelectionEnabled(false);
  cyto2.autounselectify(true);
  cyto2.off("background.*");
  cyto2.off("style.*");
  cyto2.off("bounds.*");
  cyto2.off("dirty.*");
  cyto2.off("mousedown");
  cyto2.off("click");

  document
    .getElementById("graph1")
    .addEventListener("mousedown", function (event) {
      event.stopImmediatePropagation();
    });

  document
    .getElementById("graph2")
    .addEventListener("mousedown", function (event) {
      event.stopImmediatePropagation();
    });
});

function plant(target, startRotation, n) {
  anime({
    targets: target,
    rotate: startRotation,
    duration: 1,
    easing: "easeInOutSine",
    complete: function () {
      skew(target, startRotation, n);
    },
  });
}

function skew(target, startRotation, n) {
  const skew = FRUIT_HEIGHT[seqNum] * randomIntFromInterval(0.5, 5) * n;
  anime({
    targets: target,
    skew: [skew, 0],
    duration: GROWTH_DENOMINATOR[seqNum] / 2 + randomIntFromInterval(100, 200),
    complete: function () {
      startSwing(target, startRotation, n);
    },
  });
}

function startSwing(target, startRotation, n) {
  const swingSpeed = GROWTH_DENOMINATOR[seqNum] * 2 + randomIntFromInterval(100, 1000);
  anime({
    targets: target,
    rotate: [startRotation, startRotation + 10 * n],
    duration: swingSpeed / 3,
    easing: "easeInOutSine",
    complete: function () {
      swing(target, startRotation, swingSpeed, n);
    },
  });
}

function swing(target, startRotation, swingSpeed, n) {
  anime({
    targets: target,
    rotate: [startRotation + 10 * n, startRotation - 10 * n],
    duration: swingSpeed / 2,
    easing: "easeInOutSine",
    direction: "alternate",
    loop: true,
  });
}

function grow() {
  const geneFeatures = ["exon", "gene", "CDS", "mRNA"];
  growthEvent(geneFeatures[randomIntFromInterval(0, 3)]);
  setTimeout(function () {
    grow();
  }, (GROWTH_DENOMINATOR[seqNum] / 10) * randomIntFromInterval(1, 20));
}

function growthEvent(geneFeature) {
  cyto1
    .nodes("#" + geneFeature)[0]
    .connectedEdges()
    .animate({
      style: { lineColor: RIPE_COLOR[seqNum], width: SKELETAL_WIDTH[seqNum] * 2 },
    });
  setTimeout(function () {
    cyto1
      .nodes("#" + geneFeature)[0]
      .connectedEdges()
      .animate({
        style: { lineColor: currentSkeletalColor, width: SKELETAL_WIDTH[seqNum] },
      });
  }, randomIntFromInterval(1000, 3000));
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
