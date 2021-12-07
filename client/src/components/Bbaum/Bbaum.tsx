import { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

import Node from "../../components/Node/Node";
import Control from "../../components/Control/Control";

import { Tree } from "./Tree";
import { TreeNode } from "./TreeNode";
import { forEachLeadingCommentRange } from "typescript";

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
    let myTree: Tree = new Tree(3);
    let tempTreeAsArrayForInitialization: string[][] = [
        ["10"],
        ["3", "7"],
        ["13", "19"],
        ["1", "2"],
        ["8", "9"],
        ["11", "12"],
        ["20", "21"],
        ["4", "5", "6"],
        ["14", "15", "16"],
    ]; // TODO: Kann eig gelöscht werden. Deswegen steht am Anfang was drinne.

    const [tree, setTree] = useState<Tree>(new Tree(3)); // Der tatsächliche Baum
    const [nodeSize, setNodeSize] = useState<number>(tree.maxChildren);
    const [treeAsArray, setTreeAsArray] = useState<string[][][]>(
        // TODO: Setzt Defaultwerte für das Array. Nur nötig, weil in der Rendermoethode hardgecoded auf explizite Indizes zugegriffen wird (kann später weg)
        new Array(tempTreeAsArrayForInitialization.length).fill(
            new Array(1).fill(new Array(1).fill(" "))
        )
    );

    const normalizeArray = (/* array kommt hier rein */) => {
        treeTopBottom.forEach((level) => {
            level.forEach((node) => {
                while (node.length < nodeSize) {
                    node.push("‎‎‏‏‎ ‎");
                }
            });
        });
    };

    const drawLines = () => {
        const canvas: HTMLCanvasElement | null = document.getElementById(
            "canvas"
        ) as HTMLCanvasElement;
        if (canvas) {
            const context = canvas.getContext("2d");
            context?.beginPath();
            context?.moveTo(702, 172);
            context?.lineTo(358, 273);
            context!.lineWidth = 1;
            context!.strokeStyle = "#777";
            context?.stroke();
        }
    };

    const random = () => {
        console.log("Random");
    };

    const insert = (key: number) => {
        let tempTree: Tree = tree;
        tempTree.insertTest(key);
        console.log("Inserted: " + key);
        // @ts-ignore
        // console.log(tempTree);
        tempTree.traverse();
        myTree = tempTree;
        setTree(tempTree);
    };

    const search = (key: number) => {
        console.log(tree);
        alert(tree.find(key).cost);
        console.log(myTree);
        console.log("Search");
    };

    // Couldn't name this method "delete" as that name seems to be already used by React
    const remove = () => {
        console.log("Delete");
    };

    const reset = () => {
        myTree.root = null;
        tree.root = null;
    };

    const changeOrder = () => {};

    const createTree = () => {
        let tempTree: Tree = tree; // bTree ist ein State (Variable von der das Rendering abhängt) -> soll nicht direkt geändert werden

        // for (let i = 0; i < 11; i++) {
        //     let rndInt = Math.floor(Math.random() * 500) + 1;
        //     console.log(rndInt);
        //     tempTree.insertTest(rndInt);
        // }
        tempTree.insertTest(10);
        tempTree.insertTest(20);
        tempTree.insertTest(5);
        tempTree.insertTest(8);
        tempTree.insertTest(12);
        tempTree.insertTest(17);
        tempTree.insertTest(60);
        tempTree.insertTest(11);
        tempTree.insertTest(13);
        tempTree.insertTest(14);
        tempTree.insertTest(15);
        // tempTree.insertTest(40);

        // tempTree.insertTest(16);
        // tempTree.insertTest(18);
        // tempTree.insertTest(19);

        console.log(tempTree);
        tempTree.traverse();

        console.log("------- DELETE -------");

        let testCase = 20;
        // Base: 10, 17 --> - 5,8 - 12 - 20,60

        switch (testCase) {
            // Expected result: 10, 20 --> - 5 - 17 - 60 -
            case 1: // Forces theft from right sibling
                tempTree.delete(8);
                tempTree.delete(12);
                break;

            // Expected result: 8, 17 --> - 5 - 10 - 20,60 -
            case 2: // Forces theft from left sibling
                tempTree.delete(12);
                break;

            // Expected result: 17 --> - 10,12 - 20,60 -
            case 3: // Forces merge with right sibling
                tempTree.delete(5);
                tempTree.delete(8);
                break;

            // Expected result: 17 --> - 5,10 - 60 -
            case 4: // Forces merge with left sibling
                tempTree.delete(8);
                tempTree.delete(20);
                tempTree.delete(12);
                break;

            // Expected result: 8,17 --> - 5 - 12 - 20,60
            case 5: // Forces theft from left child
                tempTree.delete(10);
                break;

            // Expected result: 20 --> - 12 - 60 -
            case 6: // Forces theft from right child
                tempTree.delete(5);
                tempTree.delete(8);
                tempTree.delete(10);
                tempTree.delete(17);
                break;

            // Expected result: 17 --> - 8,12 - 60 -
            case 7: // Forces merge of left and right children
                tempTree.delete(5);
                tempTree.delete(20);
                tempTree.delete(10);
                break;

            // Expected result: 10 --> - 8 - 12,60 -
            case 8: // Forces merge of left and right children (Alternative)
                tempTree.delete(5);
                tempTree.delete(20);
                tempTree.delete(17);
                break;

            // Expected result: 10 --> - 7 - 17 - --> - 5 - 8 - 12 - 20 -
            case 9: // Forces merging of parent with child
                tempTree.delete(60);
                tempTree.insertTest(7);
                break;
            default:
                break;
        }

        console.log(tempTree);
        console.log("        " + tempTree.root?.keys);

        let childrenKeys = "    - ";
        tempTree.root?.children.forEach((child: TreeNode) => {
            childrenKeys += "|";
            childrenKeys += child.keys + " - ";
            childrenKeys += "|";
        });
        console.log(childrenKeys);

        let grandchildrenKeys = "- ";
        tempTree.root?.children.forEach((child: TreeNode) => {
            child.children.forEach((grandchild) => {
                grandchildrenKeys += "|";
                grandchildrenKeys += grandchild.keys + " - ";
                grandchildrenKeys += "|";
            });
        });
        console.log(grandchildrenKeys);

        // myTree.traverse();

        myTree = tempTree;
        setTree(tempTree);
        console.log(myTree);
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

        // Removes empty empty lower level arrays
        for (let i = 0; i < treeTopBottom.length; i++) {
            if (treeTopBottom[i].length == 0) {
                treeTopBottom.splice(i);
            }
        }

        normalizeArray();

        return treeTopBottom;
    };

    const traverserTreeBreadthFirstRecursion = (root: TreeNode | null, level: number) => {
        console.log("Root level: " + level);

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
        createTree();
        normalizeArray();
        drawLines();

        // let treeTopBottom: string[][][];
        traverserTreeBreadthFirst(tree.root, 0);
        console.log("Weird stuff");
        treeTopBottom.forEach((element) => {
            console.log(element);
        });

        setTreeAsArray(treeTopBottom);

        // treeTopBottom.map((item) => {
        //     console.log("Test print Nodes: " + item);
        // });
    }, []); // Wird zu Beginn einmal ausgeführt

    return (
        <Box className={classes.root}>
            <Control
                random={random}
                insert={insert}
                search={search}
                remove={remove}
                order={tree.minChildren}
                changeOrder={changeOrder}
                reset={reset}
            />

            {treeAsArray.map((level) => {
                return (
                    <Grid className={classes.container} container>
                        {level.map((node) => {
                            console.log(node);
                            return <Node values={node} />;
                        })}
                    </Grid>
                );
            })}

            {/* <Grid className={classes.container} container>
                <Node values={treeAsArray[0]} />
            </Grid>

            <Grid className={classes.container} container>
                <Node values={treeAsArray[1]} />
                <Node values={treeAsArray[2]} />
            </Grid>

            <Grid className={classes.outerContainer} container>
                <Grid className={classes.container} xs={6} container>
                    <Node values={treeAsArray[3]} />
                    <Node values={treeAsArray[4]} />
                    <Node values={treeAsArray[5]} />
                </Grid>

                <Grid className={classes.container} xs={6} container>
                    <Node values={treeAsArray[6]} />
                    <Node values={treeAsArray[7]} />
                    <Node values={treeAsArray[8]} />
                </Grid>
            </Grid> */}

            {/* <Grid className={classes.container} container>
                <Node values={bbaum[3]} />
                <Node values={bbaum[4]} />
                <Node values={bbaum[5]} />
                <Node values={bbaum[6]} />
                <Node values={bbaum[7]} />
                <Node values={bbaum[8]} />
            </Grid> */}
        </Box>
    );
};

export default Bbaum;
