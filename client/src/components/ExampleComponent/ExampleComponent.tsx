import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
    root: {
        margin: 20,
    },
});

interface Props {
    text?: string;
}

const ExampleComponent: React.FC<Props> = ({ text = "Click" }) => {
    const classes = useStyles();

    const log = () => {
        console.log("Hello World!");
    };

    return (
        <Button className={classes.root} variant="contained" onClick={log}>
            {text}
        </Button>
    );
};

export default ExampleComponent;
