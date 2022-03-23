function close_popup() {
    document.getElementById("right-side").style.borderWidth = '0px';
    document.getElementById("popup-text").textContent = '';
    document.getElementById("closebtn").style.visibility = 'hidden'
}

function missing_node(node) {
    if (node === 'source') {
        document.getElementById("right-side").style.borderWidth = '1px';
        document.getElementById("closebtn").style.visibility = 'visible';
        document.getElementById("popup-text").textContent = 'Select a source node';
    }
    else if (node === 'target') {
        document.getElementById("right-side").style.borderWidth = '1px';
        document.getElementById("closebtn").style.visibility = 'visible';
        document.getElementById("popup-text").textContent = 'Select a target node';
    }
    else if (node === 'nopath') {
        document.getElementById("right-side").style.borderWidth = '1px';
        document.getElementById("closebtn").style.visibility = 'visible';
        document.getElementById("popup-text").textContent = 'A path was not found';
    }
}

// indicates which button was last pressed
let button_pressed = '';
function btn_pressed(id_tag) {
    button_pressed = id_tag;
}

function row_num(id_tag) {
    let index = id_tag.split("-");
    return index[0];
}

function col_num(id_tag) {
    let index = id_tag.split("-");
    return index[1];
}

function heuristic(node, target) {
    let a = Math.abs(parseInt(col_num(node.id)) - parseInt(col_num(target.id)));
    let b = Math.abs(parseInt(row_num(node.id)) - parseInt(row_num(target.id)));
    return a + b;
}

function find_adjacent(node1, node2) {
    if (row_num(node1) === row_num(node2)) {
        return (parseInt(col_num(node1)) + 1 === parseInt(col_num(node2))) || (parseInt(col_num(node1)) - 1 === parseInt(col_num(node2)));
    }
    else if (col_num(node1) === col_num(node2)) {
        return (parseInt(row_num(node1)) + 1 === parseInt(row_num(node2))) || (parseInt(row_num(node1)) - 1 === parseInt(row_num(node2)));
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let source;
let target;
let boundaries = [];
let weights = [];

async function start() {

    let adjacent;
    let unvisited = Array.from(document.getElementsByClassName("node"));
    let visited = [];

    if ((typeof source === 'undefined')||(source === null)) {
        missing_node('source');
    }
    else if ((typeof target === 'undefined')||(target  === null)) {
        missing_node('target');
    }
    else {
        close_popup()
        source.setAttribute("data-distance", heuristic(source, target));
        source.setAttribute("data-g", 0);
        while (unvisited.length > 0){
            let dist = 10000000;
            let current_node = source;
            // set current_node to node with smallest distance
            for (let i = 0; i < unvisited.length; i++) {
                if (parseInt(unvisited[i].getAttribute("data-distance")) < dist) {
                    current_node = unvisited[i];
                    dist = parseInt(unvisited[i].getAttribute("data-distance"));
                }
            }
            // remove current_node from unexplored_set
            if (unvisited.includes(current_node)) {
                for (let i = 0; i < unvisited.length; i++) {
                    if (unvisited[i] === current_node) {
                        unvisited.splice(i, 1);
                    }
                }
                current_node.style.backgroundColor = "#EA857A";
                await sleep(25);
                current_node.style.backgroundColor = "#C3CFD7";
            }
            else if (!unvisited.includes(current_node)) {
                missing_node("nopath")
                break;
            }

            // check if current_node is the target node
            if (current_node === target) {
                target.style.backgroundColor = "#EA857A";
                await sleep(50);
                let parents = [];
                let node = target;
                while (node.id !== source.id) {
                    let par_id = node.getAttribute("data-parent");
                    let par = document.getElementById(par_id)
                    parents.push(par);
                    node = par;
                }
                for (let i = 0; i < parents.length; i++) {
                    parents[i].style.backgroundColor = "#EA857A";
                    await sleep(50);
                }
                break;
            }
            // find adjacent nodes
            else {
                adjacent = [];
                for (let i = 0; i < unvisited.length; i++) {
                    if (find_adjacent(current_node.id, unvisited[i].id)) {
                        adjacent.push(unvisited[i]);
                    }
                }
            }

            // ignore node if it is a boundary
            for (let i = 0; i < adjacent.length; i++) {
                if (!boundaries.includes(adjacent[i])) {
                    let cost;
                    if (weights.includes(adjacent[i])) {
                        cost = 10;
                    }
                    else {
                        cost = 1;
                    }
                    let g = parseInt(current_node.getAttribute("data-g")) + cost
                    let h = heuristic(adjacent[i], target);
                    let total_dist = g + h;

                    if (!visited.includes(adjacent[i])) {
                        if (g <= parseInt(adjacent[i].getAttribute("data-g"))) {
                            adjacent[i].setAttribute("data-g", g);
                            adjacent[i].setAttribute("data-distance", total_dist);
                            adjacent[i].setAttribute("data-parent", current_node.id);
                        }
                    }
                    visited.push(current_node);
                }
            }
        }
    }
}
