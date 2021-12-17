import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Slider from "@material-ui/core/Slider";
import { useEffect, useState, useRef } from "react";
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";
import { ButtonGroup, Paper, TextField } from "@material-ui/core";

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
        justifyContent: "space-around",
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
    cost: number;
    searchedFor: string;
}

const Control: React.FC<Props> = ({
    random,
    insert,
    search,
    remove,
    //order,
    changeOrder,
    reset,
    cost,
    searchedFor,
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
                let endLoop: number =
                    Math.floor(Math.random() * (upperLimit - lowerLimit)) +
                    Math.floor(Math.random() * 2) +
                    parseInt(String(lowerLimit));
                parseInt(String(lowerLimit));
                //parseInt(Math.floor(Math.random() * (upperLimit - lowerLimit))) + lowerLimit;
                console.log("Endloop: " + endLoop);
                if (endLoop === 0) {
                    endLoop = 1;
                }
                insertRandom(endLoop);
            } else {
                console.log("False limits");
            }
        }
    };

    const insertRandom = (counter: number) => {
        insert(Math.floor(Math.random() * 100) + 1);
        counter--;
        if (typeof insertionTempo === "number" && counter > 0) {
            if (insertionTempo === 0) {
                insertRandom(counter);
            } else {
                setTimeout(() => {
                    insertRandom(counter);
                }, insertionTempo);
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
                    console.log("Wrong input passed");
                }
            });
        }
    };

    const handleSearch = () => {
        if (amount) {
            let numbers = amount.split(",");
            let i = 0;
            numbers.forEach(function (item) {
                if (Number.isInteger(parseInt(item))) {
                    setTimeout(() => {
                        search(parseInt(item));
                    }, i * 750 * 10);
                    i++;
                } else {
                    console.log("error");
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
                    console.log("error");
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
                    inputProps={{ type: "number", pattern: "[0-9]*", maxLength: 75 }}
                    className={classes.limitUpper}
                    label="Lower Limit"
                    onChange={handleLowerLimit}
                />
                <TextField
                    id="upperLimit"
                    inputProps={{ type: "number", pattern: "[0-9]*", maxLength: 75 }}
                    className={classes.limitLower}
                    label="Upper Limit"
                    onChange={handleUpperLimit}
                />
                <Button className={classes.button} variant="contained" onClick={handleRandom}>
                    Random
                </Button>

                <TextField
                    id="numberInput"
                    inputProps={{ maxLength: 75 }}
                    className={classes.numberInput}
                    autoFocus
                    label="Value"
                    value={amount}
                    onChange={handleTextChange}
                />
                {cost === -3 ? (
                    <Typography>Tree is empty</Typography>
                ) : cost === -2 ? (
                    <Typography>Value not found</Typography>
                ) : (
                    cost !== -1 && (
                        <Typography
                            style={{
                                backgroundColor: searchedFor !== "" ? "#ffc400" : "#ffffff",
                            }}
                        >
                            Cost: {cost}
                        </Typography>
                    )
                )}

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
                <Box component="div" sx={{ display: "inline" }}>
                    Current Order: {order}
                </Box>
                <TextField
                    id="upperLimit"
                    inputProps={{ type: "number", pattern: "[0-9]*", maxLength: 75 }}
                    className={classes.limitLower}
                    label="Order"
                    onChange={handleOrderChange}
                />
                <Button className={classes.button} variant="contained" onClick={handleChangeOrder}>
                    Change Order
                </Button>
                <Button className={classes.button} variant="contained" onClick={handleReset}>
                    Reset
                </Button>
            </Paper>
        </Box>
    );
};

export default Control;
