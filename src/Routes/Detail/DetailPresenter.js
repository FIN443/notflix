import React from "react";
import { Route, Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import Loader from "Components/Loader";
import noPoster from "../../assets/noPosterSmall.png";
import Message from "Components/Message";
import Production from "Routes/Production";
import Collection from "Routes/Collection";
import Info from "Routes/Info";
import Season from "Routes/Season";

const Container = styled.div`
  height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  padding: 50px;
`;

const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.bgImage});
  background-position: center 0;
  background-size: cover;
  filter: blur(3px);
  opacity: 0.5;
  z-index: 0;
`;

const Content = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
`;

const Cover = styled.div`
  width: 30%;
  height: 100%;
  background-image: url(${(props) => props.bgImage});
  background-position: center center;
  background-size: cover;
  border-radius: 5px;
  box-shadow: 0px 0px 6px 2px rgba(0, 0, 0, 0.2);
`;

const Data = styled.div`
  width: 70%;
  margin-left: 10px;
`;

const InsideTab = styled("div")`
  margin: 20px 0px;
`;

const TabList = styled("ul")`
  display: flex;
`;

const TabItem = styled("li")`
  margin-right: 20px;
  text-transform: uppercase;
  font-weight: 600;
  border: 2px solid #1abc9c;
  padding: 5px;
  border-radius: 3px;
  background-color: ${(props) => (props.active ? "#1abc9c" : "transparent")};
  color: ${(props) => (props.active ? "white" : "black")};
`;

const DetailPresenter = ({ result, loading, error, location: { pathname } }) =>
  loading ? (
    <>
      <Helmet>
        <title>Loading | Notflix</title>
      </Helmet>
      <Loader />
    </>
  ) : error ? (
    <Message color="#e74c3c" text={error} />
  ) : (
    <Container>
      <Helmet>
        <title>
          {result.original_title ? result.original_title : result.original_name}{" "}
          | Notflix
        </title>
      </Helmet>
      <Backdrop
        bgImage={`https://image.tmdb.org/t/p/original${result.backdrop_path}`}
      />
      <Content>
        <Cover
          bgImage={
            result.poster_path
              ? `https://image.tmdb.org/t/p/original${result.poster_path}`
              : noPoster
          }
        />
        <Data>
          <InsideTab>
            <TabList>
              {console.log(pathname.split("/")[3])}
              <TabItem
                active={
                  pathname.split("/")[3] === undefined ||
                  pathname.split("/")[3] === ""
                }
              >
                {console.log(result)}
                <Link to={`/${pathname.split("/")[1]}/${result.id}`}>Info</Link>
              </TabItem>
              <TabItem active={pathname.split("/")[3] === "production"}>
                <Link to={`/${pathname.split("/")[1]}/${result.id}/production`}>
                  Production
                </Link>
              </TabItem>
              {pathname.includes("/movie/")
                ? result.belongs_to_collection && (
                    <TabItem active={pathname.split("/")[3] === "collections"}>
                      <Link
                        to={`/${pathname.split("/")[1]}/${
                          result.id
                        }/collections`}
                      >
                        Collections
                      </Link>
                    </TabItem>
                  )
                : result.seasons && (
                    <TabItem active={pathname.split("/")[3] === "seasons"}>
                      <Link
                        to={`/${pathname.split("/")[1]}/${result.id}/seasons`}
                      >
                        Seasons
                      </Link>
                    </TabItem>
                  )}
            </TabList>
          </InsideTab>
          <Route
            path={`/${pathname.split("/")[1]}/${result.id}`}
            component={Info}
            exact
          />
          <Route
            path={`/${pathname.split("/")[1]}/${result.id}/production`}
            component={Production}
          />
          {pathname.includes("/movie/") ? (
            <Route
              path={`/${pathname.split("/")[1]}/${result.id}/collections`}
              component={Collection}
            />
          ) : (
            <Route
              path={`/${pathname.split("/")[1]}/${result.id}/seasons`}
              component={Season}
            />
          )}
        </Data>
      </Content>
    </Container>
  );

DetailPresenter.propTypes = {
  result: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

export default withRouter(DetailPresenter);
