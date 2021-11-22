import { useState, useEffect, useRef, MutableRefObject } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import Node from "../../components/Node/Node";
import Control from "../../components/Control/Control";

import { Tree } from "./Tree";

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

    const search = () => {
        console.log(myTree);
        console.log("Search");
    };

    // Couldn't name this method "delete" as that name seems to be already used by React
    const remove = () => {
        console.log("Delete");
    };

    const createTree = () => {
        let tempTree: Tree = bTree;
        tempTree.insert(10);
        tempTree.insert(20);
        tempTree.insert(5);
        tempTree.insert(8);
        tempTree.insert(12);
        tempTree.insert(12);
        tempTree.insert(7);
        tempTree.insert(17);
        tempTree.insert(60);
        tempTree.traverse();

        console.log("------- DELETE -------");

        // Forces theft from right sibling
        tempTree.delete(8);
        tempTree.delete(12);
        tempTree.delete(7);

        // Forces theft from left sibling
        // tempTree.delete(12);
        // tempTree.delete(12);
        // tempTree.delete(17);
        // tempTree.delete(60);

        console.log(tempTree);
        console.log(tempTree.root?.keys);
        console.log(tempTree.root?.children[0].keys);
        console.log(tempTree.root?.children[1].keys);
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
            <canvas
                id="canvas"
                className={classes.canvas}
                width={window.innerWidth}
                height={window.innerHeight}
            />

            <Control random={random} insert={insert} search={search} remove={remove} />

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