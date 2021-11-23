export class TreeNode {
    constructor(minDegree, leaf, parent) {
        this.minDegree = minDegree; // (int) Min-degree of the tree
        this.leaf = leaf; // (boolean) If leaf or not
        this.keys = new Array(); // Array with keys for the nodes (2 * minDegree - 1)
        this.children = new Array(); // Array with child nodes (2 * minDegree)
        this.numberOfKeys = 0; // (int) Number of keys
        this.parent = parent;
        this.cost = 0;
    }
    // Fragen:
    //      - Warum ist this.leaf === false zweimal in traverse?
    //      - this.leaf === true -> return null heißt, der key wurde nicht gefunden, oder?

    traverse() {
        let i = 0;
        for (i = 0; i < this.numberOfKeys; i++) {
            // Iterate through all leaf notes
            if (this.leaf === false) {
                // If this is not a leaf, then traverse the subtree, before printing the keys
                this.children[i].traverse();
            }
            if (this.keys[i]) console.log(this.keys[i]);
        }
        //console.log(this.keys);

        if (this.leaf === false) {
            // print subtree rooted with last child
            this.children[i].traverse();
        }
    }

    find(key) {
        if(this.parent == null){
            this.cost = 0;
        }
        let i = 0;
        while (i < this.numberOfKeys && key > this.keys[i]) {
            // find key which is equal or greater than key
            this.cost++;
            i++;
        }

        if (this.keys[i] === key) {
            // if key found return the key
            return this;
        }

        if (this.leaf === true) {
            // if the key is not found it is a leaf
            // Alternative: If the node is a leaf then the key is not in the tree
            return null;
        }

        this.children[i].cost = this.cost+1;
        return this.children[i].find(key); // go to child of the node to find the key
    }

    splitNode(value, node) {
        // splits the children of the given node (only works if node is full)
        let newNode = new TreeNode(node.minDegree, node.leaf, this); // create new node which store (minDegree-1) nodes
        newNode.numberOfKeys = this.minDegree - 1;
        // let x;
        for (let i = 0; i < this.minDegree - 1; i++) {
            // copies the last minDegree-1 keys from the old to the new node
            newNode.keys[i] = node.keys[i + this.minDegree];
            //node.keys.splice(i+this.minDegree, 1)
        }
        node.keys = node.keys.filter((el) => !newNode.keys.includes(el));
        //node.children.filter(Number);

        if (node.leaf === false) {
            // copies the last children to the new TreeNode
            for (let i = 0; i < this.minDegree; i++) {
                newNode.children[i] = node.children[i + this.minDegree];
            }
        }

        node.numberOfKeys = this.minDegree - 1; // decreases the amount of keys in the old node

        for (let i = 0; i >= value + 1; i--) {
            // move children to the right to make space for the new child
            this.children[i + 1] = this.children[i];
        }

        this.children[value + 1] = newNode; // link child to the new node

        for (let i = this.numberOfKeys - 1; i >= value; i--) {
            // key of the old node is transfered to this node and move all keys greater than the new key one to the right
            this.keys[i + 1] = this.keys[i];
        }

        this.keys[value] = node.keys[this.minDegree - 1];
        node.keys.splice(this.minDegree - 1, 1);

        this.numberOfKeys++;
    }

    nodeNotFull(key) {
        let i = this.numberOfKeys - 1; // make i the pointer to the last element in array

        if (this.leaf === true) {
            // if node is a leaf
            while (i >= 0 && this.keys[i] > key) {
                // traverse keys in order to find location for the new key
                this.keys[i + 1] = this.keys[i]; // moves ll keys greater than key one to the right
                i--;
            }
            this.keys[i + 1] = key; // inserts key
            this.numberOfKeys++; // increments number of keys
        } else {
            while (i >= 0 && this.keys[i] > key) {
                // find child which is supposed to get the new key
                i--;
            }
            if (this.children[i + 1].numberOfKeys === 2 * this.minDegree - 1) {
                // check if the child is full
                this.splitNode(i + 1, this.children[i + 1]); // splits the child

                if (this.keys[i + 1] < key) {
                    // traverse keys to see which of the children is going to get the key
                    i++;
                }
            }
            this.children[i + 1].nodeNotFull(key);
        }
    }

    // Explanation: https://www.programiz.com/dsa/deletion-from-a-b-tree
    // TODO: Implement the rest of the algorithm for deletion of leaf keys
    // TODO: Implement algorithm for deletion of internal keys
    deleteKey(value) {
        console.log(`------- DELETING ${value} -------`);

        let index = this.keys.indexOf(value);

        // NODE IS LEAF
        if (this.leaf) {
            console.log("Node is a leaf");
            // ENOUGH KEYS
            if (this.numberOfKeys > this.minDegree - 1) {
                console.log("Enough keys for simple deletion");
                this.numberOfKeys--;
                return this.keys.splice(index, 1)[0];
            }
            // NOT ENOUGH KEYS
            else {
                console.log("NOT enough keys for simple removal");
                let indexInParentsChildren = this.parent.children.indexOf(this);
                // SIBLING TO LEFT EXISTS
                if (indexInParentsChildren - 1 >= 0) {
                    console.log("Sibling to the left exists");
                    // SIBLING HAS ENOUGH KEYS FOR THEFT
                    if (
                        this.parent.children[indexInParentsChildren - 1].keys.length >
                        this.minDegree - 1
                    ) {
                        console.log("Has enough keys for theft");
                        this.theftFromSibling(index, indexInParentsChildren, "Left");
                    }
                    // SIBLING TO RIGHT EXISTS
                } else if (indexInParentsChildren + 1 < this.parent.children.length) {
                    console.log("Sibling to the right exists");
                    // SIBLING HAS ENOUGH KEYS FOR THEFT
                    if (
                        this.parent.children[indexInParentsChildren + 1].keys.length >
                        this.minDegree - 1
                    ) {
                        console.log("Has enough keys for theft");
                        this.theftFromSibling(index, indexInParentsChildren, "Right");
                    }
                }
            }
        }
    }

    theftFromSibling(index, indexInParentsChildren, siblingSide) {
        // Delete key in this node
        this.keys.splice(index, 1);

        let parentKeyIndexToSteal = siblingSide === "Left" ? 0 : this.parent.keys.length - 1;
        let indexToPutParentKeyIn = siblingSide === "Left" ? 0 : this.keys.length;
        let indexOffset = siblingSide === "Left" ? -1 : 1;
        let siblingKeyIndexToSteal =
            siblingSide === "Left"
                ? this.parent.children[indexInParentsChildren - 1].keys.length - 1
                : 0;
        let parentIndexToPutSiblingKeyIn = siblingSide === "Left" ? 0 : this.parent.keys.length;

        // Steal lowest / highest key from parent
        let keyFromParent = this.parent.keys.splice(parentKeyIndexToSteal, 1)[0];
        this.keys.splice(indexToPutParentKeyIn, 0, keyFromParent);

        // Put highest / lowest key from right sibling in parent
        let keyFromSibling = this.parent.children[indexInParentsChildren + indexOffset].keys.splice(
            siblingKeyIndexToSteal,
            1
        )[0];
        return this.parent.keys.splice(parentIndexToPutSiblingKeyIn, 0, keyFromSibling);
    }

    // DEPRECATED
    // TODO: Delete deleteValue
    deleteValue(value) {
        let index = this.keys.indexOf(value);
        if (index >= this.numberOfKeys) {
            if (
                this.children[index].numberOfKeys > this.minDegree - 1 ||
                this.children[index + 1].numberOfKeys > this.minDegree - 1
            ) {
                console.log("NUMMER 1");
            }
            this.mergeNodes(this.children(index + 1), this.children[index]);
            this.deleteValue(value);
            return;
        }

        // If node is leaf and is not minimally filled, the key can simply be deleted
        if (this.leaf && this.numberOfKeys > this.minDegree - 1) {
            console.log(
                `Node has ${this.numberOfKeys} >  ${this.minDegree - 1} keys --> ${value} deleted`
            );
            this.numberOfKeys--;
            return this.keys.splice(index, 1)[0];
        }
        // If node is leaf but doesn'minDegree have enough keys to just delete the key
        else {
            console.log(
                `Node has ${this.numberOfKeys} <= ${
                    this.minDegree - 1
                } keys --> ${value} NOT deleted`
            );
        }
    }
}
