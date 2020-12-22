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
    <div className="mt-36 mb-24">

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

    </div>
  );
};
