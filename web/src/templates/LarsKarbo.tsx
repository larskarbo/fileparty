import React from "react";

export const LarsKarbo = () => {
  return (
    <div className="mt-36">
      <a href="https://larskarbo.no" target="_blank">
        <div
          className=" flex items-center border border-gray-200 rounded p-2 px-4
          hover:border-gray-400 transition-colors duration-150 hover:shadow-sm
          "
        >
          <img
            className="rounded-full w-12 h-12 mr-2"
            src={
              "https://s.gravatar.com/avatar/4579b299730ddc53e3d523ec1cd5482a?s=96"
            }
          />
          <div className="font-light">
            made by <strong className="font-bold">@larskarbo</strong>
          </div>
        </div>
      </a>

      <a
        href="https://www.producthunt.com/posts/fileparty?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-fileparty"
        target="_blank"
      >
        <img
          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=279320&theme=light"
          alt="FileParty - Watch local files together in real time | Product Hunt"
          //  style="width: 250px; height: 54px;"
          className="mt-6"
          width="250"
          height="54"
        />
      </a>
    </div>
  );
};
