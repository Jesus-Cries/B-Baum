export class TreeNode {
    constructor(maxChildren, leaf, parent) {
        this.maxChildren = maxChildren;
        this.minChildren = Math.ceil(maxChildren / 2);
        this.maxKeys = maxChildren - 1;
        this.minKeys = Math.ceil(maxChildren / 2) - 1;
        this.leaf = leaf; // (boolean) If leaf or not
        this.keys = []; // Array with keys for the nodes (2 * minChildren - 1)
        this.children = []; // Array with child nodes (2 * minChildren)
        this.parent = parent;
        this.cost = 0;
    }

    traverse() {
        let array = [];
        let i = 0;
        for (i = 0; i < this.keys.length; i++) {
            // Iterate through all leaf notes
            if (this.leaf === false) {
                // If this is not a leaf, then traverse the subtree, before printing the keys
                this.children[i].traverse();
            }
            if (this.keys[i]) {
                console.log(this.keys[i]);
                array.push(this.keys[i]);
            }
        }
        //console.log(this.keys);

        if (this.leaf === false) {
            // print subtree rooted with last child
            this.children[i].traverse();
        }

        console.log(array);
    }

    find(key) {
        if (this.parent == null) {
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

    addChild(node, position) {
        console.log(this);
        this.children.splice(position, 0, node);
        node.parent = this;
    }

    addValue(value) {
        if (!value) {
            return;
        }
        let pos = 0;
        while (pos < this.keys.length && this.keys[pos] < value) {
            pos++;
        }
        this.keys.splice(pos, 0, value);
    }

    deleteChild(pos) {
        return this.children.splice(pos, 1)[0];
    }

    removeValue(pos) {
        if (pos >= this.keys.length) {
            return null;
        }
        return this.keys.splice(pos, 1)[0];
    }

    get numberOfKeys() {
        return this.keys.length;
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
