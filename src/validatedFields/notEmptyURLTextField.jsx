import React from 'react';
import TextField from '@material-ui/core/TextField';

const URL_REGEX = "(https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|www\\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9]\\.[^\\s]{2,}|www\\.[a-zA-Z0-9]\\.[^\\s]{2,})";

class NotEmptyURLTextField extends React.Component {
    state = {
        errorText: '',
    };

    onChange = event => {
        if (event.target.value === '') {
            this.setState({errorText: 'Must not be empty'})
        }
        else if (event.target.value.match(URL_REGEX)) {
            this.setState({errorText: ''})
        }
        else {
            this.setState({errorText: `Must be a valid URL`})
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

export default NotEmptyURLTextField;