import React from 'react';
import TextField from '@material-ui/core/TextField';


class NumberRangeNotEmptyTextField extends React.Component {
    state = {
        errorText: '',
    };

    onChange = event => {
        const {minNumber, maxNumber} = this.props;
        if (event.target.value === '') {
            this.setState({errorText: 'Must not be empty'})
        }
        else if (!(minNumber > Number(event.target.value)) && !(maxNumber < Number(event.target.value))) {
            this.setState({errorText: ''})
        }
        else {
            this.setState({errorText: `Must be between ${minNumber} and ${maxNumber} inclusive`})
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

export default NumberRangeNotEmptyTextField;