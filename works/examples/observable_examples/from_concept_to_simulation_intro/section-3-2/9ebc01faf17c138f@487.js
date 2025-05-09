// https://observablehq.com/@ferrari212/section-3-2-gui-controller-interface-list@487
function _1(md){return(
md`
# Section 3.2 - GUI controller interface - Check Box List
`
)}

function* _2(THREE,scene,width,invalidation)
{
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.toneMapping = THREE.ReinhardToneMapping;
  renderer.toneMappingExposure = 2.3;

  scene.background = new THREE.Color(0xA9CCE3);

  const height = 600;
  const aspect = width / height;
  const camera = new THREE.PerspectiveCamera(50, aspect);
  camera.up.set(0, 0, 1);
  scene.add(camera);
  camera.position.set(30, 20, 20);

  function onWindowResize() {
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onWindowResize);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target = new THREE.Vector3(0, 0, 0);
  controls.update();
  invalidation.then(() => renderer.dispose());
  renderer.setSize(width, height);
  renderer.setPixelRatio(devicePixelRatio);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  const mainLight = new THREE.DirectionalLight(0xffffff, 1);
  mainLight.position.set(1, 1, 1);
  scene.add(ambientLight, mainLight);

  var animate = function() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };
  animate();
  yield renderer.domElement;
}


function _3(html,loaderPecentage){return(
html`
<svg width="800" height="50">
  <rect x="0" y="0" width="1000" height ="50" fill="grey" />
  <rect x="0" y="0" width="${loaderPecentage *
    8}" height ="50" fill="rgb(13, 18, 125)" />
<svg>
`
)}

function _4(md,loaderPecentage){return(
md`####  *The 3D model is* <span style="color:rgb(13, 18, 125)"> ${loaderPecentage |
  0}% </span> *loaded*`
)}

function _5(md){return(
md`
The model above represents the final format developted in this section with the insertion of check box list that allows certains groups of elements being displayed or not. In this section, it will explained each step for creating a check box list which allows this interaction.
`
)}

function _6(md){return(
md`
### <span style="color:rgb(13, 18, 125)"> Product Hierarchy 
The system engineering best practices suggest a separation of the system into a product hierarchy to group different parts. The approach helps to identify the different stakeholders addressed to the specific subsystem and to manage each subsystem as a product of its own **[1]**. 

In software engineering the grouping of the system helps to contextualize the different functionalities of the ship depending of users needs. For example, a professional responsible for controlling the ship stability may be interested just on the distribution of the weights in each tank and the consumption of the fuel, for other hand, a user responsible for tracking the structural integrity of the ship may be interested only on the structural elements and the visualization of each particular tank could be suppressed.

[Vessel.js](https://shiplab.github.io/vesseljs/) lybrary currently group the systems in four main subsystems in the first tear: Structure, Decks, Tanks and Machinery. The Structure is then separeted into Deck and Bulkheads. The hierarchy graph bellow helps to depict the organization of the structure. 
`
)}

function _chart3(root,dy,d3,margin,width,dx,tree2,diagonal)
{
  root.x0 = dy / 2;
  root.y0 = 0;
  root.descendants().forEach((d, i) => {
    d.id = i;
    d._children = d.children;
    if (d.depth && d.data.name.length !== 7) d.children = null;
  });

  const svg = d3
    .create("svg")
    .attr("viewBox", [-margin.left, -margin.top, width, dx])
    .style("font", "10px sans-serif")
    .style("user-select", "none");

  const gLink = svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.2);

  const gNode = svg
    .append("g")
    .attr("cursor", "pointer")
    .attr("pointer-events", "all");

  function update(source) {
    const duration = d3.event && d3.event.altKey ? 2500 : 250;
    const nodes = root.descendants().reverse();
    const links = root.links();

    // Compute the new tree layout.
    tree2(root);

    let left = root;
    let right = root;
    root.eachBefore(node => {
      if (node.x < left.x) left = node;
      if (node.x > right.x) right = node;
    });

    const height = right.x - left.x + margin.top + margin.bottom;

    const transition = svg
      .transition()
      .duration(duration)
      .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
      .tween(
        "resize",
        window.ResizeObserver ? null : () => () => svg.dispatch("toggle")
      );

    // Update the nodes…
    const node = gNode.selectAll("g").data(nodes, d => d.id);

    // On mouse atempt
    function dist2(a, b) {
      return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
    }
    node.on("mousemove", function() {
      const m = d3.mouse(this);
      const leaf = node.data()[
        d3.scan(node.data().map(d => dist2([d.y, d.x], m)))
      ];

      let d = root
        .links()
        .filter(d => d.target === leaf)
        .pop().target;
      const path = [];

      do {
        path.push(d.data);
      } while ((d = d.parent));

      node.classed("highlight", d => path.indexOf(d.data) > -1);
      node.classed("leaf", d => path.indexOf(d.data) === 0);
      link.classed("highlight", d => path.indexOf(d.target.data) > -1);

      svg.node().value = path;
      svg.node().dispatchEvent(new CustomEvent("input"));
    });

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node
      .enter()
      .append("g")
      .attr("transform", d => `translate(${source.y0},${source.x0})`)
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0)
      .on("click", d => {
        d.children = d.children ? null : d._children;
        update(d);
      });

    nodeEnter
      .append("circle")
      .attr("r", 2.5)
      .attr("fill", d => (d._children ? "#555" : "#999"))
      .attr("stroke-width", 10);

    nodeEnter
      .append("text")
      .attr("dy", "0.31em")
      .attr("x", d => (d._children ? -6 : 6))
      .attr("text-anchor", d => (d._children ? "end" : "start"))
      .text(d => d.data.name)
      .clone(true)
      .lower()
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      .attr("stroke", "white");

    // Transition nodes to their new position.
    const nodeUpdate = node
      .merge(nodeEnter)
      .transition(transition)
      .attr("transform", d => `translate(${d.y},${d.x})`)
      .attr("fill-opacity", 1)
      .attr("stroke-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    const nodeExit = node
      .exit()
      .transition(transition)
      .remove()
      .attr("transform", d => `translate(${source.y},${source.x})`)
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0);

    // Update the links…
    const link = gLink.selectAll("path").data(links, d => d.target.id);

    // Enter any new links at the parent's previous position.
    const linkEnter = link
      .enter()
      .append("path")
      .attr("d", d => {
        const o = { x: source.x0, y: source.y0 };
        return diagonal({ source: o, target: o });
      });

    // Transition links to their new position.
    link
      .merge(linkEnter)
      .transition(transition)
      .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link
      .exit()
      .transition(transition)
      .remove()
      .attr("d", d => {
        const o = { x: source.x, y: source.y };
        return diagonal({ source: o, target: o });
      });

    // Stash the old positions for transition.
    root.eachBefore(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  update(root);

  return svg.node();
}


function _8(md){return(
md`
On each element was add the information about the group which is insert as exemplified bellow by the Deck A affiliation. This information helps to identify which elements must have its functionalities suppressed according to the user interaction.
`
)}

function _9(Gunnerus){return(
Gunnerus.structure.decks.Deck_A.affiliations.group
)}

function _10(md){return(
md`

### <span style="color:rgb(13, 18, 125)"> Adjusting the GUI

Similar to [Section 3.1](../section-3-1/index.html), the first step is adding a new folder which the controller will be allocated by the function <code>gui.addFolder()</code>, notice this time the constants which holds the scale interfaces are different with <code>scale_check_box</code> for check box and <code>scale_visualization</code> for the visualization:
`
)}

function _scale_check_box(gui){return(
gui.addFolder("Check Box List")
)}

function _12(md){return(
md`
The <code>modelStyle</code> must be modified in a way it comprehend the display of the boxes:
`
)}

function _modelStyle()
{
  const modelStructure = {
    model: "Ship3D",
    displayOutline: true
  };

  return modelStructure;
}


function _14(md){return(
md`
### <span style="color:rgb(13, 18, 125)"> Functions for Check Box List

When the check box is setted to a specific subsystem the user must not be able to have whatever interaction with the elements in the other subgroup, therefore, the function must search in the <code>scene</code> for its childrens, changing its funcionability to prevent or allow the interactions.

This function must be recursive, because in principle the user are not aware how many childrens layers we have. The function <code>gui.toggleElement()</code> responsible for changing the functionalities can be formulate as following:
`
)}

function _toggleElement(){return(
function toggleElement(element, name) {
  if (element.children.lenght == 0) {
    return;
  }

  element.children.forEach(child => {
    if (child.group == name) {
      // Verify if it is visible trought the masks layers
      if (child.layers.mask) {
        child.layers.disable(0);
      } else {
        child.layers.enable(0);
      }
    }
    toggleElement(child, name);
  });
}
)}

function _16(md){return(
md`
Now, we can insert the function in the GUI to verify the scene every time it is changed according to each affiliation group present in the JSON:
`
)}

function _17(scale_check_box,modelStyle,toggleElement,scene)
{
  scale_check_box
    .add(modelStyle, "displayOutline")
    .onChange(newValue => {
      toggleElement(scene, "Machinery");
    })
    .name("Machinery");

  scale_check_box
    .add(modelStyle, "displayOutline")
    .onChange(newValue => {
      toggleElement(scene, "Tank");
    })
    .name("Tank");

  scale_check_box
    .add(modelStyle, "displayOutline")
    .onChange(newValue => {
      toggleElement(scene, "Compartment");
    })
    .name("Compartment");

  scale_check_box
    .add(modelStyle, "displayOutline")
    .onChange(newValue => {
      toggleElement(scene, "Deck");
    })
    .name("Deck");

  scale_check_box
    .add(modelStyle, "displayOutline")
    .onChange(newValue => {
      toggleElement(scene, "Bulkheads");
    })
    .name("Bulkheads");

  scale_check_box.open();
}


function _18(md){return(
md`
The switch function must also be modified to incorporate a change in <code>scale_check_box.domElement.hidden</code> because the blocks can only be verified if the blocks are shown to the user:
`
)}

function _switchElement(scene,ModelGLTF,scale_check_box,ship3D){return(
function switchElement(stringModel) {
  scene.children.forEach(element => {
    var otherName = {
      ModelGLTF: "Ship3D",
      Ship3D: "ModelGLTF"
    };

    if (element.name == otherName[stringModel]) {
      scene.remove(element);
    }
  });

  // Switch function
  switch (stringModel) {
    case "ModelGLTF":
      scene.add(ModelGLTF);
      scale_check_box.domElement.hidden = true;
      break;

    case "Ship3D":
      scene.add(ship3D);
      scale_check_box.domElement.hidden = false;
      break;

    default:
      break;
  }
}
)}

function _20(md){return(
md`
<p style="text-align: center;font-size: 25px;"> [<< Previous](../section-3-1/index.html) || <a href="#top">Top</a> || [Next >>](../chapter-4/index.html) </p> 
`
)}

function _ThreDModels(md){return(
md`### <span style="color:rgb(13, 18, 125)"> 3D Models`
)}

function _Gunnerus(FileAttachment){return(
FileAttachment("gunnerus.json").json()
)}

function _ship(Vessel,Gunnerus){return(
new Vessel.Ship(Gunnerus)
)}

function _ship3D(Ship3D,ship,scene)
{
  const ship3D = new Ship3D(ship, {
    shipState: ship.designState.clone(),
    stlPath:
      "https://shiplab.github.io/vesseljs/examples/specs/STL%20files/Gunnerus",
    upperColor: 0x33aa33,
    lowerColor: 0xaa3333,
    hullOpacity: 0.5,
    deckOpacity: 0.5,
    objectOpacity: 0.5
  });

  ship3D.name = "Ship3D";
  scene.add(ship3D);
  return ship3D;
}


function _25(THREE,$0,$1)
{
  const boatPath =
    "https://ferrari212.github.io/vesseljs/examples/specs/GLTF_files/Gunnerus.glb";

  const loaderGLTF = new THREE.GLTFLoader();

  loaderGLTF.load(
    boatPath,
    gltf => {
      var shipGLTF = gltf.scene;
      shipGLTF.rotation.x = Math.PI / 2;
      shipGLTF.rotation.y = -Math.PI / 2;
      shipGLTF.position.x = -1;
      shipGLTF.name = "ModelGLTF";

      if (shipGLTF.material) {
        shipGLTF.material.side = THREE.DoubleSide;
      }

      // scene.add(shipGLTF);
      $0.value = shipGLTF;
    },
    xhr => {
      $1.value = (xhr.loaded / 31780028) * 100;
    }
  );
}


function _ModelGLTF()
{
}


function _27(md){return(
md`### <span style="color:rgb(13, 18, 125)"> GUI`
)}

function _scale_visualization(gui){return(
gui.addFolder("Visualization parameters")
)}

function _29(scale_visualization,modelStyle,switchElement){return(
scale_visualization
  .add(modelStyle, "model", {
    Model: "ModelGLTF",
    Blocks: "Ship3D"
  })
  .onChange(newValue => {
    switchElement(newValue);
  })
  .name("View")
)}

function _30(scale_visualization){return(
scale_visualization.open()
)}

function _Snippets(md){return(
md`### <span style="color:rgb(13, 18, 125)"> Snippets`
)}

function _styles(html){return(
html`
<style>
#gui { 
   position: absolute; 
   top: 112px; 
   right: 0px 
}

</style>
`
)}

function _loaderPecentage(){return(
0
)}

function _scene(THREE){return(
new THREE.Scene()
)}

function _Ship3D(THREE,Vessel)
{
  //@EliasHasle

  /*
Draft for new version. More modularized, and interacts with a ship state.
Uses an additional coordinate system for motions.
The position.xy and rotation.z of the Ship3D object plane the ship in the 3D world.
(Not geographically)
position.z is the (negative) draft.
fluctCont is a "fluctuations container" to be used for dynamically
changing motions like heave, pitch, roll.
cmContainer centers the motion on the center of gravity.
normalizer nulls out the center of gravity height before the draft is applied.


THREE.js Object3D constructed from Vessel.js Ship object.

There are some serious limitations to this:
1. null values encountered are assumed to be either at the top or bottom of the given station.
2. The end caps and bulkheads are sometimes corrected with zeros where they should perhaps have been clipped because of null values.

TODO: Use calculated draft for position.z, and place the ship model in a motion container centered at the calculated metacenter.
*/

  //var hMat; //global for debugging

  function Ship3D(
    ship,
    { shipState, stlPath, deckOpacity = 0.2, objectOpacity = 0.5 }
  ) {
    THREE.Group.call(this);

    this.normalizer = new THREE.Group();
    this.fluctCont = new THREE.Group();
    this.fluctCont.rotation.order = "ZYX"; //right?
    this.cmContainer = new THREE.Group();
    this.fluctCont.add(this.cmContainer);
    this.normalizer.add(this.fluctCont);
    this.add(this.normalizer);

    Object.defineProperty(this, "draft", {
      get: function() {
        return -this.position.z;
      } /*,
		set: function(value) {
			this.position.z = -value;
		}*/
    });
    Object.defineProperty(this, "surge", {
      get: function() {
        return this.fluctCont.position.x;
      },
      set: function(value) {
        this.fluctCont.position.x = value;
        //this.shipState.motion.surge = value;
      }
    });
    Object.defineProperty(this, "sway", {
      get: function() {
        return this.fluctCont.position.y;
      },
      set: function(value) {
        this.fluctCont.position.y = value;
        //this.shipState.motion.sway = value;
      }
    });
    Object.defineProperty(this, "heave", {
      get: function() {
        return this.fluctCont.position.z;
      },
      set: function(value) {
        this.fluctCont.position.z = value;
        //this.shipState.motion.heave = value;
      }
    });
    Object.defineProperty(this, "yaw", {
      get: function() {
        return this.fluctCont.rotation.z;
      },
      set: function(value) {
        this.fluctCont.rotation.z = value;
        //this.shipState.motion.yaw = value;
      }
    });
    Object.defineProperty(this, "pitch", {
      get: function() {
        return this.fluctCont.rotation.y;
      },
      set: function(value) {
        this.fluctCont.rotation.y = value;
        //this.shipState.motion.pitch = value;
      }
    });
    Object.defineProperty(this, "roll", {
      get: function() {
        return this.fluctCont.rotation.x;
      },
      set: function(value) {
        this.fluctCont.rotation.x = value;
        //this.shipState.motion.roll = value;
      }
    });

    this.objectOpacity = objectOpacity;

    this.ship = ship;
    this.shipState = shipState || ship.designState.clone();

    let hull = ship.structure.hull;

    let LOA = hull.attributes.LOA;
    let BOA = hull.attributes.BOA;
    let Depth = hull.attributes.Depth;

    //console.log("LOA:%.1f, BOA:%.1f, Depth:%.1f",LOA,BOA,Depth);
    let {
      w: { cg, mass },
      T,
      GMt,
      GMl
    } = ship.calculateStability(this.shipState);

    this.cmContainer.position.set(-cg.x, -cg.y, -cg.z);
    this.normalizer.position.z = cg.z;
    this.position.z = -T;

    let designDraft = ship.designState.calculationParameters.Draft_design;
    this.hull3D = new Hull3D(hull, designDraft);
    this.cmContainer.add(this.hull3D);

    //DEBUG, to show only hull:
    //return;

    let stations = hull.halfBreadths.stations;
    //Decks:
    var decks = new THREE.Group();
    let deckMat = new THREE.MeshPhongMaterial({
      color: 0xcccccc /*this.randomColor()*/,
      transparent: true,
      opacity: deckOpacity,
      side: THREE.DoubleSide
    });
    //deckGeom.translate(0,0,-0.5);
    let ds = ship.structure.decks;
    //let dk = Object.keys(ds);
    let stss = stations.map(st => LOA * st); //use scaled stations for now
    //console.log(dk);
    //for (let i = 0; i < dk.length; i++) {
    for (let dk in ds) {
      //let d = ds[dk[i]]; //deck in ship structure
      let d = ds[dk];

      //Will eventually use BoxBufferGeometry, but that is harder, because vertices are duplicated in the face planes.
      let deckGeom = new THREE.PlaneBufferGeometry(1, 1, stss.length, 1); //new THREE.BoxBufferGeometry(1,1,1,sts.length,1,1);
      //console.log("d.zFloor=%.1f", d.zFloor); //DEBUG
      let zHigh = d.zFloor;
      let zLow = d.zFloor - d.thickness;
      let wlHigh = hull.getWaterline(zHigh);
      let wlLow = hull.getWaterline(zLow);
      let pos = deckGeom.getAttribute("position");
      let pa = pos.array;
      for (let j = 0; j < stss.length + 1; j++) {
        //This was totally wrong, and still would benefit from
        //not mapping directly to stations, as shorter decks will
        //Get zero-width sections
        let x = stss[j]; //d.xAft+(j/stss.length)*(d.xFwd-d.xAft);
        if (isNaN(x)) x = stss[j - 1];
        x = Math.max(d.xAft, Math.min(d.xFwd, x));
        let y1 = Vessel.f.linearFromArrays(stss, wlHigh, x);
        let y2 = Vessel.f.linearFromArrays(stss, wlLow, x);
        let y = Math.min(0.5 * d.breadth, y1, y2);
        pa[3 * j] = x;
        pa[3 * j + 1] = y;
        pa[3 * (stss.length + 1) + 3 * j] = x;
        pa[3 * (stss.length + 1) + 3 * j + 1] = -y; //test
      }
      pos.needsUpdate = true;

      //DEBUG
      //console.log("d.xFwd=%.1f, d.xAft=%.1f, 0.5*d.breadth=%.1f", d.xFwd, d.xAft, 0.5*d.breadth);
      //console.log(pa);
      let mat = deckMat;
      if (d.style) {
        mat = new THREE.MeshPhongMaterial({
          color:
            typeof d.style.color !== "undefined" ? d.style.color : 0xcccccc,
          transparent: true,
          opacity:
            typeof d.style.opacity !== "undefined"
              ? d.style.opacity
              : deckOpacity,
          side: THREE.DoubleSide
        });
      }
      let deck = new THREE.Mesh(deckGeom, mat);
      deck.name = dk; //[i];

      // The try verification is used to verify if the group affiliation was inserted in the JSON structure,
      // the affiliation must be decided in the future if it will be incorporate into the main structure of the group
      // or if there is a better approach to classify it.
      // @ferrari212
      try {
        deck.group = d.affiliations.group;
      } catch (error) {
        console.warn('Group tag were introduced to deck object');
        console.warn(error);
      }

      deck.position.z = d.zFloor;
      //deck.scale.set(d.xFwd-d.xAft, d.breadth, d.thickness);
      //deck.position.set(0.5*(d.xFwd+d.xAft), 0, d.zFloor);
      decks.add(deck);
    }
    this.decks = decks;
    this.cmContainer.add(decks);

    //Bulkheads:
    var bulkheads = new THREE.Group();
    // Individually trimmed geometries like the decks @ferrari212
    let bhMat = new THREE.MeshPhongMaterial({
      color: 0xcccccc /*this.randomColor()*/,
      transparent: true,
      opacity: deckOpacity,
      side: THREE.DoubleSide
    });
    let bhs = ship.structure.bulkheads;
    let maxWl = Math.max(...hull.halfBreadths.waterlines) * Depth;
    //let bhk = Object.keys(bhs);
    //for (let i = 0; i < bhk.length; i++) {
    for (let bhk in bhs) {
      let bh = bhs[bhk]; //bhs[bhk[i]];
      let mat = bhMat;
      let station = hull.getStation(bh.xAft);

      if (bh.style) {
        mat = new THREE.MeshPhongMaterial({
          color:
            typeof bh.style.color !== "undefined" ? bh.style.color : 0xcccccc,
          transparent: true,
          opacity:
            typeof bh.style.opacity !== "undefined"
              ? bh.style.opacity
              : deckOpacity,
          side: THREE.DoubleSide
        });
      }

      let bulkheadGeom = new THREE.PlaneBufferGeometry(
        maxWl,
        BOA,
        station.length - 1,
        1
      );

      let pos = bulkheadGeom.getAttribute("position");
      let pa = pos.array;

      for (let i = 0; i < station.length; i++) {
        // Check height in order to trim the bulkhead in the deck
        if (pa[3 * i] < Depth - maxWl / 2) {
          pa[3 * i + 1] = station[i];
          pa[3 * station.length + 3 * i + 1] = -station[i];
        } else {
          pa[3 * i + 1] = pa[3 * station.length + 3 * i + 1] = 0;
        }
      }
      pos.needsUpdate = true;
      let bulkhead = new THREE.Mesh(bulkheadGeom, mat);

      bulkhead.name = bhk; //[i];

      // The try verification is used to verify if the group affiliation was inserted in the JSON structure,
      // the affiliation must be decided in the future if it will be incorporate into the main structure of the group
      // or if there is a better approach to classify it.
      // @ferrari212
      try {
        bulkhead.group = bh.affiliations.group;
      } catch (error) {
        console.warn('Group tag were introduced to bulkhead object');
        console.warn(error);
      }

      bulkhead.rotation.y = -Math.PI / 2;
      bulkhead.position.set(bh.xAft, 0, maxWl / 2);
      bulkheads.add(bulkhead);
    }
    this.bulkheads = bulkheads;
    this.cmContainer.add(bulkheads);

    //Objects

    this.materials = {};
    this.stlPath = stlPath;
    let stlManager = new THREE.LoadingManager();
    this.stlLoader = new THREE.STLLoader(stlManager);
    /*stlManager.onLoad = function() {
		createGUI(materials, deckMat);
	}*/

    this.blocks = new THREE.Group();
    this.cmContainer.add(this.blocks);

    //Default placeholder geometry
    this.boxGeom = new THREE.BoxBufferGeometry(1, 1, 1);
    this.boxGeom.translate(0, 0, 0.5);

    let objects = Object.values(ship.derivedObjects);
    for (let i = 0; i < objects.length; i++) {
      this.addObject(objects[i]);
    }

    //console.log("Reached end of Ship3D constructor.");
  }
  Ship3D.prototype = Object.create(THREE.Group.prototype);
  Object.assign(Ship3D.prototype, {
    constructor: Ship3D,
    addObject: function(object) {
      let mat;
      if (
        typeof object.style.color !== "undefined" ||
        typeof object.style.opacity !== "undefined"
      ) {
        let color =
          typeof object.style.color !== "undefined"
            ? object.style.color
            : this.randomColor();
        let opacity =
          typeof object.style.opacity !== "undefined"
            ? object.style.opacity
            : this.objectOpacity;
        mat = new THREE.MeshPhongMaterial({
          color,
          transparent: true,
          opacity
        });
      } else {
        let name = this.stripName(object.id);
        if (this.materials[name] !== undefined) {
          mat = this.materials[name];
        } else {
          mat = new THREE.MeshPhongMaterial({
            color: this.randomColor(),
            transparent: true,
            opacity: this.objectOpacity
          });
          this.materials[name] = mat;
        }
      }

      let bo = object.baseObject;

      //Position
      let s = this.ship.designState.getObjectState(object);
      let x = s.xCentre;
      let y = s.yCentre;
      let z = s.zBase;

      //Small position jitter to avoid z-fighting
      let n = 0.01 * (2 * Math.random() - 1);
      x += n;
      y += n;
      z += n;

      //Scale
      let d = bo.boxDimensions;

      if (bo.file3D) {
        let self = this;
        this.stlLoader.load(
          this.stlPath + "/" + bo.file3D,
          function onLoad(geometry) {
            //Normalize:
            geometry.computeBoundingBox();
            let b = geometry.boundingBox;
            geometry.translate(-b.min.x, -b.min.y, -b.min.z);
            geometry.scale(
              1 / (b.max.x - b.min.x),
              1 / (b.max.y - b.min.y),
              1 / (b.max.z - b.min.z)
            );
            //Align with the same coordinate system as placeholder blocks:
            geometry.translate(-0.5, -0.5, 0);
            let m = new THREE.Mesh(geometry, mat);
            m.position.set(x, y, z);
            m.scale.set(d.length, d.breadth, d.height);
            m.name = object.id;
            m.group =
              bo.affiliations.group != undefined
                ? bo.affiliations.group
                : undefined;
            self.blocks.add(m);
          },
          undefined,
          function onError() {
            console.warn(
              "Error loading STL file " +
                bo.file3D +
                ". Falling back on placeholder."
            );
            let m = new THREE.Mesh(this.boxGeom, mat);
            m.position.set(x, y, z);
            m.scale.set(d.length, d.breadth, d.height);
            m.name = object.id;
            m.group =
              bo.affiliations.group != undefined
                ? bo.affiliations.group
                : undefined;
            this.blocks.add(m);
          }
        );
      } else {
        //Placeholder:
        let m = new THREE.Mesh(this.boxGeom, mat);
        m.position.set(x, y, z);
        m.scale.set(d.length, d.breadth, d.height);
        m.name = object.id;
        m.group =
          bo.affiliations.group != undefined
            ? bo.affiliations.group
            : undefined;
        this.blocks.add(m);
      }
    },
    //this function is used as a temporary hack to group similar objects by color
    stripName: function(s) {
      s = s.replace(/[0-9]/g, "");
      s = s.trim();
      return s;
    },
    randomColor: function() {
      let r = Math.round(Math.random() * 0xff);
      let g = Math.round(Math.random() * 0xff);
      let b = Math.round(Math.random() * 0xff);
      return (r << 16) | (g << 8) | b;
    }
  });

  //Class to contain the geometry of a hull side.
  //(Should perhaps be replaced by a HullGeometry class, but then
  //it cannot be a simple subclass of PlaneBufferGeometry.)
  //After instantiation, stations, waterlines and table can be modified or replaced,
  //but the data dimensions NxM must remain the same.
  function HullSideGeometry(stations, waterlines, table) {
    this.stations = stations;
    this.waterlines = waterlines;
    this.table = table;
    this.N = stations.length;
    this.M = waterlines.length;
    //Hull side, in principle Y offsets on an XZ plane:
    //Even though a plane geometry is usually defined in terms of Z offsets on an XY plane, the order of the coordinates for each vertex is not so important. What is important is to get the topology right. This is ensured by working with the right order of the vertices.
    THREE.PlaneBufferGeometry.call(
      this,
      undefined,
      undefined,
      this.N - 1,
      this.M - 1
    );

    this.update();
  }

  HullSideGeometry.prototype = Object.create(
    THREE.PlaneBufferGeometry.prototype
  );
  Object.assign(HullSideGeometry.prototype, {
    update: function() {
      let pos = this.getAttribute("position");
      let pa = pos.array;

      const N = this.N;
      const M = this.M;

      //loop1:
      //zs
      let c = 0;
      //Iterate over waterlines
      for (let j = 0; j < M; j++) {
        //loop2:
        //xs
        //iterate over stations
        for (let i = 0; i < N; i++) {
          //if (table[j][i] === null) continue;// loop1;
          pa[c] = this.stations[i]; //x
          //DEBUG, OK. No attempts to read outside of table
          /*if(typeof table[j] === "undefined") console.error("table[%d] is undefined", j);
				else if (typeof table[j][i] === "undefined") console.error("table[%d][%d] is undefined", j, i);*/
          //y
          pa[c + 1] = this.table[j][i]; //y
          pa[c + 2] = this.waterlines[j]; //z
          c += 3;
        }
      }
      //console.error("c-pa.length = %d", c-pa.length); //OK, sets all cells

      //Get rid of nulls by merging their points with the closest non-null point in the same station:
      /*I am joining some uvs too. Then an applied texture will be cropped, not distorted, where the hull is cropped.*/
      let uv = this.getAttribute("uv");
      let uva = uv.array;
      //Iterate over stations
      for (let i = 0; i < N; i++) {
        let firstNumberJ;
        let lastNumberJ;
        //Iterate over waterlines
        let j;
        for (j = 0; j < M; j++) {
          let y = this.table[j][i];
          //If this condition is satisfied (number found),
          //the loop will be quitted
          //after the extra logic below:
          if (y !== null) {
            firstNumberJ = j;
            lastNumberJ = j;
            //copy vector for i,j to positions for all null cells below:
            let c = firstNumberJ * N + i;
            let x = pa[3 * c];
            let y = pa[3 * c + 1];
            let z = pa[3 * c + 2];
            let d = c;
            while (firstNumberJ > 0) {
              firstNumberJ--;
              d -= N;
              pa[3 * d] = x;
              pa[3 * d + 1] = y;
              pa[3 * d + 2] = z;
              uva[2 * d] = uva[2 * c];
              uva[2 * d + 1] = uva[2 * c + 1];
            }
            break;
          }
          //console.log("null encountered.");
        }

        //Continue up the hull (with same j counter), searching for upper number. This does not account for the existence of numbers above the first null encountered.
        for (; j < M; j++) {
          let y = this.table[j][i];
          if (y === null) {
            //console.log("null encountered.");
            break;
          }
          //else not null:
          lastNumberJ = j;
        }

        //copy vector for i,j to positions for all null cells above:
        let c = lastNumberJ * N + i;
        let x = pa[3 * c];
        let y = pa[3 * c + 1];
        let z = pa[3 * c + 2];
        let d = c;
        while (lastNumberJ < M - 1) {
          lastNumberJ++;
          d += N;
          pa[3 * d] = x;
          pa[3 * d + 1] = y;
          pa[3 * d + 2] = z;
          uva[2 * d] = uva[2 * c];
          uva[2 * d + 1] = uva[2 * c + 1];
        }
        //////////
      }

      //console.log(pa);

      pos.needsUpdate = true;
      uv.needsUpdate = true;
      this.computeVertexNormals();
    }
  });

  function Hull3D(hull, design_draft) {
    THREE.Group.call(this);

    this.hull = hull;
    this.group = "Hull3D";
    this.design_draft =
      design_draft !== undefined ? design_draft : 0.5 * hull.attributes.Depth;
    this.upperColor =
      typeof hull.style.upperColor !== "undefined"
        ? hull.style.upperColor
        : 0x33aa33;
    this.lowerColor =
      typeof hull.style.lowerColor !== "undefined"
        ? hull.style.lowerColor
        : 0xaa3333;
    this.opacity =
      typeof hull.style.opacity !== "undefined" ? hull.style.opacity : 0.5;

    this.update();
  }
  Hull3D.prototype = Object.create(THREE.Group.prototype);

  Object.assign(Hull3D.prototype, {
    //Experimental addition. Broken.
    addStation: function(p) {
      const hb = this.hull.halfBreadths;
      const { index, mu } = Vessel.f.bisectionSearch(hb.stations, p);
      hb.stations.splice(index, 0, p);
      for (let i = 0; i < hb.waterlines.length; i++) {
        hb.table[i].splice(index, 0, 0);
      }

      this.update();
    },
    //Experimental addition
    addWaterline: function(p) {
      const hb = this.hull.halfBreadths;
      const { index, mu } = Vessel.f.bisectionSearch(hb.waterlines, p);
      hb.waterlines.splice(index, 0, p);
      hb.table.splice(index, 0, new Array(hb.stations.length).fill(0));

      this.update();
    },
    //or updateGeometries?
    update: function() {
      const hull = this.hull;
      const upperColor = this.upperColor;
      const lowerColor = this.lowerColor;
      const design_draft = this.design_draft;
      const opacity = this.opacity;

      let LOA = hull.attributes.LOA;
      let BOA = hull.attributes.BOA;
      let Depth = hull.attributes.Depth;

      //None of these are changed during correction of the geometry.
      let stations = hull.halfBreadths.stations;
      let waterlines = hull.halfBreadths.waterlines;
      let table = hull.halfBreadths.table;

      if (this.hGeom) this.hGeom.dispose();
      this.hGeom = new HullSideGeometry(stations, waterlines, table);

      let N = stations.length;
      let M = waterlines.length;

      //Bow cap:
      let bowPlaneOffsets = hull.getStation(LOA).map(str => str / (0.5 * BOA)); //normalized
      if (this.bowCapG) this.bowCapG.dispose();
      this.bowCapG = new THREE.PlaneBufferGeometry(
        undefined,
        undefined,
        1,
        M - 1
      );
      let pos = this.bowCapG.getAttribute("position");
      let pa = pos.array;
      //constant x-offset yz plane
      for (let j = 0; j < M; j++) {
        pa[3 * (2 * j)] = 1;
        pa[3 * (2 * j) + 1] = bowPlaneOffsets[j];
        pa[3 * (2 * j) + 2] = waterlines[j];
        pa[3 * (2 * j + 1)] = 1;
        pa[3 * (2 * j + 1) + 1] = -bowPlaneOffsets[j];
        pa[3 * (2 * j + 1) + 2] = waterlines[j];
      }
      pos.needsUpdate = true;

      //Aft cap:
      let aftPlaneOffsets = hull.getStation(0).map(str => str / (0.5 * BOA)); //normalized
      if (this.aftCapG) this.aftCapG.dispose();
      this.aftCapG = new THREE.PlaneBufferGeometry(
        undefined,
        undefined,
        1,
        M - 1
      );
      pos = this.aftCapG.getAttribute("position");
      pa = pos.array;
      //constant x-offset yz plane
      for (let j = 0; j < M; j++) {
        pa[3 * (2 * j)] = 0;
        pa[3 * (2 * j) + 1] = -aftPlaneOffsets[j];
        pa[3 * (2 * j) + 2] = waterlines[j];
        pa[3 * (2 * j + 1)] = 0;
        pa[3 * (2 * j + 1) + 1] = aftPlaneOffsets[j];
        pa[3 * (2 * j + 1) + 2] = waterlines[j];
      }
      pos.needsUpdate = true;

      //Bottom cap:
      let bottomPlaneOffsets = hull.getWaterline(0).map(hw => hw / (0.5 * BOA)); //normalized
      if (this.bottomCapG) this.bottomCapG.dispose();
      this.bottomCapG = new THREE.PlaneBufferGeometry(
        undefined,
        undefined,
        N - 1,
        1
      );
      pos = this.bottomCapG.getAttribute("position");
      pa = pos.array;
      //constant z-offset xy plane
      for (let i = 0; i < N; i++) {
        pa[3 * i] = stations[i];
        pa[3 * i + 1] = -bottomPlaneOffsets[i];
        pa[3 * i + 2] = 0;
        pa[3 * (N + i)] = stations[i];
        pa[3 * (N + i) + 1] = bottomPlaneOffsets[i];
        pa[3 * (N + i) + 2] = 0;
      }
      pos.needsUpdate = true;

      //Hull material
      if (!this.hMat) {
        let phong = THREE.ShaderLib.phong;
        let commonDecl =
          "uniform float wlThreshold;uniform vec3 aboveWL; uniform vec3 belowWL;\nvarying float vZ;";
        this.hMat = new THREE.ShaderMaterial({
          uniforms: THREE.UniformsUtils.merge([
            phong.uniforms,
            {
              wlThreshold: new THREE.Uniform(0.5),
              aboveWL: new THREE.Uniform(new THREE.Color()),
              belowWL: new THREE.Uniform(new THREE.Color())
            }
          ]),
          vertexShader:
            commonDecl +
            phong.vertexShader
              .replace("main() {", "main() {\nvZ = position.z;")
              .replace("#define PHONG", ""),
          fragmentShader:
            commonDecl +
            phong.fragmentShader
              .replace(
                "vec4 diffuseColor = vec4( diffuse, opacity );",
                "vec4 diffuseColor = vec4( (vZ>wlThreshold)? aboveWL.rgb : belowWL.rgb, opacity );"
              )
              .replace("#define PHONG", ""),
          side: THREE.DoubleSide,
          lights: true,
          transparent: true
        });
      }
      this.hMat.uniforms.wlThreshold.value = this.design_draft / Depth;
      this.hMat.uniforms.aboveWL.value = new THREE.Color(upperColor);
      this.hMat.uniforms.belowWL.value = new THREE.Color(lowerColor);
      this.hMat.uniforms.opacity.value = opacity;

      if (this.port) this.remove(this.port);
      this.port = new THREE.Mesh(this.hGeom, this.hMat);
      if (this.starboard) this.remove(this.starboard);
      this.starboard = new THREE.Mesh(this.hGeom, this.hMat);
      this.starboard.scale.y = -1;
      this.add(this.port, this.starboard);

      //Caps:
      if (this.bowCap) this.remove(this.bowCap);
      this.bowCap = new THREE.Mesh(this.bowCapG, this.hMat);
      if (this.aftCap) this.remove(this.aftCap);
      this.aftCap = new THREE.Mesh(this.aftCapG, this.hMat);
      if (this.bottomCap) this.remove(this.bottomCap);
      this.bottomCap = new THREE.Mesh(this.bottomCapG, this.hMat);

      this.add(this.bowCap, this.aftCap, this.bottomCap);

      this.scale.set(LOA, 0.5 * BOA, Depth);
    }
  });

  return Ship3D;
}


function _gui(dat)
{
  var gui = new dat.GUI();
  gui.domElement.id = 'gui';

  return gui;
}


function _37(md){return(
md`### <span style="color:rgb(13, 18, 125)"> Hierarchy Tree`
)}

function _diagonal(d3){return(
d3
  .linkHorizontal()
  .x(d => d.y)
  .y(d => d.x)
)}

function _tree2(d3,dx,dy){return(
d3.tree().nodeSize([dx, dy])
)}

function _root(d3){return(
d3.hierarchy({
  name: "Ship",
  children: [
    { name: "Machinery" },
    { name: "Tank" },
    { name: "Compartments" },
    {
      name: "Structure",
      children: [{ name: "Deck", value: 1 }, { name: "Bulkhead", value: 1 }]
    }
  ]
})
)}

function _dx(){return(
20
)}

function _dy(width){return(
width / 4
)}

function _margin(){return(
{ top: 10, right: 120, bottom: 10, left: 40 }
)}

function _44(md){return(
md`### <span style="color:rgb(13, 18, 125)"> Libraries`
)}

function _dat(require){return(
require('dat.gui')
)}

async function _THREE(require)
{
  const THREE = (window.THREE = await require("three@0.99.0/build/three.min.js"));
  await require("three@0.99.0/examples/js/controls/OrbitControls.js").catch(
    () => {}
  );
  await require("three@0.99.0/examples/js/loaders/STLLoader.js").catch(
    () => {}
  );
  await require("three@0.99.0/examples/js/loaders/GLTFLoader.js").catch(
    () => {}
  );
  return THREE;
}


function _Vessel(require){return(
require('ntnu-vessel@0.1.1/vessel.js').catch(() => window["Vessel"])
)}

function _d3(require){return(
require("d3@5")
)}

function _49(md){return(
md`### <span style="color:rgb(13, 18, 125)"> References

**[1] NASA System Engineering Handbook ** – National Aeronautics and Space Adminstration, Washington, D.C.
`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["gunnerus.json", {url: new URL("../section-2-5/files/jason_one.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["THREE","scene","width","invalidation"], _2);
  main.variable(observer()).define(["html","loaderPecentage"], _3);
  main.variable(observer()).define(["md","loaderPecentage"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer("chart3")).define("chart3", ["root","dy","d3","margin","width","dx","tree2","diagonal"], _chart3);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer()).define(["Gunnerus"], _9);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer("scale_check_box")).define("scale_check_box", ["gui"], _scale_check_box);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer("modelStyle")).define("modelStyle", _modelStyle);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer("toggleElement")).define("toggleElement", _toggleElement);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer()).define(["scale_check_box","modelStyle","toggleElement","scene"], _17);
  main.variable(observer()).define(["md"], _18);
  main.variable(observer("switchElement")).define("switchElement", ["scene","ModelGLTF","scale_check_box","ship3D"], _switchElement);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer("ThreDModels")).define("ThreDModels", ["md"], _ThreDModels);
  main.variable(observer("Gunnerus")).define("Gunnerus", ["FileAttachment"], _Gunnerus);
  main.variable(observer("ship")).define("ship", ["Vessel","Gunnerus"], _ship);
  main.variable(observer("ship3D")).define("ship3D", ["Ship3D","ship","scene"], _ship3D);
  main.variable(observer()).define(["THREE","mutable ModelGLTF","mutable loaderPecentage"], _25);
  main.define("initial ModelGLTF", _ModelGLTF);
  main.variable(observer("mutable ModelGLTF")).define("mutable ModelGLTF", ["Mutable", "initial ModelGLTF"], (M, _) => new M(_));
  main.variable(observer("ModelGLTF")).define("ModelGLTF", ["mutable ModelGLTF"], _ => _.generator);
  main.variable(observer()).define(["md"], _27);
  main.variable(observer("scale_visualization")).define("scale_visualization", ["gui"], _scale_visualization);
  main.variable(observer()).define(["scale_visualization","modelStyle","switchElement"], _29);
  main.variable(observer()).define(["scale_visualization"], _30);
  main.variable(observer("Snippets")).define("Snippets", ["md"], _Snippets);
  main.variable(observer("styles")).define("styles", ["html"], _styles);
  main.define("initial loaderPecentage", _loaderPecentage);
  main.variable(observer("mutable loaderPecentage")).define("mutable loaderPecentage", ["Mutable", "initial loaderPecentage"], (M, _) => new M(_));
  main.variable(observer("loaderPecentage")).define("loaderPecentage", ["mutable loaderPecentage"], _ => _.generator);
  main.variable(observer("scene")).define("scene", ["THREE"], _scene);
  main.variable(observer("Ship3D")).define("Ship3D", ["THREE","Vessel"], _Ship3D);
  main.variable(observer("gui")).define("gui", ["dat"], _gui);
  main.variable(observer()).define(["md"], _37);
  main.variable(observer("diagonal")).define("diagonal", ["d3"], _diagonal);
  main.variable(observer("tree2")).define("tree2", ["d3","dx","dy"], _tree2);
  main.variable(observer("root")).define("root", ["d3"], _root);
  main.variable(observer("dx")).define("dx", _dx);
  main.variable(observer("dy")).define("dy", ["width"], _dy);
  main.variable(observer("margin")).define("margin", _margin);
  main.variable(observer()).define(["md"], _44);
  main.variable(observer("dat")).define("dat", ["require"], _dat);
  main.variable(observer("THREE")).define("THREE", ["require"], _THREE);
  main.variable(observer("Vessel")).define("Vessel", ["require"], _Vessel);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer()).define(["md"], _49);
  return main;
}
