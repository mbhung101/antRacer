import React, { Component } from 'react';
import { Button } from 'semantic-ui-react'
import { createApolloFetch } from 'apollo-fetch';
import AntRank from './antRank'



class Home extends Component {

  constructor(){
  super()
  this.state = {
    ants: [],
    ranker: 0,
    counter: 0
  }
  this.antList = this.antList.bind(this)
  this.antRank = this.antRank.bind(this)
  this.antRender = this.antRender.bind(this)
  this.fixer = this.fixer.bind(this)
  this.generateAntWinLikelihoodCalculator = this.generateAntWinLikelihoodCalculator.bind(this)
  this.ranker = this.ranker.bind(this)
  }

  componentWillMount(){
    this.antList()
  }

  antList () {
    // apollo request pulling data from the graphql server
    const uri = 'https://antserver-blocjgjbpw.now.sh/graphql';
    const query = `
      query{
        ants{
          name,
          length,
          color,
          weight
        }
      }
    `
    const apolloFetch = createApolloFetch({ uri });
    apolloFetch({query})
    .then(result => {
      this.setState({
        ants : result.data.ants
      })
    })
    .catch(error => {
      console.log("Error")
    });
  }

  antRender(ants){
    // renders ant cards with grabbed data
    for (var i in this.state.ants){
      this.state.ants[i].id = parseInt(i)
    }
    return ants.map((ant) =>
    <div style={{padding:20}}>
      <div className="ui card">
        <img src={require('../assets/antz.jpg')} className="ui image" />
        <div className="content">
          <div className="header">{ant.name}</div>
          <div className="description">
          <div align="left">
          Length: {ant.length} (mm) <br></br>
          Color: {ant.color.toLowerCase()} <br></br>
          Weight: {ant.weight} (mg)<br></br>
          </div>
          </div>
        </div>
        <div id={ant.id} className="extra content">
          Odds to Win: ???
        </div>
      </div>
    </div>
  )}

  antRank(){
    // when you press the ant rank button, this will run the provided function with the fixer function as the callback
    document.getElementById("rank").className = "ui loading button"
    for (var i in this.state.ants){
      document.getElementById(i).innerHTML = "Odds to Win: calculating.."
    }
    for(let i=0;i<this.state.ants.length;i++) {
      this.generateAntWinLikelihoodCalculator()(this.fixer)
    }
  }

  fixer = function (chance){
    // changes HTML elements to update calculated ranks
    document.getElementById(this.state.ranker).innerHTML = "Odds to Win: " + Math.round(chance*100) + "/1" //probabilites that didn't add up to 1 made me uncomfortbale so I changed it to betting odds (low number being higher chance of winning)
    document.getElementById("rank").className = "ui disabled button"
    document.getElementById("rank").innerHTML = "completed"
    // cant click on button again when you're done
    this.state.ranker ++
    this.ranker(this.state.ants)
  }


  ranker (arr){
    // lovely function that will give the ants a chance key and value, sort by chance and add html to the rank node
    this.state.counter ++
    if (this.state.counter === this.state.ants.length){
      for (var i in arr){
        var thenum = parseInt(document.getElementById(i).innerHTML.match(/\d+/))
        this.state.ants[i].chance = thenum
      }
      var sorted = this.state.ants.sort(function(b,a) {
          return parseFloat(a.chance) - parseFloat(b.chance);
      });
      var place = this.state.ants.length
    for (var i in sorted){
      var d1 = document.getElementById("ranks");
      d1.insertAdjacentHTML('afterend', '<div>' + place + " " + sorted[i].name + " " + sorted[i].chance + "/1" + '</div>');
      place --
    }
  }
  }

  generateAntWinLikelihoodCalculator() {
    var delay = 7000 + Math.random() * 7000;
    var likelihoodOfAntWinning = Math.random();
    return function (callback) {
    setTimeout(function() {
      callback(likelihoodOfAntWinning);
    }, delay);
    };
  }

  render() {
    return (
      <div style={{marginTop:"20px"}}>
        <img src={require('../assets/checker.jpeg')} style={{width:"100%",padding:20}} />
        <h1> Contestants </h1>
        <hr></hr> <br></br>
        <div className = "ui four cards">
          {this.antRender(this.state.ants)}
        </div>
        <br></br>
        <h1> Rankings </h1>
        <hr></hr> <br></br>
        <div id="ranks"></div>
        <AntRank antRank = {this.antRank} odds = {this.state.odds}/>
      </div>
    );
  }
}

export default Home;
