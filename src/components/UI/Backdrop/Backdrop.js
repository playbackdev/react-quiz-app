import React, {Component} from "react";
import classes from './Backdrop.module.css'

class Backdrop extends Component {

    state = {
        cls: [classes.Backdrop]
    };

    componentDidMount() {
        setTimeout(() => {
            this.setState({cls: [...this.state.cls, classes.show]});
        }, 0);
    }

    render() {
        return (
            <div
                className={this.state.cls.join(' ')}
                onClick={this.props.onClick}
            >
            </div>

        )
    }
}

export default Backdrop;