import { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

import Node from "../../components/Node/Node";

const useStyles = makeStyles({
    root: {},
    container: {
        justifyContent: "space-evenly",
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
                tempBbaum[i].push("‎‎ ‎");
            }
        }
        setBbaum(tempBbaum);
    };

    useEffect(() => {
        normalizeArray();
    });

    return (
        <Box>
            <Grid className={classes.container} container>
                <Node values={bbaum[0]} />
            </Grid>

            <Grid className={classes.container} container>
                <Node values={bbaum[1]} />
                <Node values={bbaum[2]} />
            </Grid>

            <Grid className={classes.container} container>
                <Node values={bbaum[3]} />
                <Node values={bbaum[4]} />
                <Node values={bbaum[5]} />
                <Node values={bbaum[6]} />
                <Node values={bbaum[7]} />
                <Node values={bbaum[8]} />
            </Grid>
        </Box>
    );
};

export default Bbaum;
