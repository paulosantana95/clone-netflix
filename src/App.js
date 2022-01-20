import React, { useEffect, useState } from 'react';
import './App.css';
import Tmdb from './components/Tmdb';
import MovieRow from './components/MovieRow';
import FeatureMovie from './components/FeaturedMovie';
import Header from './components/Header';
import Footer from './components/Footer';

export default () => {

  const [movieList, setMovieList] = useState([]);
  const [featureData, setfeatureData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);
  
  
  useEffect(() => {
    const loadAll = async () => {
      //Pegando a lista TOTAL
      let list = await Tmdb.getHomeList();  
      setMovieList(list);

      //Pegando o Filme em Destaque
      let originals = list.filter(i=>i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length -1));
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovierInfo(chosen.id, 'tv');
      setfeatureData(chosenInfo);

    }
    
    loadAll();
  }, []);


  useEffect (() => {
    const scrollListener = () => {
      if(window.scrollY > 10) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    }

    window.addEventListener('scroll', scrollListener);

    return () => {
      window.removeEventListener('scroll', scrollListener);
    }
  }, [])


  return (
    <div className="page">

      <Header black={blackHeader} />

      {featureData &&
        <FeatureMovie item={featureData} />
      }




      <section className="lists">
        {movieList.map((item, key) => ( 
          <MovieRow key={key} title={item.title} items={item.items}  />
        ))}
      </section>
      
      <Footer />

      {movieList.length <= 0 &&
      <div className="loading">
        <img src="https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif" alt="" />
      </div>
      }
      
    </div>
  )
}
