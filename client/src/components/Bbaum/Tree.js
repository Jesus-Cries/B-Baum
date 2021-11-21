import { TreeNode } from "./TreeNode";

export class Tree {
    constructor(minDegree) {
        this.root = null;
        this.minDegree = minDegree;
    }

    traverse() {
        if (this.root != null) {
            //check if tree is empty
            this.root.traverse();
        } else {
            console.log("Tree is empty");
        }
    }

    find(k) {
        if (this.root === null) {
            //check if tree is empty
            return null;
        } else {
            return this.root.find(k);
        }
    }

    insert(k) {
        if (this.root === null) {
            //check if tree is empty
            this.root = new TreeNode(this.minDegree, true, null); // make new node as leaf
            this.root.keys[0] = k; // add key to the node
            this.root.numberOfKeys = 1; // increase number of nodes
        } else {
            if (this.root.numberOfKeys === 2 * this.minDegree - 1) {
                //check if node (root) is full
                let newNode = new TreeNode(this.minDegree, false, null); // create new node
                this.root.parent = newNode;
                newNode.children[0] = this.root; // make the old root the child of the new root
                newNode.splitNode(0, this.root); // split the old root and move one of the keys to the root

                let i = 0;
                if (newNode.keys[0] < k) {
                    // search for child which is supposed to get the key
                    i++;
                }
                newNode.children[i].nodeNotFull(k);

                this.root = newNode; // makes the new node the root
            } else {
                this.root.nodeNotFull(k);
            }
        }
    }

    delete(k) {
        let nodeWithValue = this.find(k);

        if (nodeWithValue === null) return null;

        nodeWithValue.deleteKey(k);
    }
}
