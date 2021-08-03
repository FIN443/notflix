import React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { movieApi, collectionApi } from "api";

const Container = styled.div``;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 14px;
  opacity: 0.8;
  margin-bottom: 40px;
`;

const SItem = styled.div`
  display: flex;
  margin-bottom: 40px;
`;

const SPoster = styled.img`
  border-radius: 4px;
  box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.4);
  width: 240px;
  height: auto;
  object-fit: cover;
`;

const SInfo = styled.div`
  margin-top: 14px;
  margin-left: 10px;
`;

const STitle = styled.h2`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 20px;
`;

const SOverview = styled.p`
  font-size: 14px;
  opacity: 0.8;
  margin-bottom: 20px;
`;

const SSpan = styled.span`
  font-size: 12px;
`;

const useAxios = (id, pathname) => {
  const [state, setState] = useState({
    collections: null,
    error: null,
    loading: true,
    isMovie: pathname.includes("/movie/"),
  });
  useEffect(() => {
    if (state.isMovie) {
      movieApi.movieDetail(id).then(({ data: result }) => {
        const collectionId = result.belongs_to_collection.id;
        collectionApi.getDetail(collectionId).then(({ data: collections }) => {
          console.log(collections);
          setState({
            ...state,
            collections,
            loading: false,
          });
        });
      });
    }
  }, []);
  return state;
};

function Collection({ location: { pathname } }) {
  const { collections, loading, error } = useAxios(
    pathname.split("/")[2],
    pathname
  );
  return loading ? (
    "🕑"
  ) : (
    <Container>
      <Title>{collections.name}</Title>
      <Overview>{collections.overview}</Overview>
      {collections.parts &&
        collections.parts.map((collection, index) => (
          <SItem key={index}>
            <SPoster
              src={`https://image.tmdb.org/t/p/w300${collection.poster_path}`}
            />
            <SInfo>
              <STitle>{collection.original_title}</STitle>
              <SOverview>{collection.overview}</SOverview>
              <SSpan>
                {collection.release_date.substring(0, 4)} / Average:{" "}
                {collection.vote_average}
              </SSpan>
            </SInfo>
          </SItem>
        ))}
    </Container>
  );
}

export default Collection;
