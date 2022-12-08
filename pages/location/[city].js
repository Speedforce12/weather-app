import React from "react";
import cities from "../../lib/city.list.json";

// get the city from the json file
const getCity = (params) => {
  const cityParams = params.trim();
  const splitCity = cityParams.split("-");
  const id = splitCity[splitCity.length - 1];

  if (!id) {
    return null;
  }

  const city = cities.find((city) => city.id.toString() === id);

  if (city) {
    return city;
  } else {
    return null;
  }
};

const getHourlyWeather = (hourlyData) => {
  const current = new Date();

  // get current time
  current.setHours(current.getHours(), 0, 0, 0);
  const tomorrow = new Date(current);

  // set tomorrow time
  tomorrow.setDate(tomorrow.getDate() + 1);

  tomorrow.setHours(0, 0, 0, 0);

  // divide by 1000 to get time in seconds

  const currentTimeStamp = Math.floor(current.getTime() / 1000);
  const tomorrowTimeStamp = Math.floor(tomorrow.getTime() / 1000);

  const todayData = hourlyData.filter((data) => data.dt < tomorrowTimeStamp);

  return todayData;
};

// show city data
function city({ hourlyWeather, currentWeather, dailyWeather }) {


  return <div></div>;
}

export default city;

// server rendering of city data
export async function getServerSideProps(context) {
  const city = getCity(context.params.city);

  if (!city) {
    return {
      notFound: true,
    };
  }

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${city.coord.lat}&lon=${city.coord.lon}&appid=${process.env.NEXT_PUBLIC_API_KEY}&exclude=minutely&units=metric`
  );

  const data = await res.json();

  if (!data) {
    return {
      notFound: true,
    };
  }

  const hourlyWeather = getHourlyWeather(data.hourly);

  return {
    props: {
      city: city,
      currentWeather: data.current,
      dailyWeather: data.daily,
      hourlyWeather: hourlyWeather,
    },
  };
}
