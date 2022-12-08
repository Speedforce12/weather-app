import React from "react";
import cities from "../../lib/city.list.json";
import Head from "next/head";
import moment from "moment-timezone";
import TodaysWeather from "../../components/TodaysWeather";
import HourlyWeather from "../../components/HourlyWeather";
import WeeklyWeather from "../../components/WeeklyWeather";

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

const getHourlyWeather = (hourlyData, timezone) => {
  const endOfDay = moment().tz(timezone).endOf("day").valueOf();
  const eodTimeStamp = Math.floor(endOfDay / 1000);

  const todayData = hourlyData.filter((data) => data.dt < eodTimeStamp);

  return todayData;
};

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

  const hourlyWeather = getHourlyWeather(data.hourly, data.timezone);

  return {
    props: {
      city: city,
      timezone: data.timezone,
      currentWeather: data.current,
      dailyWeather: data.daily,
      hourlyWeather: hourlyWeather,
    },
  };
}

// show city data
function city({ timezone, hourlyWeather, currentWeather, dailyWeather, city }) {
  return (
    <div>
      <Head>
        <title>{city.name} Weather</title>
      </Head>

      <div className='page-wrapper'>
        <div className='container'>
          <TodaysWeather
            city={city}
            weather={dailyWeather[0]}
            timezone={timezone}
          />
          <HourlyWeather hourlyWeather={hourlyWeather} timezone={timezone} />
          <WeeklyWeather WeeklyWeather={dailyWeather} timezone={timezone} />
        </div>
      </div>
    </div>
  );
}
