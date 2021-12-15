import { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid, { GridSize } from "@material-ui/core/Grid";

import Node from "../../components/Node/Node";
import Control from "../../components/Control/Control";

import { Tree } from "./Tree";
import { TreeNode } from "./TreeNode";

const useStyles = makeStyles({
    root: {
        padding: 5,
    },
    container: {
        marginTop: 30,
        borderRadius: 50,
        backgroundColor: "#eee",
        justifyContent: "space-around",
    },
    outerContainer: {
        justifyContent: "space-around",
    },
    canvas: {
        position: "absolute",
    },
});

// TODO: Implement Change Order
// TODO: Implement Search correctly (showing node of the key on display)
// TODO: Integrate Deletion into upload and button

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
        traverserTreeBreadthFirst(tree.root, 0);
        setTreeAsArray(treeTopBottom);
    };

    const random = () => {
        console.log("Random");
    };

    const insert = (key: number) => {
        let tempTree: Tree = tree;
        tempTree.insert(key);
        console.log("Inserted: " + key);
        myTree = tempTree;
        setTree(tempTree);
        updateTree();
        forceUpdate();
    };

    const search = (key: number) => {
        console.log(tree);
        alert(tree.find(key).cost);
        console.log(myTree);
        console.log("Search");
    };

    // FIXME: Algorithm doesnt reorder the nodes properly
    const remove = (key: number) => {
        let tempTree: Tree = tree;
        tempTree.delete(key);
        setTree(tempTree);
        updateTree();
        console.log("Delete");
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
        //updateTree();
    };

    // Save tree from top to bottom as numbers
    let treeTopBottom: string[][][] = [];
    treeTopBottom[0] = [[]];

    const traverserTreeBreadthFirst = (root: TreeNode | null, level: number) => {
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

        traverserTreeBreadthFirstRecursion(root, 1);

        normalizeArray();

        return treeTopBottom;
    };

    const traverserTreeBreadthFirstRecursion = (root: TreeNode | null, level: number) => {
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
                traverserTreeBreadthFirstRecursion(child, level + 1);
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

        // let treeTopBottom: string[][][];
        traverserTreeBreadthFirst(tree.root, 0);
        // console.log("Weird stuff");
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
        console.log("Tree has changed --> NodeSize was changed");
    }, [tree]);

    useEffect(() => {
        console.log("Force update was called");
        traverserTreeBreadthFirst(tree.root, 0);
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
                                        return <Node values={node} />;
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
