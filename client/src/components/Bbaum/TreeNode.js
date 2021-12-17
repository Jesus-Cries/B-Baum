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
                array.push(this.keys[i]);
            }
        }

        if (this.leaf === false) {
            // Print subtree rooted with last child
            this.children[i].traverse();
        }
    }

    find(key) {
        if (this.parent == null) {
            this.cost = 0;
        }
        let i = 0;
        while (i < this.keys.length && key > this.keys[i]) {
            // Find key which is equal or greater than key
            this.cost++;
            i++;
        }

        if (this.keys[i] === key) {
            // If key found return the key
            return this;
        }

        if (this.leaf === true) {
            // If the key is not found it is a leaf
            // Alternative: If the node is a leaf then the key is not in the tree
            return null;
        }

        // Adds cost to child if the next child is to be searched
        this.children[i].cost = this.cost + 1;
        return this.children[i].find(key); // Go to child of the node to find the key
    }

    addChild(node, index) {
        // Adds child at given index
        this.children.splice(index, 0, node); // Adds node at given index
        node.parent = this;
    }

    addKey(Key) {
        if (!Key) return;
        // Search fitting index for insertion and insert it
        let index = 0;
        while (index < this.keys.length && this.keys[index] < Key) {
            index++;
        }
        this.keys.splice(index, 0, Key);
    }

    deleteChild(index) {
        // If index is set delete child at index and return child
        // (Returning the Child helps with copy operation)
        if (!index) return;
        let deletedChild = this.children.splice(index, 1)[0];
        return deletedChild;
    }

    deleteKey(index) {
        if (!index) return;
        // Delete key at position if position is inside keys array and return deletedKey
        // (Returning the Key helps with copy operation)
        if (index >= this.keys.length) {
            return null;
        }
        let deletedKey = this.keys.splice(index, 1)[0];
        return deletedKey;
    }

    get numberOfKeys() {
        return this.keys.length;
    }

    // Explanation: https://www.programiz.com/dsa/deletion-from-a-b-tree
    // TODO: After merging if the parent node has less than the minimum number of keys then, look for the siblings as in Case I.
    removeKey(value) {
        console.log(`------- DELETING ${value} -------`);

        let index = this.keys.indexOf(value);
        let indexInParentsChildren = this.parent.children.indexOf(this);

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

        console.log("Merge left and right children");
        // MERGE LEFT AND RIGHT CHILDREN
        this.keys.splice(index, 1);

        // Get keys from left child
        let keysFromLeftChild = this.children[index].keys;

        // Put keys in right child
        keysFromLeftChild.reverse().forEach((currentKey) => {
            this.children[index + 1].keys.splice(0, 0, currentKey);
        });

        this.children.splice(index, 1);

        // CASE 3
        // -------------------------------------------------------------------------------

        if (this.keys < this.minKeys) {
            console.log("NOT enough keys anymore");

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
        let sibling = this.parent.children[indexInParentsChildren + indexOffset];

        // Put lowest key from parent in sibling
        let keyFromParent = this.parent.keys.splice(0, 1)[0];
        this.parent.children[indexInParentsChildren + indexOffset].keys.splice(
            siblingIndexToPutParentKeyIn,
            0,
            keyFromParent
        );

        // TODO: Check if this works for both sides
        // Give children to sibling
        if (this.children.length > 0) {
            this.children.forEach((child) => {
                child.parent = sibling;
                sibling.addChild(child, sibling.children.length);
            });
        }

        // Remove self from children list in parent
        this.parent.children.splice(indexInParentsChildren, 1);
    }
}
