import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import CircularProgress  from '@material-ui/core/CircularProgress';
import { useLocation, useHistory } from "react-router-dom";

import Results from '../../components/Results/Results';
import Pager from '../../components/Pager/Pager';
import Facets from '../../components/Facets/Facets';
import SearchBar from '../../components/SearchBar/SearchBar';
import { useSearch } from '../../contexts/SearchContext';

import "./Search.css";
import SearchToggle from '../../components/SearchToggle/SearchToggle';

export default function Search() {
  // eslint-disable-next-line
  const { isSemantic, setIsSemantic } = useSearch();
  
  let location = useLocation();
  let history = useHistory();
  
  const [ results, setResults ] = useState([]);
  const [ resultCount, setResultCount ] = useState(0);
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ q, setQ ] = useState(new URLSearchParams(location.search).get('q') ?? "*");
  const [ top ] = useState(new URLSearchParams(location.search).get('top') ?? 16);
  const [ skip, setSkip ] = useState(new URLSearchParams(location.search).get('skip') ?? 0);
  const [ filters, setFilters ] = useState([]);
  const [ facets, setFacets ] = useState({});
  const [ answers, setAnswers ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(true);
  const isFirstRender = useRef(true);
  const oldQ = useRef("");
  //let oldQ = "";


  useEffect(() => {
    
  let executeSearch = () => {
    setIsLoading(true);
    const body = {
      q: q,
      top: top,
      skip: skip,
      filters: filters,
      isSemantic: isSemantic
    };

    axios.post( '/api/search', body)
        .then( response => {
            setResults(response.data.results);
            setAnswers(response.data.answers);
            setFacets(response.data.facets);
            setResultCount(response.data.count);
            setIsLoading(false);
        } )
        .catch(error => {
            console.log(error);
            setIsLoading(false);
        });
  }

    if (!isFirstRender.current && oldQ.current === q) {      
      setIsLoading(true);
      const body = {
        q: q,
        top: top,
        skip: skip,
        filters: filters,
        isSemantic: isSemantic
      };
  
      axios.post( '/api/search', body)
          .then( response => {
              setResults(response.data.results);
              //setFacets(response.data.facets); //commented out to allow for multi-select facets
              setResultCount(response.data.count);
              setIsLoading(false);
          } )
          .catch(error => {
              console.log(error);
              setIsLoading(false);
          });
      
    } else {
      executeSearch();
      oldQ.current = q;
      isFirstRender.current =  false;
    }
    

  }, [q, top, currentPage, filters, isSemantic, skip]);


  let postSearchHandler = (searchTerm) => {
    // pushing the new search term to history when q is updated
    // allows the back button to work as expected when coming back from the details page
    history.push('/search?q=' + searchTerm);  
    oldQ.current = q;
    setQ(searchTerm);
    setCurrentPage(1);
    setSkip(0);
    setFilters([]);
  }


  let searchToggleHandler = () => {
    setIsSemantic(!isSemantic);
  }


  let updatePagination = (newPageNumber) => {
    setSkip((newPageNumber-1) * top);
    setCurrentPage(newPageNumber);
  }

  var body;
  if (isLoading) {
    body = (
      <div className="col-md-9">
        <CircularProgress />
      </div>);
  } else {
    body = (
      <div className="col-md-9">
        <Results documents={results} top={top} skip={skip} count={resultCount} answers={answers}></Results>
        <Pager className="pager-style" currentPage={currentPage} resultCount={resultCount} resultsPerPage={top} setCurrentPage={updatePagination}></Pager>
      </div>
    )
  }

  return (
    <main className="main main--search container-fluid">
      
      <div className="row">
        <div className="col-md-3">
          <div className="search-bar">
            <SearchBar postSearchHandler={postSearchHandler} q={q}></SearchBar>
            <SearchToggle checked={isSemantic} onChange={searchToggleHandler}></SearchToggle>
          </div>
          
          <Facets facets={facets} filters={filters} setFilters={setFilters}></Facets>
        </div>
        {body}
      </div>
    </main>
  );
}