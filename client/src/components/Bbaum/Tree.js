import { TreeNode } from "./TreeNode";

export class Tree {
    constructor(degree) {
        this.root = null;
        this.maxChildren = degree;
        this.minChildren = Math.ceil(degree / 2);
        this.maxKeys = degree - 1;
        this.minKeys = Math.ceil(degree / 2) - 1;
    }

    traverse() {
        if (this.root != null) {
            // Check if tree is empty
            this.root.traverse();
        } else {
            console.log("Tree is empty");
        }
    }

    find(k) {
        if (this.root === null) {
            // Check if tree is empty
            return null;
        } else {
            if (this.root.find(k) != null || undefined) {
                return this.root.find(k);
            } else {
                return "Key not found";
            }
        }
    }

    insert(key) {
        let currentRoot = this.root;

        if (currentRoot === null) {
            // Check if tree is empty
            this.root = new TreeNode(this, this.maxChildren, true, null); // make new node as leaf
            this.root.keys[0] = key; // add key to the node
        } else if (currentRoot.numberOfKeys === this.maxKeys) {
            // If root is full create a new node to become the root
            // Make the old root a child of the new Root
            let newRoot = new TreeNode(this, this.root.maxChildren, false, null);
            newRoot.tree = this;
            this.root = newRoot;
            newRoot.addChild(currentRoot, 0);
            this.splitNode(currentRoot, newRoot, 1);

            // After split add key normally
            this.insertNotFullNode(newRoot, parseInt(key));
        } else {
            // Else just insert the value into next best node
            this.insertNotFullNode(currentRoot, parseInt(key));
        }
    }

    splitNode(child, parent, index) {
        // Create a new child
        let newChild = new TreeNode(this, this.maxChildren, child.leaf, parent);

        // Give the new child the keys from the old child
        for (let k = 1; k < this.minChildren; k++) {
            let deletedVal = child.deleteKey(this.minChildren);
            newChild.addKey(deletedVal);
        }

        // Give the new child the children from the old child
        if (!child.leaf) {
            for (let k = 1; k <= this.minChildren; k++) {
                let deletedKid = child.deleteChild(this.minChildren);
                newChild.addChild(deletedKid, k - 1);
            }
        }

        // Give parent the new child
        parent.addChild(newChild, index);

        // Give parent the key
        let deletedVal = child.deleteKey(this.minChildren - 1);
        parent.addKey(deletedVal);
        parent.leaf = false;
    }

    insertNotFullNode(node, key) {
        if (node.leaf) {
            // Give lead node the key
            node.addKey(key);
            return;
        }

        // Iterate through the keys to see where the new Key should be added
        let currentKeyIndex = node.numberOfKeys;
        while (currentKeyIndex > 0 && key < node.keys[currentKeyIndex - 1]) {
            currentKeyIndex--;
        }

        let inserted = false;
        if (node.children[currentKeyIndex].numberOfKeys === this.maxKeys) {
            // Split the node if node is already full
            this.splitNode(node.children[currentKeyIndex], node, currentKeyIndex + 1);

            // After splitting the node check to which child the key should be added
            if (key > node.keys[currentKeyIndex]) {
                currentKeyIndex++;
            }
        }

        if (inserted === false) {
            this.insertNotFullNode(node.children[currentKeyIndex], key);
        }
    }

    splitRoot() {
        let newRoot = new TreeNode(this, this.maxChildren, false, null);
        let oldRoot = this.root;
        this.root = newRoot;

        newRoot.addKey(oldRoot.deleteKey(this.minChildren - 1));

        for (let i = 0; i < oldRoot.numberOfKeys; i++) {
            let newChild = new TreeNode(this, this.maxChildren, false, this.root);

            newChild.addKey(oldRoot.keys[i]);
            newRoot.addChild(newChild, i);

            for (let j = 0 + i; j < this.minChildren + i; j++) {
                newChild.addChild(oldRoot.children[j + i], j);
            }
        }
    }

    delete(k) {
        let nodeWithValue = this.find(k);

        if (nodeWithValue === null) return null;

        nodeWithValue.removeKey(k);
        nodeWithValue.checkForParent();
    }
}
