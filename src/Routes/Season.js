import React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { tvApi, tvSeasonApi } from "api";
import noPoster from "../assets/noPosterSmall.png";

const Container = styled.div``;

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

const Error = styled.h4`
  font-size: 14px;
  color: #e74c3c;
  margin-bottom: 10px;
`;

const useAxios = (id, pathname) => {
  const [state, setState] = useState({
    result: null,
    error: null,
    loading: true,
    isShow: pathname.includes("/show/"),
  });
  useEffect(() => {
    if (state.isShow) {
      tvApi.showDetail(id).then(({ data: result }) => {
        console.log(result);
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

const useGetSeason = (tvId, seasonNumber) => {
  const [state, setState] = useState({
    data: null,
    error: null,
    seasonLoading: true,
  });
  console.log(tvId, seasonNumber);
  useEffect(() => {
    tvSeasonApi
      .getDetail(tvId, seasonNumber)
      .then(({ data }) => {
        setState({
          ...state,
          seasonLoading: false,
          data,
        });
      })
      .catch((err) => {
        setState({
          error: true,
        });
      });
  }, []);
  return state;
};

const SeasonItem = ({ tvId, seasonNumber }) => {
  const { data, seasonLoading, error } = useGetSeason(tvId, seasonNumber);
  console.log(data);
  return error ? (
    <Error>
      Can't find season {seasonNumber === 0 ? "Special" : seasonNumber}.
    </Error>
  ) : seasonLoading ? (
    "🕑"
  ) : (
    <SItem>
      <SPoster
        src={
          data.poster_path
            ? `https://image.tmdb.org/t/p/w300${data.poster_path}`
            : noPoster
        }
      />
      <SInfo>
        <STitle>{data.name}</STitle>
        <SOverview>{data.overview}</SOverview>
        <SSpan>
          {data.air_date.substring(0, 4)} / Episode ~{data.episodes.length}
        </SSpan>
      </SInfo>
    </SItem>
  );
};

function Season({ location: { pathname } }) {
  const { result, loading, error } = useAxios(pathname.split("/")[2], pathname);
  return loading ? (
    ""
  ) : (
    <Container>
      {result.seasons && result.seasons[0].name.includes("Season")
        ? result.seasons.map((season, index) => (
            <SeasonItem
              key={index}
              tvId={result.id}
              seasonNumber={index + 1}
              result={result}
            />
          ))
        : result.seasons.map((season, index) => (
            <SeasonItem
              key={index}
              tvId={result.id}
              seasonNumber={index}
              result={result}
            />
          ))}
    </Container>
  );
}

export default Season;
