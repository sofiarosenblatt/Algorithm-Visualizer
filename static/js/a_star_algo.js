let button_pressed = '';

    // indicates which button was last pressed
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

        if (typeof source === 'undefined') {
            console.log("Source has not been set")
        }
        else if (typeof target === 'undefined') {
            console.log("Target has not been set")
        }
        else {
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
                    console.log("path not found");
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
                    console.log("final path found")
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