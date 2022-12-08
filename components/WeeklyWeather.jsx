import React from "react";
import moment from "moment-timezone";

const WeeklyWeather = ({WeeklyWeather, timezone}) => {
  return <div className="weekly">
    <h3 className="weekly__title">
Weekly <span>Weather</span>
    </h3>

    {WeeklyWeather.length > 0 && 
      WeeklyWeather.map((weather, index) => {
        if (index === 0) {
        return
        }
        
        return (
          <div className='weekly__card' key={weather.dt}>
            <div className='weekly__inner'>
              <div className='weekly__left-content'>
                <div>
                  <h3>{moment.unix(weather.dt).tz(timezone).format("dddd")}</h3>
                  <h4>
                    <span>{weather.temp.max.toFixed(0)}&deg;C</span>
                    <span>{weather.temp.min.toFixed(0)}&deg;C</span>
                  </h4>
                </div>
                <div className='weekly__sun-times'>
                  <div>
                    <span>Sunrise</span>
                    <span>
                      {moment.unix(weather.sunrise).tz(timezone).format("LT")}
                    </span>
                  </div>
                  <div>
                    <span>Sunset</span>
                    <span>
                      {moment.unix(weather.sunset).tz(timezone).format("LT")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    })}
  </div>;
};

export default WeeklyWeather;
