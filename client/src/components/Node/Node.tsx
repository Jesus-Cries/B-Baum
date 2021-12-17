// Imports
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

// CSS
const useStyles = makeStyles({
    root: {
        minWidth: 250,
        maxWidth: 600,
        // width: 250,
        marginTop: 20,
        marginBottom: 20,
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
        border: "1px solid black",
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
    searchedFor: string;
}

const Node: React.FC<Props> = ({ values, searchedFor }) => {
    const classes = useStyles();

    return (
        <Grid className={classes.root} container>
            {values.map((value) => {
                let valueAsInt: number = parseInt(value);
                let valueAsNaN: boolean = isNaN(valueAsInt);
                return (
                    <>
                        <Grid className={classes.gap} item>
                            &nbsp;
                        </Grid>
                        <Grid
                            className={classes.item}
                            style={{
                                backgroundColor:
                                    searchedFor == value
                                        ? "#ffc400"
                                        : valueAsNaN
                                        ? "#ccc"
                                        : "#fafafa",
                            }}
                            item
                        >
                            {value}
                        </Grid>
                    </>
                );
            })}
            <Grid className={classes.gap} item>
                &nbsp;
            </Grid>
        </Grid>
    );
};

export default Node;
