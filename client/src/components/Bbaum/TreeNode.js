export class TreeNode {
    constructor(maxChildren, minChildren, maxKeys, minKeys, leaf, parent) {
        this.maxChildren = maxChildren;
        this.minChildren = minChildren; // (int) Min-degree of the tree
        this.maxKeys = maxKeys;
        this.minKeys = minKeys;
        this.leaf = leaf; // (boolean) If leaf or not
        this.keys = []; // Array with keys for the nodes (2 * minChildren - 1)
        this.children = []; // Array with child nodes (2 * minChildren)
        this.parent = parent;
        this.cost = 0;
    }

    traverse() {
        let i = 0;
        for (i = 0; i < this.keys.length; i++) {
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
        while (i < this.keys.length && key > this.keys[i]) {
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

        this.children[i].cost = this.cost + 1;
        return this.children[i].find(key); // go to child of the node to find the key
    }

    splitNode(value, node) {
        // splits the children of the given node (only works if node is full)
        let newNode = new TreeNode(
            this.maxChildren,
            this.minChildren,
            this.maxKeys,
            this.minKeys,
            node.leaf,
            this
        ); // create new node which store (minChildren-1) nodes
        // let x;
        for (let i = 0; i < this.minChildren - 1; i++) {
            // copies the last minChildren-1 keys from the old to the new node
            newNode.keys[i] = node.keys[i + this.minChildren];
            //node.keys.splice(i+this.minChildren, 1)
        }
        node.keys = node.keys.filter((el) => !newNode.keys.includes(el));
        //node.children.filter(Number);

        if (node.leaf === false) {
            // copies the last children to the new TreeNode
            for (let i = 0; i < this.minChildren; i++) {
                newNode.children[i] = node.children[i + this.minChildren];
            }
        }

        for (let i = 0; i >= value + 1; i--) {
            // move children to the right to make space for the new child
            this.children[i + 1] = this.children[i];
        }

        this.children[value + 1] = newNode; // link child to the new node

        for (let i = this.keys.length - 1; i >= value; i--) {
            // key of the old node is transfered to this node and move all keys greater than the new key one to the right
            this.keys[i + 1] = this.keys[i];
        }

        this.keys[value] = node.keys[this.minChildren - 1];
        node.keys.splice(this.minChildren - 1, 1);
    }

    nodeNotFull(key) {
        let i = this.keys.length - 1; // make i the pointer to the last element in array

        if (this.leaf === true) {
            // if node is a leaf
            while (i >= 0 && this.keys[i] > key) {
                // traverse keys in order to find location for the new key
                this.keys[i + 1] = this.keys[i]; // moves ll keys greater than key one to the right
                i--;
            }
            this.keys[i + 1] = key; // inserts key
        } else {
            while (i >= 0 && this.keys[i] > key) {
                // find child which is supposed to get the new key
                i--;
            }
            if (this.children[i + 1].keys.length === 2 * this.minChildren - 1) {
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
    // TODO: After merging if the parent node has less than the minimum number of keys then, look for the siblings as in Case I.
    deleteKey(value) {
        console.log(`------- DELETING ${value} -------`);

        let index = this.keys.indexOf(value);

        // NODE IS LEAF
        if (this.leaf) {
            console.log("Node is a leaf");

            // ENOUGH KEYS
            if (this.keys.length > this.minKeys) {
                console.log("Enough keys for simple deletion");
                return this.keys.splice(index, 1);
            }

            // NOT ENOUGH KEYS
            console.log("NOT enough keys for simple removal");
            let indexInParentsChildren = this.parent.children.indexOf(this);

            // SIBLING TO LEFT EXISTS
            let leftSiblingsExists = indexInParentsChildren - 1 >= 0;
            if (leftSiblingsExists) {
                console.log("Sibling to the left exists");
                // SIBLING HAS ENOUGH KEYS FOR THEFT
                if (
                    this.parent.children[indexInParentsChildren - 1].keys.length >
                    this.minChildren - 1
                ) {
                    console.log("Has enough keys for theft");
                    return this.theftFromSibling(index, indexInParentsChildren, "Left");
                }
            }

            // SIBLING TO RIGHT EXISTS
            let rightSiblingExists = indexInParentsChildren + 1 < this.parent.children.length;
            if (rightSiblingExists) {
                console.log("Sibling to the right exists");
                // SIBLING HAS ENOUGH KEYS FOR THEFT
                if (
                    this.parent.children[indexInParentsChildren + 1].keys.length >
                    this.minChildren - 1
                ) {
                    console.log("Has enough keys for theft");
                    return this.theftFromSibling(index, indexInParentsChildren, "Right");
                }
            }

            // MERGE WITH LEFT SIBLING
            if (leftSiblingsExists) {
                console.log("Merge with left sibling");
                return this.mergeWithSibling(index, indexInParentsChildren, "Left");
            }

            // MERGE WITH RIGHT SIBLING
            if (rightSiblingExists) {
                console.log("Merge with right sibling");
                return this.mergeWithSibling(index, indexInParentsChildren, "Right");
            }
        }

        // NODE IS INTERNAL
        console.log("Node is internal");

        // Check if child "to the left" has more than the minimum number of keys
        // Index of deleted key === key of child that has lesser values

        // STEAL FROM LEFT CHILD
        if (this.children[index].keys.length > this.minKeys) {
            console.log("Left child to key has enough keys");

            // Take highest key of left child
            let highestKeyFromLeftChild = this.children[index].keys.splice(
                this.children[index].keys.length - 1,
                1
            )[0];

            // Put that key at the place where the old key was deleted
            return (this.keys[index] = highestKeyFromLeftChild);
        }

        // STEAL FROM RIGHT CHILD
        if (this.children[index + 1].keys.length > this.minKeys) {
            console.log("Right child to key has enough keys");

            // Take lowest key from right child
            let lowestKeyFromRightChild = this.children[index + 1].keys.splice(0, 1)[0];

            // Put that key at the place where the old key was deleted
            return (this.keys[index] = lowestKeyFromRightChild);
        }

        // MERGE LEFT AND RIGHT CHILDREN
        this.keys.splice(index, 1);

        // Get keys from left child
        let keysFromLeftChild = this.children[index].keys;

        // Put keys in right child
        this.children[index + 1].keys.splice(0, 0, keysFromLeftChild);

        return this.children.splice(index, 1);
    }

    theftFromSibling(index, indexInParentsChildren, siblingSide) {
        // Delete key in this node
        this.keys.splice(index, 1);

        // Set sibling dependent variables
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
        this.parent.keys.splice(parentIndexToPutSiblingKeyIn, 0, keyFromSibling);
    }

    mergeWithSibling(index, indexInParentsChildren, siblingSide) {
        // Delete key in this node
        this.keys.splice(index, 1);

        // Set sibling dependent variables
        let indexOffset = siblingSide === "Left" ? -1 : 1;
        let siblingIndexToPutParentKeyIn =
            siblingSide === "Left"
                ? this.parent.children[indexInParentsChildren + indexOffset].keys.length
                : 0;

        // Put lowest key from parent in sibling
        let keyFromParent = this.parent.keys.splice(0, 1)[0];
        this.parent.children[indexInParentsChildren + indexOffset].keys.splice(
            siblingIndexToPutParentKeyIn,
            0,
            keyFromParent
        );

        // Remove self from children list in parent
        this.parent.children.splice(indexInParentsChildren, 1);
    }
}
