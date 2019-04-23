import React, { Component } from 'react';

class CardBody extends React.Component {

  render() {
    return (
      <div className="card-body">
        <h2>{this.props.title}</h2>
        <h1>{this.props.time}</h1>
      </div>
    )
  }
}

class Card extends React.Component {
  render() {
    return (
      <article className="card">
        <CardBody title={this.props.value}/>
        <CardBody time ={this.props.stime}/>
      </article>
    )
  }
}

class CardContainer extends React.Component {

  render(){
    var info = this.props.info;
    var elements = [];
    for(var j=0 ; j < info.length ; j++){
          elements.push(<Card value={ info[j].name}
                              stime = {info[j].time}/>);
        }
        return (
            <div className = "card-container">
            {elements}
            </div>
        );
  }
}

export default CardContainer;
