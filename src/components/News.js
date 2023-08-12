import React, { Component } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
  static defaultProps = {
    country: 'in',
    pageSize: 5,
    category: 'science'
  }

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
  }

  capitalizeFirstLetter = (string) => {
    return string && string.charAt(0).toUpperCase() + string.substring(1);
  }

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults: 0
    }
    document.title = `NewsSpace - ${this.capitalizeFirstLetter(this.props.category)}`;
  }

  async updateData() {
    this.props.setProgress(10);
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page:${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    this.props.setProgress(30);
    let parsedata = await data.json();
    this.props.setProgress(70);
    this.setState({
      articles: parsedata.articles,
      totalResults: parsedata.totalResults,
      page: this.state.page,
      loading: false
    });
    this.props.setProgress(100);
  }

  fetchMoreData = async () => {
    
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    let data = await fetch(url);
    
    let parsedata = await data.json();
    
    this.setState({
      articles: this.state.articles.concat(parsedata.articles),
      totalResults: parsedata.totalResults,
      page: this.state.page + 1,
    });
   
  }

  componentDidMount() {
    this.updateData();
  }

  //handlePrevClick = async () => {
  //  this.setState({ page: this.state.page - 1 });
  //  this.updateData();
  //}
  //
  //handleNextClick = async () => {
  //  this.setState({ page: this.state.page + 1 });
  //  this.updateData();
  //}


  render() {
    return (
      <>
        <h1 className='text-center' style={{marginBottom:'15px',marginTop:'70px'}}>Top Headlines From {this.capitalizeFirstLetter(this.props.category)}</h1>
        {this.state.loading && <Spinner />}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          loader={<Spinner />}
          hasMore={this.state.articles.length !== this.totalResults}
          scrollableTarget="scrollableDiv"
        >
          <div className='container'>
            <div className='row'>
              {this.state.articles.map((element) => {
                return <div className='col-md-4' key={element.url}>
                  <NewsItem title={element.title} description={element.description} imgUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                </div>
              })}
            </div>
          </div>
        </InfiniteScroll>
      </>
    )
  }
}
export default News;