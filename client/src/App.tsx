import Box from "@material-ui/core/Box";

import ExampleComponent from "./components/ExampleComponent/ExampleComponent";

const App: React.FC = () => {
    return (
        <Box>
            <ExampleComponent />
            <ExampleComponent text="Hello" />
            <ExampleComponent text="Beep" />
        </Box>
    );
};

export default App;
