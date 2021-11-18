import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Slider from "@material-ui/core/Slider";
import {useEffect, useState, useRef} from "react";

import { makeStyles } from "@material-ui/core/styles";

import $ from 'jquery';

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
    inputFile: any;
}

const Control: React.FC<Props> = ({ upload, random, insert, search, remove, inputFile }) => {
    const classes = useStyles();
    const [selectedFile, setSelectedFile] = useState();
    //const [isFilePicked, setIsFilePicked] = useState(false);


    //inputFile.current.click();
    const changeHandler = (event:any) => {
        setSelectedFile(event.target.files[0]);
        //setIsFilePicked(true);
    };

    const parseCSV = (file: any) => {
        console.log(file.text())
    }

    useEffect(() => {
        console.log(selectedFile);
        //parseCSV(selectedFile);
    }, [selectedFile]);

    return (
        <Box className={classes.root}>
            <input type='file' id='file' ref={inputFile} style={{display: 'none'}} onChange={changeHandler}/>
            <Button className={classes.button} variant="contained" onClick={upload}>
                Upload
            </Button>
            <Button className={classes.button} variant="contained" onClick={random}>
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
