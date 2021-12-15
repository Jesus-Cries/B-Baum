import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Slider from "@material-ui/core/Slider";
import { useEffect, useState, useRef } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { ButtonGroup, Grid, Paper, TextField } from "@material-ui/core";
import { TreeNode } from "../Bbaum/TreeNode";

// @ts-ignore
const useStyles = makeStyles({
    root: {
        marginTop: 30,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 50,
        flexDirection: "column",
    },
    row: {
        display: "flex",
        //flexWrap: "wrap",
        justifyContent: "space-evenly",
        alignItems: "center",
        width: "90%",
        margin: 10,
    },
    button: {},
    slider: {
        width: "30%",
    },
    numberInput: {
        width: "4%",
        margin: 5,
    },
    limitUpper: {
        width: "6%",
        margin: 5,
    },
    limitLower: {
        width: "6%",
        margin: 5,
    },
});

interface Props {
    random: () => void;
    insert: (key: number) => void;
    search: (key: number) => void;
    remove: (key: number) => void;
    changeOrder: () => void;
    reset: () => void;
    order: number;
}

const Control: React.FC<Props> = ({
    random,
    insert,
    search,
    remove,
    order,
    changeOrder,
    reset,
}) => {
    const classes = useStyles();
    const [selectedFile, setSelectedFile] = useState();
    const inputFile = useRef<any>(null);
    const [amount, setAmount] = useState<String>();
    const [lowerLimit, setLowerLimit] = useState<number>();
    const [upperLimit, setUpperLimit] = useState<number>();
    const [insertionTempo, setInsertionTempo] = useState<number | number[]>();

    const changeHandler = (event: any) => {
        setSelectedFile(event.target.files[0]);
    };

    const parseCSV = (file: any) => {
        if (file) {
            let reader = new FileReader();
            reader.onload = function (e) {
                if (reader.result != null) {
                    let csvText: string | ArrayBuffer = reader.result;
                    if (typeof csvText === "string") {
                        let lines = csvText.split(/\r?\n/);
                        let i = 0;
                        if (typeof insertionTempo === "number") {
                            let interval = setInterval(function () {
                                switch (lines[i].split(",")[0]) {
                                    case "i":
                                        insert(parseInt(lines[i].split(",")[1]));
                                        break;
                                    case "d":
                                        remove(parseInt(lines[i].split(",")[1]));
                                        break;
                                    default:
                                        break;
                                }
                                i++;
                                if (i === lines.length) {
                                    clearInterval(interval);
                                }
                            }, insertionTempo);
                        }
                    }
                }
            };
            reader.readAsText(file);
        }
    };
    // Forwards click to input element
    const handleUpload = () => {
        inputFile.current.click();
    };

    const handleLowerLimit = (event: React.ChangeEvent<{ value: unknown }>) => {
        setLowerLimit(event.target.value as number);
    };
    const handleUpperLimit = (event: React.ChangeEvent<{ value: unknown }>) => {
        setUpperLimit(event.target.value as number);
    };

    const handleRandom = () => {
        if (upperLimit && lowerLimit) {
            if (lowerLimit <= upperLimit) {
                let endLoop = Math.floor(
                    Math.random() * (upperLimit - lowerLimit + 1) + lowerLimit
                );
                if (endLoop === 0) {
                    endLoop = 1;
                }
                console.log(endLoop);
                for (let i = 0; i < endLoop; i++) {
                    console.log("rte");
                    if (typeof insertionTempo === "number") {
                        setTimeout(function () {
                            insert(Math.floor(Math.random() * 100) + 1);
                            console.log("inserting");
                        }, insertionTempo);
                    }
                }
            } else {
                alert("False limits");
            }
        }
    };

    const handleTextChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setAmount(event.target.value as String);
    };

    const handleInsert = () => {
        if (amount) {
            let numbers = amount.split(",");
            numbers.forEach(function (item) {
                if (Number.isInteger(parseInt(item))) {
                    insert(parseInt(item));
                } else {
                    alert("error");
                }
            });
        }
    };

    const handleSearch = () => {
        if (amount) {
            let numbers = amount.split(",");
            numbers.forEach(function (item) {
                if (Number.isInteger(parseInt(item))) {
                    search(parseInt(item));
                } else {
                    alert("error");
                }
            });
        }
    };

    const handleRemove = () => {
        if (amount) {
            let numbers = amount.split(",");
            numbers.forEach(function (item) {
                if (Number.isInteger(parseInt(item))) {
                    remove(parseInt(item));
                } else {
                    alert("error");
                }
            });
        }
    };

    const handleReset = () => {
        reset();
    };

    //const handleTempo = (
    //    event: React.ChangeEvent<{ value: number | Array<number>; activeThumb: number }>
    //) => {
    //    setInsertionTempo(event.target.value as number);
    //};

    const testSpeed = (value: number) => {
        setInsertionTempo(value);
        return value.toString();
    };

    useEffect(() => {
        console.log(selectedFile);
        parseCSV(selectedFile);
        //changeTempo(insertionTempo);
    }, [selectedFile]);

    // @ts-ignore
    return (
        // TODO: Implement Paper for better visivility
        <Box className={classes.root}>
            <Paper className={classes.row}>
                <input
                    type="file"
                    id="file"
                    ref={inputFile}
                    style={{ display: "none" }}
                    onChange={changeHandler}
                />
                <Button className={classes.button} variant="contained" onClick={handleUpload}>
                    Upload
                </Button>
                <TextField
                    id="lowerLimit"
                    className={classes.limitUpper}
                    autoFocus
                    label="Lower Limit"
                    onChange={handleLowerLimit}
                    inputProps={{ maxLength: 75 }}
                />
                <TextField
                    id="upperLimit"
                    className={classes.limitLower}
                    autoFocus
                    label="Upper Limit"
                    onChange={handleUpperLimit}
                    inputProps={{ maxLength: 75 }}
                />
                <Button className={classes.button} variant="contained" onClick={handleRandom}>
                    Random
                </Button>

                <TextField
                    id="numberInput"
                    className={classes.numberInput}
                    autoFocus
                    label="Value"
                    onChange={handleTextChange}
                    inputProps={{ maxLength: 75 }}
                />
                <ButtonGroup>
                    <Button className={classes.button} variant="contained" onClick={handleInsert}>
                        Insert
                    </Button>
                    <Button className={classes.button} variant="contained" onClick={handleSearch}>
                        Search
                    </Button>
                    <Button className={classes.button} variant="contained" onClick={handleRemove}>
                        Delete
                    </Button>
                </ButtonGroup>
            </Paper>
            <Paper className={classes.row}>
                <Box component="div" sx={{ display: "inline" }}>
                    Current Order: {order}
                </Box>
                <TextField
                    id="upperLimit"
                    className={classes.limitLower}
                    autoFocus
                    label="Order"
                    //onChange={}
                    inputProps={{ maxLength: 75 }}
                />
                <Button className={classes.button} variant="contained" onClick={changeOrder}>
                    Change Order
                </Button>
                <Button className={classes.button} variant="contained" onClick={handleReset}>
                    Reset
                </Button>
                <Slider
                    className={classes.slider}
                    min={1000}
                    step={100}
                    max={5000}
                    //onChange={(_, newValue) => setInsertionTempo(newValue)}
                    //onChangeCommitted={(_, newValue) => setInsertionTempo(newValue)}
                    getAriaValueText={testSpeed}
                />
            </Paper>
        </Box>
    );
};

export default Control;
