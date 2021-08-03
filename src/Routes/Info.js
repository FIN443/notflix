import React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { movieApi, tvApi } from "api";

const Title = styled.h3`
  font-size: 32px;
  margin-bottom: 10px;
`;

const ItemContainer = styled.div`
  margin: 20px 0;
`;

const Item = styled.span``;

const Divider = styled.span`
  margin: 0 10px;
`;

const Overview = styled.p`
  font-size: 12px;
  opacity: 0.7;
  line-height: 1.5;
  width: 50%;
  margin-bottom: 30px;
`;

const ILink = styled.a`
  text-decoration: underline;
`;

const VideoTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 14px;
`;

const Video = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`;

const useAxios = (id, pathname) => {
  const [state, setState] = useState({
    result: null,
    error: null,
    loading: true,
    isMovie: pathname.includes("/movie/"),
  });
  useEffect(() => {
    if (state.isMovie) {
      movieApi.movieDetail(id).then(({ data: result }) => {
        setState({
          ...state,
          result,
          loading: false,
        });
      });
    } else {
      tvApi.showDetail(id).then(({ data: result }) => {
        setState({
          ...state,
          result,
          loading: false,
        });
      });
    }
  }, []);
  return state;
};

function Info({ location: { pathname } }) {
  const { result, loading, error } = useAxios(pathname.split("/")[2], pathname);
  return loading ? (
    "🕑"
  ) : (
    <>
      <Title>
        {result.original_title ? result.original_title : result.original_name}
      </Title>
      <ItemContainer>
        <Item>
          {result.release_date
            ? result.release_date.substring(0, 4)
            : result.first_air_date.substring(0, 4)}
        </Item>
        <Divider>•</Divider>
        <Item>
          {result.runtime ? result.runtime : result.episode_run_time[0]} min
        </Item>
        <Divider>•</Divider>
        <Item>
          {result.genres &&
            result.genres.map((genre, index) =>
              index === result.genres.length - 1
                ? genre.name
                : `${genre.name} / `
            )}
        </Item>
      </ItemContainer>
      <ItemContainer>
        <Item>
          {result.homepage && <ILink href={result.homepage}>Homepage</ILink>}
        </Item>
      </ItemContainer>
      <ItemContainer>
        <Item>
          {result.imdb_id && (
            <ILink href={`https://www.imdb.com/title/${result.imdb_id}`}>
              IMDb Link
            </ILink>
          )}
        </Item>
      </ItemContainer>
      <Overview>{result.overview}</Overview>
      {result.videos &&
        result.videos.results &&
        result.videos.results.map((video, index) =>
          video.name.includes("Trailer") ? (
            <div key={index}>
              <VideoTitle>{video.name}</VideoTitle>
              <Video>
                <iframe
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${video.key}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </Video>
            </div>
          ) : (
            ""
          )
        )}
    </>
  );
}

export default Info;
