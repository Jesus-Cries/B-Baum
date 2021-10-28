import { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles({
    root: {
        width: 250,
        marginTop: 30,
        marginBottom: 120,
        justifyContent: "center",
        alignItems: "center",
    },
    item: {
        display: "flex",
        justifyContent: "center",
        width: 40,
        marginLeft: 2,
        marginRight: 2,
        padding: 10,
        border: "1px solid black",
    },
});

interface Props {
    values: string[];
}

const Node: React.FC<Props> = ({ values }) => {
    const classes = useStyles();

    return (
        <Grid className={classes.root} container>
            {values.map((value) => (
                <Grid className={classes.item} item>
                    {value}
                </Grid>
            ))}
        </Grid>
    );
};

export default Node;
