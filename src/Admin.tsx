import React, {
  useEffect,
  useMemo,
  useState,
} from "react";


import { useParams } from "react-router";
import firebase from "firebase/app";
import moment from "moment";
import Chart from "react-google-charts";

function Admin({ user }) {
  const { boardId }: any = useParams();
  const [data, setData] = useState([]);
  const [featuredBoards, setFeaturedBoards] = useState(null);
  const [stats, setStats] = useState(null);

  const db = useMemo(() => firebase.database(), []);

  const series = useMemo(
    () => ({
      showPoints: false,
    }),
    []
  );

  const axes = useMemo(
    () => [
      {
        primary: true,
        type: "time",
        position: "bottom",
        // filterTicks: (ticks) =>
        //   ticks.filter((date) => +timeDay.floor(date) === +date),
      },
      { type: "linear", position: "left" },
    ],
    []
  );


  useEffect(() => {
    // setLoaded(false);
    // request("GET", "/db/admin/data").then((data:any)=>{
    //   setData(data)
    // })

    db.ref('/boards')
      // .orderByChild("counter")
      // .startAt(moment(new Date()).subtract(7, "days").milliseconds())
      .limitToFirst(10)
      .once('value').then((snapshot) => {
        console.log("🚀 ~ feat", snapshot.val())
        // ...
        setFeaturedBoards(snapshot.val())
      });

    db.ref('/stats')
      .once('value').then((snapshot) => {
        // ...
        const stats = snapshot.val()
        const last7Days = Object.entries(stats.dates)
        // .sort(([a],[b]) => a < b)
        .slice(0,7)
        .map((arr:any)=>({
          date: arr[0],
          value: arr[1].boardsCreated
        }))
        console.log("🚀 ~ last7Days", last7Days)
        console.log("🚀 ~ Object.entries(stats.dates)", Object.entries(stats.dates))
        setStats({
          ...stats,
          last7Days
        })
      });



    // ref.child("items").on("value", (snapshot) => {
    //   const data = snapshot.val();

    //   setFiles(data || {});
    //   setLoaded(true);
    //   // updateStarCount(postElement, data);
    // });
    // ref.child("user").on("value", (snapshot) => {
    //   const data = snapshot.val();
    //   console.log("🚀 ~ data", data)

    //   setIsHost(data == user.uid);
    //   // updateStarCount(postElement, data);
    // });
    // return () => ref.off()
  }, [boardId]);

  console.log("🚀 ~ stats", stats)
  if (!stats || !featuredBoards) {
    return null
  }

  return (
    <div className={"flex flex-col p-12 flex-grow rounded bg-white  border border-gray-300 shadow-lg "}>

      <h1 className="font-black text-2xl mb-6">Admin console</h1>

      <div className="flex flex-row">
        <div className="flex flex-col mr-8 flex-grow text-xs mb-4 rounded-xl shadow border border-blue-100 p-4">
          <div>
            <span className="uppercase font-bold">Boards created today:</span>
            <span className="text-blue-400 font-bold ml-2">{stats.dates[moment().format("YYYY-MM-DD")]?.boardsCreated || 0}</span>
            
          </div><Chart
            width={'400px'}
            height={'200px'}
            className="block"
            chartType="LineChart"
            loader={<div>Loading Chart</div>}
            data={[
              ['x', 'created'],
              ...stats.last7Days.map((n, i) => [i, n.value]),
            ]}
            options={{
              hAxis: {
                title: 'Time',
              },
              vAxis: {
                title: 'Popularity',
              },
            }}
            rootProps={{ 'data-testid': '1' }}
          />
        </div>
  
        <div className="flex flex-col flex-grow text-xs mb-4 rounded-xl shadow border border-blue-100 p-4">
          <div>
            <span className="uppercase font-bold">Boards created yesterday:</span>
            <span className="text-blue-400 font-bold ml-2">{stats.dates[moment().subtract(1, "day").format("YYYY-MM-DD")]?.boardsCreated || 0}</span>
            
          </div><Chart
            width={'400px'}
            height={'200px'}
            className="bloc"
            chartType="LineChart"
            loader={<div>Loading Chart</div>}
            data={[
              ['x', 'created'],
              ...stats.last7Days.map((n, i) => [i, n.value]),
            ]}
            options={{
              hAxis: {
                title: 'Time',
              },
              vAxis: {
                title: 'Popularity',
              },
            }}
            rootProps={{ 'data-testid': '1' }}
          />
        </div>
      </div>

      <div className="text-xs mb-4 rounded-xl shadow border border-blue-100 p-4">
        <span className="uppercase font-bold">10 most popular boards (7 days):</span>

        <div className="mt-4">
          <ul>
            {Object.entries(featuredBoards).map(([key, value]: [string, any]) => {
              console.log("🚀 ~ value", value)
              return (
                <li key={key} className="flex flex-row">
                  <div className="w-32"><a className="font-mono" href={"/" + key} target="_blank">{key}↗</a></div>
                  <div className="w-32">Files: {Object.keys(value.items || []).length || "No files"}</div>
                  <div className="w-32">Hits: {value.counter || 0}</div>
                  <div className="w-32">Date: {moment(value.created).format("MMM Do")}</div>
                </li>
              )
            })
            }
          </ul>
        </div>
      </div>


    </div>
  );
}

export default Admin