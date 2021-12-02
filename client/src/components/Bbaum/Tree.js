import { TreeNode } from "./TreeNode";
import { runInNewContext } from "vm";
import { flatten } from "express/lib/utils";

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

    // Testing----------------------------------------------------------------------------------------------------------

    insertTest(value){
        let actual = this.root;
        if (actual === null) {
            //check if tree is empty
            this.root = new TreeNode(this.maxChildren, true, null); // make new node as leaf
            this.root.keys[0] = value; // add key to the node
            //this.root.numberOfKeys = 1; // increase number of nodes
        } else if (actual.numberOfKeys >= this.maxChildren) {
            // Create a new node to become the root
            // Append the old root to the new one
            let temp = new TreeNode(this.root.maxChildren, false, null);
            temp.tree = this;
            this.root = temp;
            temp.addChild(actual, 0);
            this.split(actual, temp, 1);
            this.insertNonFull(temp, parseInt(value));
        } else {
            this.insertNonFull(actual, parseInt(value));
        }
    }

    split(child, parent, pos) {
        let newChild = new TreeNode(this.maxChildren,child.leaf,parent);
        //
        // Create a new child
        // Pass values from the old child to the new
        //console.log(child.keys);
        for (let k = 1; k < this.maxKeys; k++) {
            //console.log(this.maxKeys)
            //console.log(child.keys)
            newChild.addValue(child.removeValue(this.maxKeys));
        }
        // Trasspass child nodes from the old child to the new
        if (!child.leaf) {
            for (let k = 1; k <= this.minChildren; k++) {
                newChild.addChild(child.deleteChild(this.minChildren), k - 1);
            }
        }
        // Add new child to the parent
        parent.addChild(newChild, pos);
        // Pass value to parent
        parent.addValue(child.removeValue(this.minChildren - 1));
        parent.leaf = false;
    }

    insertNonFull(node, value) {
        if (node.leaf) {
            node.addValue(value);
            return;
        }
        let temp = node.numberOfKeys;
        while (temp > 0 && value < node.keys[temp - 1]) {
            temp = temp - 1;
        }

        //console.log(node.children[temp].keys)
        let inserted = false;

        if (node.children[temp].numberOfKeys === this.maxKeys) {
            //console.log("Temp: " + temp)
            //console.log("Value to split" + value)
            //console.log(node)
            inserted = true;
            node.children[temp].addValue(value);
            this.split(node.children[temp], node, temp + 1);
            if (value  > node.keys[temp]) {
                temp = temp + 1;
            }
        }
        if (inserted === false){
            this.insertNonFull(node.children[temp], value);
        }
        if (node.numberOfKeys > this.maxKeys && node.parent == null){
            this.splitRoot();
        }
        //console.log(node.keys)
    }

    splitRoot(){
        console.log("splitroot")
        let newRoot = new TreeNode(this.maxChildren,false,null);
        let oldRoot = this.root;
        this.root = newRoot;
        newRoot.addValue(oldRoot.removeValue(this.minChildren-1));
        for (let i = 0; i < oldRoot.numberOfKeys; i++){
            let newChild = new TreeNode(this.maxChildren, false,this.root);
            newChild.addValue(oldRoot.keys[i]);
            newRoot.addChild(newChild,i);
            for (let j = 0+i; j<this.minChildren+i;j++) {
                console.log(oldRoot.children[i+j].keys)
                console.log(this.minChildren)
                console.log(i +" "+ j)
                newChild.addChild(oldRoot.children[j+i],j);
            }
        }
        console.log(this)
    }

    // Testing

    insert(k) {
        if (this.root === null) {
            //check if tree is empty
            this.root = new TreeNode(this.maxChildren, true, null); // make new node as leaf
            this.root.keys[0] = k; // add key to the node
        } else {
            if (this.root.keys.length === this.maxKeys) {
                //check if node (root) is full
                let newNode = new TreeNode(this.maxChildren, false, null); // create new node
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
