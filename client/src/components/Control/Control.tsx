import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Slider from "@material-ui/core/Slider";
import { useEffect, useState, useRef } from "react";

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
    random: () => void;
    insert: (key: number) => void;
    search: () => void;
    remove: () => void;
}

const Control: React.FC<Props> = ({ random, insert, search, remove }) => {
    const classes = useStyles();
    const [selectedFile, setSelectedFile] = useState();
    const inputFile = useRef<any>(null);
    //const [isFilePicked, setIsFilePicked] = useState(false);

    //inputFile.current.click();
    const changeHandler = (event: any) => {
        setSelectedFile(event.target.files[0]);
        //setIsFilePicked(true);
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
                                    console.log(parseInt(item.split(",")[1]));
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
            <Button className={classes.button} variant="contained" onClick={random}>
                Random
            </Button>
            <Button className={classes.button} variant="contained">
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
