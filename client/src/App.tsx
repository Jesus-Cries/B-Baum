import { useState } from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

import ExampleComponent from "./components/ExampleComponent/ExampleComponent";
import Node from "./components/Node/Node";

interface Node {
    id: number;
    values: number[];
    parentId: number;
    childrenIds: number[];
}

const App: React.FC = () => {
    const [bbaum, setBbaum] = useState<Node[]>([
        {
            id: 1,
            values: [10],
            parentId: 0,
            childrenIds: [2, 3],
        },
        {
            id: 2,
            values: [3, 7],
            parentId: 1,
            childrenIds: [],
        },
        {
            id: 3,
            values: [13, 19],
            parentId: 1,
            childrenIds: [],
        },
    ]);

    return (
        <Box>
            <Grid container>
                <Node values={bbaum[0].values} />
            </Grid>

            <Grid container>
                <Node values={bbaum[1].values} />
                <Node values={bbaum[2].values} />
            </Grid>
        </Box>
    );
};

export default App;
