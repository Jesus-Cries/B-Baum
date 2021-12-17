import { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid, { GridSize } from "@material-ui/core/Grid";

import Node from "../../components/Node/Node";
import Control from "../../components/Control/Control";

import { Tree } from "./Tree";
import { TreeNode } from "./TreeNode";
import node from "../../components/Node/Node";
import React from "react";

const useStyles = makeStyles({
    root: {
        padding: 5,
    },
    container: {
        marginTop: 30,
        borderRadius: 50,
        backgroundColor: "#E9E9E9",
        justifyContent: "space-around",
    },
    outerContainer: {
        justifyContent: "space-around",
    },
    canvas: {
        position: "absolute",
    },
});

// TODO: Implement Search correctly (showing node of the key on display)

interface Props {}

const Bbaum: React.FC<Props> = () => {
    const classes = useStyles();
    //Knuth Order, k |  (min,max)  | CLRS Degree, t
    // ---------------|-------------|---------------
    //      0         |      -      |        –
    //      1         |      –      |        –
    //      2         |      –      |        –
    //      3         |    (2,3)    |        –
    //      4         |    (2,4)    |      t = 2
    //      5         |    (3,5)    |        –
    //      6         |    (3,6)    |      t = 3
    //      7         |    (4,7)    |        –
    //      8         |    (4,8)    |      t = 4
    //      9         |    (5,9)    |        –
    //      10        |    (5,10)   |      t = 5
    let myTree: Tree = new Tree(4);

    const [force, setForce] = useState<number>(1);
    const [tree, setTree] = useState<Tree>(new Tree(4)); // Der tatsächliche Baum
    const [nodeSize, setNodeSize] = useState<number>(tree.maxChildren);
    const [order, setOrder] = useState(tree.maxChildren);
    const [treeAsArray, setTreeAsArray] = useState<string[][][]>(
        // TODO: Setzt Defaultwerte für das Array. Nur nötig, weil in der Rendermoethode hardgecoded auf explizite Indizes zugegriffen wird (kann später weg)
        new Array(1).fill(new Array(1).fill(new Array(1).fill(" ")))
    );
    const [cost, setCost] = useState<number>(-1);
    const [searchNumber, setSearchNumber] = useState<string>("");

    const forceUpdate = () => {
        let newForce: number = Math.random();
        setForce(newForce);
    };

    const normalizeArray = () => {
        treeTopBottom.forEach((level) => {
            level.forEach((node) => {
                while (node.length < nodeSize) {
                    node.push("‎‎‏‏‎ ‎");
                }
            });
        });
    };

    const updateTree = () => {
        traverseTreeBreadthFirst(tree.root, 0);
        setTreeAsArray(treeTopBottom);
    };

    const random = () => {};

    const insert = (key: number) => {
        let tempTree: Tree = tree;
        tempTree.insert(key);
        console.log("Inserted: " + key);
        myTree = tempTree;
        setTree(tempTree);
        forceUpdate();
    };

    const search = (key: number) => {
        console.log(tree);
        let node = tree.find(key);
        if (node === null) return;
        let nodeCost = node.cost;
        if (nodeCost == null || undefined) {
            console.log("Key not found");
        } else {
            console.log("Cost:" + nodeCost);
            setCost(nodeCost);
            console.log(myTree);
            console.log("Search");
        }
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                setSearchNumber(i % 2 === 0 ? key.toString() : "");
                forceUpdate();
            }, 500 * i);
        }
    };

    // FIXME: Algorithm doesnt reorder the nodes properly
    const remove = (key: number) => {
        let tempTree: Tree = tree;
        tempTree.delete(key);
        setTree(tempTree);
        updateTree();
        forceUpdate();
        console.log(tree);
    };

    const reset = () => {
        myTree.root = null;
        tree.root = null;
        updateTree();
    };

    const changeOrder = (order: number) => {
        if (order < 4) order = 4;
        let newOrder = Math.ceil(order / 2) * 2;
        console.log(newOrder);
        setOrder(newOrder);
        let tempTree: Tree = new Tree(newOrder);
        for (let i = 0; i < treeAsArray.length; i++) {
            for (let j = 0; j < treeAsArray[i].length; j++) {
                for (let k = 0; k < treeAsArray[i][j].length; k++) {
                    tempTree.insert(treeAsArray[i][j][k]);
                }
            }
        }
        myTree = tempTree;
        setTree(tempTree);
    };

    // Save tree from top to bottom as numbers
    let treeTopBottom: string[][][] = [];
    treeTopBottom[0] = [[]];

    const traverseTreeBreadthFirst = (root: TreeNode | null, level: number) => {
        if (root != null) {
            let childIndex = 0;
            // Initialize current tree level in array
            treeTopBottom[level][childIndex] = [];

            // Iterate over all keys of a node
            root?.keys.forEach((key: string, index: number) => {
                treeTopBottom[level][childIndex][index] = key;
            });
        }
        treeTopBottom[1] = [];

        traverseTreeBreadthFirstRecursion(root, 1);

        normalizeArray();

        return treeTopBottom;
    };

    const traverseTreeBreadthFirstRecursion = (root: TreeNode | null, level: number) => {
        // console.log("Root level: " + level);

        let childIndex = 0;
        // Determines the childIndex for the current level
        for (let i = 0; i < treeTopBottom[level].length; i++) {
            childIndex = i;
        }
        if (treeTopBottom[level].length > 1) {
            childIndex++;
        }

        if (root != null) {
            // Iterate over all children of root to get their values
            root?.children.forEach((child) => {
                treeTopBottom[level][childIndex] = [];

                // Iterate over all keys of a node
                child.keys.forEach((key: string, index: number) => {
                    treeTopBottom[level][childIndex][index] = key;
                });
                childIndex++;
            });
            // Add border element to indicate children end of the current root
            if (treeTopBottom[level].length !== 0) {
                treeTopBottom[level][childIndex] = ["border"];
            }

            // Iterate over all children of a node
            root.children.forEach((child) => {
                childIndex = 0;
                // Check if next level has been initialized
                if (typeof treeTopBottom[level + 1] === "undefined") {
                    // Define undefined level
                    treeTopBottom[level + 1] = [];
                }
                traverseTreeBreadthFirstRecursion(child, level + 1);
            });
        }
    };

    // Neuer useEffect hook mit dependency bTree
    // getRootAndChildren ausführen
    // array normalisieren -> jedes array hat für jede node die selbe länge
    // setBbaum() ausführen -> akutalisiert das ui
    // in der render methode auf basis von bbaum das array rendern
    useEffect(() => {
        tree.traverse();
        normalizeArray();

        traverseTreeBreadthFirst(tree.root, 0);

        // treeTopBottom[3][0] = ["2", "1"];
        // treeTopBottom[3][1] = ["border", "1"];
        // treeTopBottom[3][2] = ["2", "4"];
        // treeTopBottom[3][3] = ["border", "1"];
        // treeTopBottom[3][4] = ["2", "4"];
        // treeTopBottom[3][5] = ["border", "1"];
        // treeTopBottom[3][6] = ["2", "4"];
        // treeTopBottom[3][7] = ["border", "1"];
        // treeTopBottom[3][8] = ["2", "4"];
        // treeTopBottom[3][9] = ["border", "1"];
        // treeTopBottom[3][10] = ["2", "4"];
        // treeTopBottom[3][11] = ["border", "1"];
        // treeTopBottom[3][12] = ["2", "4"];
        // treeTopBottom[3][13] = ["border", "1"];
        // treeTopBottom[3][14] = ["2", "4"];
        // treeTopBottom[3][15] = ["border", "1"];
        // treeTopBottom[3][16] = ["2", "4"];
        // treeTopBottom[3][17] = ["border", "1"];
        // treeTopBottom[3][18] = ["2", "4"];
        // treeTopBottom[3][19] = ["border", "1"];

        normalizeArray();
        treeTopBottom.forEach((element) => {
            // console.log(element);
        });

        setTreeAsArray(treeTopBottom);

        // treeTopBottom.map((item) => {
        //     console.log("Test print Nodes: " + item);
        // });
    }, []); // Wird zu Beginn einmal ausgeführt

    useEffect(() => {
        setNodeSize(tree.maxChildren);
    }, [tree.maxChildren]);

    useEffect(() => {
        traverseTreeBreadthFirst(tree.root, 0);
        setTreeAsArray(treeTopBottom);
    }, [nodeSize]);

    useEffect(() => {
        traverseTreeBreadthFirst(tree.root, 0);
        setTreeAsArray(treeTopBottom);
    }, [force]);

    return (
        <Box className={classes.root}>
            <Control
                random={random}
                insert={insert}
                search={search}
                remove={remove}
                order={order}
                changeOrder={changeOrder}
                reset={reset}
                cost={cost}
                searchedFor={searchNumber}
            />

            {treeAsArray.map((level) => {
                let hasBorder = false;

                let levelCopy: string[][] = level;
                let levelSplit: string[][][] = [];
                let childrenIndex: number = 0;
                let startIndex: number = 0;
                let endIndex: number = 0;

                level.forEach((node) => {
                    levelSplit[childrenIndex] = [[]];
                    if (node[0] === "border") {
                        levelSplit[childrenIndex] = levelCopy.slice(startIndex, endIndex);
                        childrenIndex++;

                        startIndex = endIndex;
                        // Skips border node
                        startIndex++;

                        hasBorder = true;
                    }
                    endIndex++;
                });

                // Adds whole level to levelSplit because level without borders wont be added in loop
                if (!hasBorder) {
                    levelSplit[childrenIndex] = levelCopy;
                }

                // Apply appropriate scaling factor to Grids
                let scaling: number = 12;
                if (levelSplit.length !== 0) {
                    scaling = 12 / levelSplit.length;
                    scaling = Math.round(scaling);
                }
                let scalingConvert: GridSize = scaling as GridSize;

                // Return Grid for current level
                return (
                    <Grid className={classes.outerContainer} container>
                        {levelSplit.map((element) => {
                            return (
                                <Grid className={classes.container} xs={scalingConvert} container>
                                    {element.map((node) => {
                                        return <Node searchedFor={searchNumber} values={node} />;
                                    })}
                                </Grid>
                            );
                        })}
                    </Grid>
                );
            })}
        </Box>
    );
};

export default Bbaum;
