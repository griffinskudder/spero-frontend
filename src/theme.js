import {createMuiTheme} from '@material-ui/core/styles';

// https://material.io/tools/color/#!/?view.left=0&view.right=1&primary.color=00b4ec&secondary.color=ec4b00&primary.text.color=000000&secondary.text.color=000000

export default createMuiTheme({
    palette: {
        primary: {
            light: '#ffb2dd',
            main: '#ff80ab',
            dark: '#c94f7c',
            contrastText: '#000',
        },
        secondary: {
            light: '#4c8c4a',
            main: '#1b5e20',
            dark: '#003300',
            contrastText: '#fff',
        }
    },
    typography: {
        useNextVariants: true,
    }
})