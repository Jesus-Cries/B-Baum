import { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import Node from "../../components/Node/Node";
import Control from "../../components/Control/Control";

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

    const [nodeSize, setNodeSize] = useState<number>(5);
    const [bbaum, setBbaum] = useState<string[][]>(new Array(tempBbaum.length).fill(new Array(1).fill(" ")));

    const normalizeArray = () => {
        for (let i = 0; i < tempBbaum.length; i++) {
            while (tempBbaum[i].length < nodeSize) {
                tempBbaum[i].push("‎‎‏‏‎ ‎");
            }
        }
        setBbaum(tempBbaum);
    };

    const drawLines = () => {
        const canvas: HTMLCanvasElement | null = document.getElementById("canvas") as HTMLCanvasElement;
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

    const upload = () => {
        console.log("Upload");
    };

    const random = () => {
        console.log("Random");
    };

    const insert = () => {
        console.log("Insert");
    };

    const search = () => {
        console.log("Search");
    };

    // Couldn't name this method "delete" as that name seems to be already used by React
    const remove = () => {
        console.log("Delete");
    };

    useEffect(() => {
        normalizeArray();
        drawLines();
    }, []);

    return (
        <Box className={classes.root}>
            <canvas id="canvas" className={classes.canvas} width={window.innerWidth} height={window.innerHeight}></canvas>

            <Control upload={upload} random={random} insert={insert} search={search} remove={remove} />

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
