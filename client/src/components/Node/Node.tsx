import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles({
    root: {
        width: 250,
        marginTop: 35,
        marginBottom: 35,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
    },
    item: {
        // fontSize: 12,
        display: "flex",
        justifyContent: "center",
        width: 30,
        padding: 10,
        borderTop: "1px solid black",
        borderBottom: "1px solid black",
    },
    gap: {
        paddingTop: 10,
        paddingBottom: 10,
        width: 7,
        border: "1px solid black",
        backgroundColor: "#ddd",
    },
});

interface Props {
    values: string[];
}

const Node: React.FC<Props> = ({ values }) => {
    const classes = useStyles();
    let emptyChar: string = " ‎";

    return (
        <Grid className={classes.root} container>
            {values.map((value) => {
                let valueAsInt: number = parseInt(value);
                let valueAsNaN: boolean = isNaN(valueAsInt);

                return (
                    <>
                        <Grid className={classes.gap} item>
                            {emptyChar}
                        </Grid>
                        <Grid
                            className={classes.item}
                            style={{ backgroundColor: valueAsNaN ? "#ccc" : "#fafafa" }}
                            item
                        >
                            {value}
                        </Grid>
                    </>
                );
            })}
            <Grid className={classes.gap} item>
                {emptyChar}
            </Grid>
        </Grid>
    );
};

export default Node;
