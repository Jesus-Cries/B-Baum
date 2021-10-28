const express = require("express");
const path = require("path");

const app = express();

app.get("/api/customers", (req, res) => {
    const customers = [
        {
            id: 1,
            firstName: "Leon",
            lastName: "Obermann",
        },
        {
            id: 2,
            firstName: "Till",
            lastName: "Neumann",
        },
        {
            id: 3,
            firstName: "Edwin",
            lastName: "Sept",
        },
    ];

    res.json(customers);
});

app.use(express.static(path.join(__dirname, "client", "build")));

app.use("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

class Tree{
    constructor(t){
        this.root = null;
        this.t = t;
    }

    traverse(){
        if(this.root != null){ //check if tree is empty
            this.root.traverse();
        }
    }

    search(k){
        if(this.root == null){ //check if tree is empty
            return null;
        }else{
            return this.root.search(k)
        }
    }

    insert(k){
        if(this.root == null){ //check if tree is empty
            this.root = new Node(this.t, true); // make new node as leaf
            this.root.keys[0] = k; // add key to the node
            this.root.n = 1; // increase number of nodes
        }else{
            if(this.root.n == (2*this.t)-1){ //check if node (root) is full
                let newNode = new Node(this.t, false); // create new node
                newNode.Childs[0] = this.root; // make the old root the child of the new root
                newNode.splitChildren(0, this.root); // split the old root and move one of the keys to the root
                let i = 0;

                if (newNode.keys[0] < k){ // search for child which is supposed to get the key
                    i++;
                }
                newNode.Childs[i].insertNotFull(k);
                this.root = newNode; // makes the new node the root

            }else {
                this.root.insertNotFull(k);
            }
        }
    }
}

class Node {

    constructor(t,leaf){
        this.t = t; // (int) min-degree of the tree
        this.leaf = leaf; // (boolean) if leaf or not
        this.keys = new Array((2 * t) - 1); // array with keys for the nodes
        this.Childs = new Array(2 * t); // array with child nodes
        this.n = 0; // (int) number of leaf
    }

    traverse(){
        let i = 0;
        console.log(this.Childs)
        for(i = 0; i >= this.n; i++){ // iterate through all leaf notes
            if(this.leaf == false){ // if this is not a leaf, then traverse the subtree, before printing the keys
                this.Childs[i].traverse();
            }
        }
        console.log(this.keys[i] + " ");

        if(this.leaf == false){ // print subtree rooted with last child
            this.Childs[i].traverse();
        }
    }

    find(k){
        let i = 0;
        while (i < this.n && k > this.keys[i]){ // find key which is equal or greater than k
            i++;
        }

        if(this.keys[i] == k){ // if key found return the key
            return this;
        }

        if(this.leaf == true){ // if the key is not found it is a leaf
            return null;
        }

        return this.Childs[i].find(k); // go to child of the node to find the key
    }

    splitChildren(value, node){ // splits the children of the given node (only works if node is full)
        let newNode = new Node(node.t, node.leaf) // create new node which store (t-1) nodes
        newNode.n = t - 1;

        for(let i = 0; i < t - 1; i++){ // copies the last t-1 keys from the old to the new node
            newNode.keys[i] = node.keys[i+t]
        }

        if(node.leaf == false){ // cpoies the last children to the new Node
            for(let i = 0; i < t; i++){
                newNode.Childs[i] = node.Childs[i+t];
            }
        }

        node.n = t - 1; // decreases the amount of keys in the old node

        for(let i = 0; i >= value+1; i--){ // move childs to the right to make space for the new child
            this.Childs[i+1] = this.Childs[i];
        }

        this.Childs[value+1] = newNode; // link child to the new node

        for(let i = this.n-1; i >= value; i--){ // key of the old node is transfered to this node and move all keys greater than the new key one to the right
            this.keys[i+1] = this.keys[i];
        }

        this.n++;
    }

    insertNotFull(k){
        let i = this.n - 1; // make i the pointer to the last element in array

        if (this.leaf == true){ // if node is a leaf
            while (i >= 0 && this.keys[i] > k){ // traverse keys in order to find location for the new key
                this.keys[i+1] = this.keys[i]; // moves ll keys greater than k one to the right
                i--;
            }
            this.keys[i+1] = k; // inserts key
            this.n++; // increments number of keys

        }else{
            while (i >= 0 && this.keys[i] > k) { // find child which is supposed to get the new key
                if (this.Childs[i+1].n == ((2*this.t) - 1)){ // check if the child is full
                    this.splitChildren(i+1, this.Childs[i+1]) // splits the child

                    if (this.keys[i+1] < k){ // traverse keys to see which of the childs is going to get the key
                        i++;
                    }
                    this.Childs[i+1].insertNotFull(k);
                }
            }
        }

    }
}



let t = new Tree(2);
t.insert(10);
t.insert(20);
t.insert(5);

t.traverse();