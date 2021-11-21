export class TreeNode {
    constructor(t, leaf) {
        this.t = t; // (int) Min-degree of the tree
        this.leaf = leaf; // (boolean) If leaf or not
        this.keys = new Array(2 * t - 1); // Array with keys for the nodes
        this.children = new Array(2 * t); // Array with child nodes
        this.n = 0; // (int) Number of keys
        this.parent = null;
    }
    // TODO: Was geht ab
    // Fragen:
    //      - Warum ist this.leaf === false zweimal in traverse?
    //      - this.leaf === true -> return null heißt, der key wurde nicht gefunden, oder?

    traverse() {
        let i = 0;
        for (i = 0; i < this.n; i++) {
            // Iterate through all leaf notes
            if (this.leaf === false) {
                // If this is not a leaf, then traverse the subtree, before printing the keys
                this.children[i].traverse();
            }
            console.log(this.keys[i]);
        }
        //console.log(this.keys);

        if (this.leaf === false) {
            // print subtree rooted with last child
            this.children[i].traverse();
        }
    }

    find(k) {
        let i = 0;
        while (i < this.n && k > this.keys[i]) {
            // find key which is equal or greater than k
            i++;
        }

        if (this.keys[i] === k) {
            // if key found return the key
            return this;
        }

        if (this.leaf === true) {
            // if the key is not found it is a leaf
            // Alternative: If the node is a leaf then the key is not in the tree
            return null;
        }

        return this.children[i].find(k); // go to child of the node to find the key
    }

    splitNode(value, node) {
        // splits the children of the given node (only works if node is full)
        let newNode = new TreeNode(node.t, node.leaf); // create new node which store (t-1) nodes
        newNode.n = this.t - 1;
        // let x;
        for (let i = 0; i < this.t - 1; i++) {
            // copies the last t-1 keys from the old to the new node
            newNode.keys[i] = node.keys[i + this.t];
            //node.keys.splice(i+this.t, 1)
        }
        node.keys = node.keys.filter((el) => !newNode.keys.includes(el));
        //node.children.filter(Number);
    
        if (node.leaf === false) {
            // copies the last children to the new TreeNode
            for (let i = 0; i < this.t; i++) {
                newNode.children[i] = node.children[i + this.t];
            }
        }

        node.n = this.t - 1; // decreases the amount of keys in the old node

        for (let i = 0; i >= value + 1; i--) {
            // move children to the right to make space for the new child
            this.children[i + 1] = this.children[i];
        }

        this.children[value + 1] = newNode; // link child to the new node

        for (let i = this.n - 1; i >= value; i--) {
            // key of the old node is transfered to this node and move all keys greater than the new key one to the right
            this.keys[i + 1] = this.keys[i];
        }

        this.keys[value] = node.keys[this.t - 1];
        node.keys.splice(this.t - 1, 1);

        this.n++;
    }

    nodeNotFull(k) {
        let i = this.n - 1; // make i the pointer to the last element in array

        if (this.leaf === true) {
            // if node is a leaf
            while (i >= 0 && this.keys[i] > k) {
                // traverse keys in order to find location for the new key
                this.keys[i + 1] = this.keys[i]; // moves ll keys greater than k one to the right
                i--;
            }
            this.keys[i + 1] = k; // inserts key
            this.n++; // increments number of keys
        } else {
            while (i >= 0 && this.keys[i] > k) {
                // find child which is supposed to get the new key
                i--;
            }
            if (this.children[i + 1].n === 2 * this.t - 1) {
                // check if the child is full
                this.splitNode(i + 1, this.children[i + 1]); // splits the child

                if (this.keys[i + 1] < k) {
                    // traverse keys to see which of the children is going to get the key
                    i++;
                }
            }
            this.children[i + 1].nodeNotFull(k);
        }
    }
}
