import React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { movieApi, tvApi, companyApi } from "api";

const Title = styled.h2`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 30px;
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
`;

const Name = styled.h3`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
`;

const Companies = styled.div`
  margin-bottom: 50px;
`;

const Countries = styled.div`
  margin-bottom: 50px;
`;

const ImageBackground = styled.div`
  width: fit-content;
  padding: 6px 8px;
  background-color: rgba(255, 255, 255);
  border-radius: 4px;
  box-shadow: 0 0 6px 2px rgba(0, 0, 0, 0.2);
`;

const CompanyLogo = styled.img`
  object-fit: cover;
  height: 60px;
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

function Production({ location: { pathname } }) {
  const { result, loading, error } = useAxios(pathname.split("/")[2], pathname);
  console.log(result);
  return loading ? (
    "🕑"
  ) : (
    <>
      <Companies>
        <Title>Production Companies</Title>
        {result.production_companies &&
          result.production_companies.map((company, index) => (
            <Item key={index}>
              <Name>{company.name}</Name>
              {company.logo_path ? (
                <ImageBackground>
                  <CompanyLogo
                    src={`https://image.tmdb.org/t/p/w300${company.logo_path}`}
                  />
                </ImageBackground>
              ) : (
                ""
              )}
            </Item>
          ))}
      </Companies>
      <Countries>
        <Title>Production Countries</Title>
        {result.production_countries &&
          result.production_countries.map((country, index) => (
            <Item key={index}>
              <Name>{country.name}</Name>
            </Item>
          ))}
      </Countries>
    </>
  );
}

export default Production;
