import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles({
    root: {
        color: "#fff",
    },
    item: {
        marginTop: 20,
        padding: 10,
        border: "1px solid white",
    },
});

interface Props {
    values: number[];
}

const Node: React.FC<Props> = ({ values }) => {
    const classes = useStyles();

    return (
        <Grid justifyContent="center" className={classes.root} container>
            {values.map((value) => (
                <Grid className={classes.item} item>
                    {value}
                </Grid>
            ))}
        </Grid>
    );
};

export default Node;
