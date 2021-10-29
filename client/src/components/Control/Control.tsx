import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    root: {
        marginTop: 20,
        display: "flex",
        justifyContent: "space-evenly",
    },
    button: {
        margin: 10,
        marginBottom: 0,
    },
});

interface Props {}

const Control: React.FC<Props> = () => {
    const classes = useStyles();

    return (
        <Box className={classes.root}>
            <Button className={classes.button} variant="contained">
                Einfügen
            </Button>
            <Button className={classes.button} variant="contained">
                Suchen
            </Button>
            <Button className={classes.button} variant="contained">
                Löschen
            </Button>
        </Box>
    );
};

export default Control;
