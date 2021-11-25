import { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

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
    let myTree: Tree = new Tree(3);
    let tempBbaum: string[][] = [
        ["10"],
        ["3", "7"],
        ["13", "19"],
        ["1", "2"],
        ["8", "9"],
        ["11", "12"],
        ["20", "21"],
        ["4", "5", "6"],
        ["14", "15", "16", "18"],
    ];
    //test
    const [bTree, setbTree] = useState<Tree>(new Tree(3));
    //test
    const [nodeSize, setNodeSize] = useState<number>(5);
    const [bbaum, setBbaum] = useState<string[][]>(
        new Array(tempBbaum.length).fill(new Array(1).fill(" "))
    );

    const normalizeArray = () => {
        for (let i = 0; i < tempBbaum.length; i++) {
            while (tempBbaum[i].length < nodeSize) {
                tempBbaum[i].push("‎‎‏‏‎ ‎");
            }
        }
        setBbaum(tempBbaum);
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
        let tempTree: Tree = bTree;
        tempTree.insert(key);
        console.log("Inserted: " + key);
        // @ts-ignore
        // console.log(tempTree);
        tempTree.traverse();
        myTree = tempTree;
        setbTree(tempTree);
    };

    const search = (key: number) => {
        console.log(bTree);
        alert(bTree.find(key).cost);
        console.log(myTree);
        console.log("Search");
    };

    // Couldn't name this method "delete" as that name seems to be already used by React
    const remove = () => {
        console.log("Delete");
    };

    const reset = () => {
        myTree.root = null;
        bTree.root = null;
    };

    const changeOrder = () => {};

    const createTree = () => {
        let tempTree: Tree = bTree;

        tempTree.insertTest(10);
        tempTree.insertTest(20);
        tempTree.insertTest(5);
        tempTree.insertTest(8);
        tempTree.insertTest(12);
        tempTree.insertTest(17);
        tempTree.insertTest(60);
        console.log(tempTree);
        tempTree.traverse();

        console.log("------- DELETE -------");

        let testCase = 9;
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
        }

        console.log(tempTree);
        console.log("        " + tempTree.root?.keys);

        let childrenKeys = "    - ";
        tempTree.root?.children.forEach((child: TreeNode) => (childrenKeys += child.keys + " - "));
        console.log(childrenKeys);

        let grandchildrenKeys = "- ";
        tempTree.root?.children.forEach((child: TreeNode) => {
            child.children.forEach((grandchild) => {
                grandchildrenKeys += grandchild.keys + " - ";
            });
        });
        console.log(grandchildrenKeys);

        // myTree.traverse();

        myTree = tempTree;
        setbTree(tempTree);
        console.log(myTree);
    };

    useEffect(() => {
        bTree.traverse();
        createTree();
        normalizeArray();
        drawLines();
    }, []);

    return (
        <Box className={classes.root}>
            <Control
                random={random}
                insert={insert}
                search={search}
                remove={remove}
                order={myTree.minChildren}
                changeOrder={changeOrder}
                reset={reset}
            />

            <Grid className={classes.container} container>
                <Node values={bbaum[0]} />
            </Grid>

            <Grid className={classes.container} container>
                <Node values={bbaum[1]} />
                <Node values={bbaum[2]} />
            </Grid>

            <Grid className={classes.outerContainer} container>
                <Grid className={classes.container} xs={6} container>
                    <Node values={bbaum[3]} />
                    <Node values={bbaum[4]} />
                    <Node values={bbaum[5]} />
                </Grid>

                <Grid className={classes.container} xs={6} container>
                    <Node values={bbaum[6]} />
                    <Node values={bbaum[7]} />
                    <Node values={bbaum[8]} />
                </Grid>
            </Grid>

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
