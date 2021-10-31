import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Slider from "@material-ui/core/Slider";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    root: {
        marginTop: 30,
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        zIndex: 50,
    },
    button: {},
    slider: {
        width: "30%",
    },
});

interface Props {
    upload: () => void;
    random: () => void;
    insert: () => void;
    search: () => void;
    remove: () => void;
}

const Control: React.FC<Props> = ({ upload, random, insert, search, remove }) => {
    const classes = useStyles();

    return (
        <Box className={classes.root}>
            <Button className={classes.button} variant="contained" onClick={upload}>
                Upload
            </Button>
            <Button className={classes.button} variant="contained" onClick={upload}>
                Random
            </Button>
            <Button className={classes.button} variant="contained" onClick={insert}>
                Insert
            </Button>
            <Button className={classes.button} variant="contained" onClick={search}>
                Search
            </Button>
            <Button className={classes.button} variant="contained" onClick={remove}>
                Delete
            </Button>
            <Slider className={classes.slider}></Slider>
        </Box>
    );
};

export default Control;
