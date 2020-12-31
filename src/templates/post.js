import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { graphql } from 'gatsby';
import "./post.css"
import { Link } from 'gatsby';
import logo from "../app/logo.svg"
import { Helmet } from 'react-helmet';


const Post = ({ data, location }) => {
  console.log('location: ', location);
  console.log("🚀 ~ data", data)
  const post = data.markdownRemark


  const ogImagePath = post.frontmatter.hero?.childImageSharp.fixed.src
  console.log('ogImagePath: ', ogImagePath);


  return (
    <div className=" pb-24 flex flex-row justify-center bg-gradient-to-tr from-gray-100 to-gray-50">

      <Helmet>
        <meta property="og:url" content={"https://fileparty.co" + location.pathName} />
        <link rel="canonical" href={"https://fileparty.co" + location.pathName} />
        <title>{post.frontmatter.title}</title>
        <meta property="og:title" content={post.frontmatter.title} />
        <meta name="twitter:title" content={post.frontmatter.title} />
        <meta name="title" content={post.frontmatter.title} />

        <meta name="description" content={post.frontmatter.excerpt} />
        <meta property="og:description" content={post.frontmatter.excerpt} />
        <meta name="twitter:description" content={post.frontmatter.excerpt} />

        <meta property="og:site_name" content="FileParty Blog" />

        {ogImagePath && <meta property="og:image" content={ogImagePath} />}
        {ogImagePath && <meta name="twitter:image" content={ogImagePath} />}

        {ogImagePath && <meta name="twitter:card" content="summary_large_image" />}
      </Helmet>

      <div className="block">
        <div className=" my-12">
          <div className="flex items-center">

            <Link to="/" className=" mr-4">
              <img className="w-12 h-12" src={logo} />
            </Link>

            <div className="text-2xl  ">
              FileParty <span className="font-thin">Blog</span>
            </div>
          </div>
        </div>

        <article className="max-w-screen-md bg-white px-12 py-12 rounded shadow">
          <h1 className="text-5xl font-medium">{post.frontmatter.title}</h1>
          <div className="text-gray-600 font-light text-sm py-4">Written by <a href="https://larskarbo.no/">Lars Karbo</a> on {new Date(post.frontmatter.date).toLocaleDateString("en-US")}</div>
          <div className="content" dangerouslySetInnerHTML={{ __html: post.html }} />
        </article>
      </div>
    </div>
  )
}
export default Post;

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date
        excerpt
        hero { 
          childImageSharp {
            fixed(width: 1200, height: 630) {
              src
            }  
          }
        }
      }
    }
  }
`