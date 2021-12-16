import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Slider from "@material-ui/core/Slider";
import { useEffect, useState, useRef } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { ButtonGroup, Paper, TextField } from "@material-ui/core";

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
    changeOrder: (order: number) => void;
    reset: () => void;
    order: number;
}

const Control: React.FC<Props> = ({
    random,
    insert,
    search,
    remove,
    //order,
    changeOrder,
    reset,
}) => {
    const classes = useStyles();
    const [selectedFile, setSelectedFile] = useState();
    const inputFile = useRef<any>(null);
    const [amount, setAmount] = useState<String>("");
    const [lowerLimit, setLowerLimit] = useState<number>();
    const [upperLimit, setUpperLimit] = useState<number>();
    const [insertionTempo, setInsertionTempo] = useState<number | number[]>(0);
    const [order, setOrder] = useState<number>(4);

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
                        treatNextLine(lines);
                    }
                }
            };
            reader.readAsText(file);
        }
    };

    const treatNextLine = (arr: string[]) => {
        let stop: boolean = false;

        if (typeof insertionTempo === "number") {
            let currentLine: string = arr.splice(0, 1)[0];
            console.log("CurrentLine: " + currentLine);
            switch (currentLine.split(",")[0]) {
                case "i":
                    insert(parseInt(currentLine.split(",")[1]));
                    break;
                case "d":
                    remove(parseInt(currentLine.split(",")[1]));
                    break;
                default:
                    console.log("Unknown command");
                    stop = true;
                    break;
            }

            if (!stop) {
                setTimeout(() => {
                    treatNextLine(arr);
                }, insertionTempo);
            }
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

    const handleOrderChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        let newOrder = Math.ceil((event.target.value as number) / 2) * 2;
        setOrder(newOrder);
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

    const handleChangeOrder = () => {
        changeOrder(order);
    };

    const handleReset = () => {
        reset();
    };

    //const handleTempo = (
    //    event: React.ChangeEvent<{ value: number | Array<number>; activeThumb: number }>
    //) => {
    //    setInsertionTempo(event.target.value as number);
    //};

    const handleSliderChange = (event: React.ChangeEvent<{}>, newValue: number | number[]) => {
        setInsertionTempo(newValue as number);
    };

    useEffect(() => {
        console.log(selectedFile);
        parseCSV(selectedFile);
        //changeTempo(insertionTempo);
    }, [selectedFile]);

    return (
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
                    value={amount}
                    onChange={handleTextChange}
                    inputProps={{ maxLength: 75 }}
                />
                <ButtonGroup>
                    <Button
                        className={classes.button}
                        variant="contained"
                        onClick={() => {
                            handleInsert();
                            setAmount("");
                        }}
                    >
                        Insert
                    </Button>
                    <Button
                        className={classes.button}
                        variant="contained"
                        onClick={() => {
                            handleSearch();
                            setAmount("");
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        className={classes.button}
                        variant="contained"
                        onClick={() => {
                            handleRemove();
                            setAmount("");
                        }}
                    >
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
                    onChange={handleOrderChange}
                    inputProps={{ maxLength: 75 }}
                />
                <Button className={classes.button} variant="contained" onClick={handleChangeOrder}>
                    Change Order
                </Button>
                <Button className={classes.button} variant="contained" onClick={handleReset}>
                    Reset {insertionTempo}
                </Button>
                <Slider
                    className={classes.slider}
                    min={0}
                    step={100}
                    max={5000}
                    defaultValue={0}
                    onChange={(first, second) => {
                        handleSliderChange(first, second);
                    }}
                />
            </Paper>
        </Box>
    );
};

export default Control;
