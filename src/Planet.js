import React,{Component} from 'react';
import axios from 'axios';
import'./Planet.css';
import api from './services/service';

class Planet extends Component{  
    constructor(props){
        super(props)
      
        this.state = {
            planets: [],
            filmsDoPlaneta: [],
            currentPage: 1,
            planetCount: 0,
            planetIndex: 0,
        }
      }
    
    componentDidMount(){
        this.resgatePlaneta()
    }
    
    async resgatePlaneta(page: number, planetCountLastPage: number, lastPage: number){      
        let response
        
        if(page)
            response = await api.get(`/planets/?page=${page}`)
        else
            response = await api.get(`/planets/?page=${this.state.currentPage}`)
        
        const filmesDoPlaneta = []
        let planetIndex = Math.floor(Math.random() * 9) + 1;
    
        if(page === lastPage) {
            if(planetCountLastPage > 2)
                planetIndex = Math.floor(Math.random() * planetCountLastPage - 1) + 1;
            else
                planetIndex = 0
        }
                
        response.data.results[planetIndex] && response.data.results[planetIndex].films && response.data.results[planetIndex].films.length > 0 ?
            response.data.results[planetIndex].films.map(async film => {
                let result = await axios.get(film)
                filmesDoPlaneta.push(result.data.title)
                this.setState({planets: response.data.results, planetCount: response.data.count, filmsDoPlaneta: filmesDoPlaneta, currentPage: page ? page : 1, planetIndex: planetIndex})
            })
        : this.setState({planets: response.data.results, planetCount: response.data.count, filmsDoPlaneta: [], currentPage: page ? page : 1, planetIndex: planetIndex})
    }

    renderNavigationButtons() {
        let showPreviousBtn = false
        let showNextBtn = false
        let habilitarBotao = true
        let pages = this.getPages()
        let totalPageNumber = pages.length
        let planetCountLastPage = pages[pages.length - 1].length

        if(this.state.currentPage === 1)
            showNextBtn = habilitarBotao
        else if(this.state.currentPage === totalPageNumber)
            showPreviousBtn = habilitarBotao
        else if(this.state.planetCount !== 0) {
            showPreviousBtn = habilitarBotao
            showNextBtn = habilitarBotao
        }
            
        return(
            <div className="botoes">
                <button className={showPreviousBtn ? 'exibe-botao' : 'oculta-botao'} onClick={()=> this.resgatePlaneta(this.state.currentPage - 1, planetCountLastPage, totalPageNumber)} >Previous</button>
                <button className={showNextBtn ? 'exibe-botao' : 'oculta-botao'} onClick={()=> this.resgatePlaneta(this.state.currentPage + 1, planetCountLastPage, totalPageNumber)} >Next</button>
            </div>
        )
    }

    getPages() {
        let arrayCount = new Array(this.state.planetCount)

        var pages = this.getTotalPagesArray(arrayCount, 10)
        return pages
    }

    getTotalPagesArray(arrayCount, arraySize) {
        let index = 0
        let tempArray = []
        for (index = 0; index < arrayCount.length; index += arraySize) {
            let planetPerPage = arrayCount.slice(index, index + arraySize);
            tempArray.push(planetPerPage);
        }
        return tempArray
    }

    renderLoading() {
        return (
            <div className="loading-page" style={{display: "inherit!important"}}>
                <div id="loading" className="loading-control">
                    <div className="loading-body">
                        <i className="fa fa-circle-o-notch fa-spin icon-loading"></i>
                        <br />
                        Carregando
                    </div>
                </div>
            </div>
        )
    }


    render() {
        return(
            <>
            {
                this.state.planets && this.state.planets.length > 0  && this.state.planets[this.state.planetIndex]?
                    <div className="lista-planeta">
                        <div className="lista-planeta">
                            <article>
                                <a > {this.state.planets[this.state.planetIndex].name} </a>
                                <p>
                                    <span> <b>População:</b> {this.state.planets[this.state.planetIndex].population}</span><br/>
                                    <span> <b>Clima:</b> {this.state.planets[this.state.planetIndex].climate}</span> <br/> 
                                    <span> <b>Terreno:</b> {this.state.planets[this.state.planetIndex].terrain} </span> <br/>
                                    <span> <b>Filmes({this.state.planets[this.state.planetIndex].films.length}):</b> </span><br/>
                                    {
                                        this.state.filmsDoPlaneta.map((fp,i) =>{
                                            return <span key={i} style={{marginLeft:'5px'}}>{fp}<br/></span>
                                        })
                                    }
                                </p>
                            </article>
                        </div>          
                        {this.renderNavigationButtons()}
                    </div>
                    :this.renderLoading()
            }
            </>
        )
    }
}

export default Planet;
