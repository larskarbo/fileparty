import React from "react";
import { graphql } from 'gatsby';
import GatsbyImage from 'gatsby-image';
import { useStaticQuery } from 'gatsby';


export const LarsKarbo = () => {
  const data = useStaticQuery(graphql`
  {pb:file(relativePath: { eq: "pb.jpeg" }) {
    childImageSharp{
      fixed(width: 36, height: 36) {
        ...GatsbyImageSharpFixed
      }
  
    }
  }}
  `);
  return (
    <div className="mt-36">

      <a href="https://larskarbo.no" target="_blank">
        <div className=" flex items-center border border-gray-200 rounded p-2 px-4
          hover:border-gray-400 transition-colors duration-150 hover:shadow-sm
          ">
          <GatsbyImage className="rounded-full mr-2" fixed={data.pb.childImageSharp.fixed} />
          <div className="font-light">
            made by <strong className="font-bold">@larskarbo</strong>
          </div>
        </div>
      </a>

      <a href="https://www.producthunt.com/posts/fileparty?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-fileparty" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=279320&theme=light" alt="FileParty - Watch local files together in real time | Product Hunt"
      //  style="width: 250px; height: 54px;"
      className="mt-6"
        width="250" height="54" /></a>

    </div>
  );
};
