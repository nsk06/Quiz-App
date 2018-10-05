import React, { Component } from 'react';
import './Users.css';

class Questions extends Component {
	constructor() {
    super();
    this.state = {
      data: [],
      completed: false,
      cd : 0,
      tot:0,
      score:0,
      life: true,
    }
    this.answer = this.answer.bind(this);
    this.help = this.help.bind(this);
    
  }
componentDidMount() {
    var url = 'http://127.0.0.1:8080/question/' + this.props.id
    //   alert(url)
    const request = new Request(url);
    fetch(request)
      .then(response => response.json())
        .then(data => {this.setState({data: data});this.setState({tot:this.state.data.length})});
  }
 answer (event) {
     event.preventDefault();
     var my_id = ""
     var i;
       var my = document.querySelectorAll('input[name="selectbutton"]:checked');
       for(i =0;i<my.length;++i)
       {
        my_id += my[i].value;
        my[i].checked = false
       }
       this.setState({cd:this.state.cd+1})
      
       if(my_id === this.state.data[this.state.cd].answer)
       {
       var url = 'http://127.0.0.1:8080/scores/' + this.state.data[this.state.cd].Quizid;
       this.state.score +=10
    // var mine = localStorage.getItem("email") + this.state.data[this.state.cd].Quizid.toString()
        // var x = localStorage.getItem("email")
        // var d = {}
        // d[`${localStorage.getItem("email")}`] = this.state.score
        // //alert(`${localStorage.getItem("email")}`)
        // localStorage.setItem("user_score",JSON.stringify(d))
        if(this.state.score/10 == this.state.tot)
        {
            alert("Congrats All Correct We are doubling your score...")
            this.state.score = this.state.score*2
        }
       var myarr = [this.state.data[this.state.cd].Quizid.toString(),localStorage.getItem("email")]
    // alert(myarr)
       fetch(url, {
        method: 'POST',
        body: JSON.stringify(myarr),
      })
         .then(response => {
                
           if(response.status >= 200 && response.status < 300)
            this.setState({submitted: true});
         });
        }
        if(this.state.cd == this.state.tot -1)
        {
         //    alert("hi")
            this.setState({completed:true})
            var x = {}
         //    alert(`${localStorage.getItem("email")}`+this.state.data[0].Quizid)
            x[`${localStorage.getItem("email")}`+this.state.data[0].Quizid] = [true,this.state.score]
            localStorage.setItem("status",JSON.stringify(x));
         //    alert(JSON.parse(localStorage.getItem("status"))[`${localStorage.getItem("email")}`+this.state.data[0].Quizid])
        }
    //    window.location.reload(); 
   }

   help(event)
   {
    event.preventDefault()
       var count = 0
       var i
       var ans = this.state.data[this.state.cd].answer
       var my = document.querySelectorAll('input[name="selectbutton"]');
    //    alert(my.length)
       for(i =0;i<my.length;++i)
       {
        //    alert("yo");
         if(!ans.include(my[i].value))
         {
            //  alert(my[i])
            my[i].style.display = "none"
            count ++;
         }
         if(count >= 2)
         {
             break;
         }
       }
       this.state.life = false
   }
  render() {
    if (JSON.parse(localStorage.getItem("authentication")) === true)
    {
        
      if(this.state.data.length > 0 && this.state.cd < this.state.tot)
      {
        try
        {
          if(JSON.parse(localStorage.getItem("status"))[`${localStorage.getItem("email")}`+this.state.data[0].Quizid] != null)
          {
        if(JSON.parse(localStorage.getItem("status"))[`${localStorage.getItem("email")}`+this.state.data[0].Quizid][0] === true )
        {
            alert("Already done!")
            return(
                <div>
                   <p> Your score is {JSON.parse(localStorage.getItem("status"))[`${localStorage.getItem("email")}`+this.state.data[0].Quizid][1]}</p>
                </div>
            )
        }
        }
        }
        catch(err)
        {

        }
       var  vals = this.state.data[this.state.cd]
    console.log(vals);
    if(vals.qtype === "text")
    {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Questions</h1>
        </header>
        <form onSubmit={this.answer}>
        <table className="table-hover table-borderless">
          <thead>
          <tr>
          	  <th>Questions</th>
           </tr>
           </thead>
           <tbody> 
                  <tr>
                   	<tr>
                       <td><h3>{vals.question}</h3></td>
			        </tr>
                    <tr>
                    <td><input type="checkbox" name = "selectbutton" value="A" /></td> 
                    <td>{vals.first}</td> 
                    </tr>
                    <tr>
                    <td><input type="checkbox" name = "selectbutton" value="B" /></td>  
                    <td>{vals.second}</td> 
                    </tr>
                    <tr>
                    <td><input type="checkbox" name = "selectbutton" value="C" /></td>  
                    <td>{vals.third}</td> 
                    </tr>
                    <tr>
                    <td><input type="checkbox" name = "selectbutton" value="D" /></td>  
                    <td>{vals.fourth}</td> 
                    </tr>
                   </tr>
                </tbody>
          </table>
             <button type="submit" className="btn btn-default">Submit Answer</button>
             </form>
             
             {
                 this.state.life === true &&
                    <button type="submit" className="btn btn-default" onClick = {this.help}>50-50</button>
            } 
      </div>
      
    );
    }
    else if(vals.qtype === "img")
    {
        return (
        <div className="App">
        <header className="App-header">
          <h1 className="App-title">Questions</h1>
        </header>
        <form onSubmit={this.answer}>
        <table className="table-hover table-borderless">
          <thead>
          <tr>
          	  <th>Questions</th>
           </tr>
           </thead>
           <tbody> 
                  <tr>
                   	<tr>
                       <td><h3>{vals.question}</h3></td>
			        </tr>
                    <tr>
                    <td><input type="checkbox" name = "selectbutton" value="A" /></td> 
                    <td><img src={require(`./question/${vals.first}.png`)} alt={vals.first}/></td> 
                    </tr>
                    <tr>
                    <td><input type="checkbox" name = "selectbutton" value="B" /></td>  
                    <td><img src={require(`./question/${vals.second}.png`)} alt={vals.second}/></td> 
                    </tr>
                    <tr>
                    <td><input type="checkbox" name = "selectbutton" value="C" /></td>  
                    <td><img src={require(`./question/${vals.third}.png`)} alt={vals.third}/></td> 
                    </tr>
                    <tr>
                    <td><input type="checkbox" name = "selectbutton" value="D" /></td>  
                    <td><img src={require(`./question/${vals.fourth}.png`)} alt={vals.fourth}/></td> 
                    </tr>
                   </tr>
                </tbody>
          </table>
             <button type="submit" className="btn btn-default">Submit Answer</button>
             </form>

             {/* {this.state.submitted &&
          <div>
            <h2>
               person successfully deleted.
            </h2>
          </div>
        } */}
      </div>
      
    );
    }
    else if(vals.qtype === "audio")
    {
        return (
        <div className="App">
        <header className="App-header">
          <h1 className="App-title">Questions</h1>
        </header>
        <form onSubmit={this.answer}>
        <table className="table-hover table-borderless">
          <thead>
          <tr>
          	  <th>Questions</th>
           </tr>
           </thead>
           <tbody> 
                  <tr>
                   	<tr>
                       <td>
                           <h3>
                           {vals.question}
                           </h3>
                           <audio controls>
                           <source src = {require("./Sounds/kb.ogg")} type="audio/ogg"/>
                           Your browser dont support the audio
                           </audio>
                           </td>
			        </tr>
                    <tr>
                    <td><input type="checkbox" name = "selectbutton" value="A" /></td> 
                    <td>{vals.first}</td> 
                    </tr>
                    <tr>
                    <td><input type="checkbox" name = "selectbutton" value="B" /></td>  
                    <td>{vals.second}</td> 
                    </tr>
                    <tr>
                    <td><input type="checkbox" name = "selectbutton" value="C" /></td>  
                    <td>{vals.third}</td> 
                    </tr>
                    <tr>
                    <td><input type="checkbox" name = "selectbutton" value="D" /></td>  
                    <td>{vals.fourth}</td> 
                    </tr>
                   </tr>
                </tbody>
          </table>
             <button type="submit" className="btn btn-default">Submit Answer</button>
             </form>

      </div>
      
    );
    }
    else if(vals.qtype === "reco")
    {
        return (
        <div className="App">
        <header className="App-header">
          <h1 className="App-title">Questions</h1>
        </header>
        <form onSubmit={this.answer}>
        <table className="table-hover table-borderless">
          <thead>
          <tr>
          	  <th>Questions</th>
           </tr>
           </thead>
           <tbody> 
                  <tr>
                   	<tr>
                       <td>
                           <h3>
                           {vals.question}
                           </h3>
                           <img src={require("./question/srk.png")} alt="srk"/>
                           </td>
			        </tr>
                    <tr>
                    <td><input type="checkbox" name = "selectbutton" value="A" /></td> 
                    <td>{vals.first}</td> 
                    </tr>
                    <tr>
                    <td><input type="checkbox" name = "selectbutton" value="B" /></td>  
                    <td>{vals.second}</td> 
                    </tr>
                    <tr>
                    <td><input type="checkbox" name = "selectbutton" value="C" /></td>  
                    <td>{vals.third}</td> 
                    </tr>
                    <tr>
                    <td><input type="checkbox" name = "selectbutton" value="D" /></td>  
                    <td>{vals.fourth}</td> 
                    </tr>
                   </tr>
                </tbody>
          </table>
             <button type="submit" className="btn btn-default">Submit Answer</button>
             </form>

      </div>
      
    );
    }
    }
    else{
        return(
            <div>
            <h3>Completed Quiz</h3>
            <p>Your Score{this.state.score}</p>
            </div>
        )
    }
  }
  else
  {
      <h3>Please login to view</h3>
  }
}
}

export default Questions;
