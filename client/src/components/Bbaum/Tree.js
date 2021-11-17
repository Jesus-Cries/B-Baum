import { Node } from "./Node";


export class Tree{
    constructor(t){
        this.root = null;
        this.t = t;
    }

    traverse(){
        if(this.root != null){ //check if tree is empty
            this.root.traverse();
        }else{
            console.log("Tree is empty")
        }
    }

    find(k){
        if(this.root === null){ //check if tree is empty
            return null;
        }else{
            return this.root.find(k)
        }
    }

    insert(k){
        if(this.root === null){ //check if tree is empty
            this.root = new Node(this.t, true); // make new node as leaf
            this.root.keys[0] = k; // add key to the node
            this.root.n = 1; // increase number of nodes
        }else{
            if(this.root.n === (2*this.t)-1){ //check if node (root) is full
                let newNode = new Node(this.t, false); // create new node
                newNode.children[0] = this.root; // make the old root the child of the new root
                newNode.splitNode(0, this.root); // split the old root and move one of the keys to the root

                let i = 0;
                if (newNode.keys[0] < k){ // search for child which is supposed to get the key
                    i++;
                }
                newNode.children[i].nodeNotFull(k);

                this.root = newNode; // makes the new node the root

            }else {
                this.root.nodeNotFull(k);
            }
        }
    }
}