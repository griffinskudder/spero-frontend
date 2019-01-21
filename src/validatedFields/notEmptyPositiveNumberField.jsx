import React from 'react';
import TextField from '@material-ui/core/TextField';


class PositiveNumberNotEmptyField extends React.Component {
    state = {
        errorText: '',
    };

    onChange = event => {
        if (event.target.value === '') {
            this.setState({errorText: 'Must not be empty'})
        }
        else if (!(0 > Number(event.target.value))) {
            this.setState({errorText: ''})
        }
        else {
            this.setState({errorText: `Must be a positive number.`})
        }
    };

    render() {
        return (
            <TextField
                error={Boolean(this.state.errorText)}
                helperText={this.state.errorText}
                onBlur={this.onChange}
                {...this.props}
            />
        );
    }
}

export default PositiveNumberNotEmptyField;