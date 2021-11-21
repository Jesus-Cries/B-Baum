import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Slider from "@material-ui/core/Slider";
import { useEffect, useState, useRef } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { ButtonGroup, TextField } from "@material-ui/core";

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
    numberInput: {
        width: "4%",
    },
    limitUpper: {
        width: "5%",
    },
    limitLower: {
        width: "5%",
    },
});

interface Props {
    random: () => void;
    insert: (key: number) => void;
    search: () => void;
    remove: () => void;
}

const Control: React.FC<Props> = ({ random, insert, search, remove }) => {
    const classes = useStyles();
    const [selectedFile, setSelectedFile] = useState();
    const inputFile = useRef<any>(null);
    const [amount, setAmount] = useState<String>();
    const [lowerLimit, setLowerLimit] = useState<number>();
    const [upperLimit, setUpperLimit] = useState<number>();

    const changeHandler = (event: any) => {
        setSelectedFile(event.target.files[0]);
    };

    const parseCSV = (file: any) => {
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                if (reader.result != null) {
                    let csvText: string | ArrayBuffer = reader.result;
                    if (typeof csvText === "string") {
                        let lines = csvText.split(/\r?\n/);
                        lines.forEach(function (item, index) {
                            switch (item.split(",")[0]) {
                                case "i":
                                    //console.log(parseInt(item.split(",")[1]));
                                    insert(parseInt(item.split(",")[1]));
                                    break;
                                case "d":
                                    break;
                                default:
                                    break;
                            }
                        });
                        console.log(lines);
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

    const handleRandom = () => {
        if (upperLimit && lowerLimit) {
            if (lowerLimit < upperLimit) {
                let endLoop = Math.floor(
                    Math.random() * (upperLimit - lowerLimit + 1) + lowerLimit
                );
                for (let i = 0; i < endLoop; i++) {
                    insert(Math.floor(Math.random() * 100) + 1);
                }
            } else {
                alert("False limits");
            }
        }
    };

    const handleLowerLimit = (event: React.ChangeEvent<{ value: unknown }>) => {
        setLowerLimit(event.target.value as number);
    };
    const handleUpperLimit = (event: React.ChangeEvent<{ value: unknown }>) => {
        setUpperLimit(event.target.value as number);
    };

    useEffect(() => {
        console.log(selectedFile);
        parseCSV(selectedFile);
    }, [selectedFile]);

    return (
        <Box className={classes.root}>
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
                <Button className={classes.button} variant="contained" onClick={search}>
                    Search
                </Button>
                <Button className={classes.button} variant="contained" onClick={remove}>
                    Delete
                </Button>
            </ButtonGroup>
            <Slider className={classes.slider}></Slider>
        </Box>
    );
};

export default Control;
