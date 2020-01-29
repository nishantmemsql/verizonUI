import React from 'react';

class EditableCell extends React.Component {

    state = {
        value:this.props.value,
        column:this.props.value,
        id:this.props,
        editing: false
    };

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
      this.setState({ value: nextProps.value,
                            id: nextProps.id,
                            column:nextProps.column
                        });
    }

  onFocus() {
        this.setState({ editing: true }, () => {
            this.refs.input.focus();
        });
    }

    onBlur() {
        this.setState({ editing: false });
    }

    onChangeValue(value){
        this.setState({value:value})
    }

    onKeyPress(event){
      if (event.key==='Enter'){
        this.setState({editing: false});
        this.props.onChange(event,this.props.id,this.props.column,this.state.value)
      }
    }

    render() {
        return this.state.editing ?
            <input ref='input' value={this.state.value} onChange={e=>this.onChangeValue(e.target.value,this.props.id)} onKeyPress={(e)=>this.onKeyPress(e)} onBlur={()=>this.onBlur()} /> :
            <div style={{minHeight:'30px'}} onClick={() => this.onFocus()}>{this.state.value}</div>
    }
}

export default EditableCell;



