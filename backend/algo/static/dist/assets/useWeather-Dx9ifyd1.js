import{c as t}from"./index-DF6BEUun.js";import{u as d}from"./useQuery-B9rE_mUz.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=t("CloudRain",[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",key:"1pljnt"}],["path",{d:"M16 14v6",key:"1j4efv"}],["path",{d:"M8 14v6",key:"17c4r9"}],["path",{d:"M12 16v6",key:"c8a4gj"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l=t("Droplet",[["path",{d:"M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z",key:"c7niix"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=t("Snowflake",[["line",{x1:"2",x2:"22",y1:"12",y2:"12",key:"1dnqot"}],["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}],["path",{d:"m20 16-4-4 4-4",key:"rquw4f"}],["path",{d:"m4 8 4 4-4 4",key:"12s3z9"}],["path",{d:"m16 4-4 4-4-4",key:"1tumq1"}],["path",{d:"m8 20 4-4 4 4",key:"9p200w"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=t("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=t("Wind",[["path",{d:"M12.8 19.6A2 2 0 1 0 14 16H2",key:"148xed"}],["path",{d:"M17.5 8a2.5 2.5 0 1 1 2 4H2",key:"1u4tom"}],["path",{d:"M9.8 4.4A2 2 0 1 1 11 8H2",key:"75valh"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=t("Zap",[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]]),o=async m=>{const n=`https://api.open-meteo.com/v1/forecast?${new URLSearchParams({latitude:45.0705.toString(),longitude:7.6868.toString(),hourly:"temperature_2m,rain",current:"temperature_2m,weathercode,windspeed_10m,relativehumidity_2m",daily:"weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,uv_index_max",past_days:"0",forecast_days:"7",timezone:"Europe/Rome"}).toString()}`,a=await fetch(n);if(!a.ok)throw new Error(`Failed to fetch weather data: ${a.statusText}`);const e=await a.json();return{current:{time:new Date(e.current.time),temperature_2m:e.current.temperature_2m,weathercode:e.current.weathercode,windspeed_10m:e.current.windspeed_10m,relativehumidity_2m:e.current.relativehumidity_2m},hourly:{time:e.hourly.time.map(r=>new Date(r)),temperature_2m:e.hourly.temperature_2m,rain:e.hourly.rain},daily:{time:e.daily.time.map(r=>new Date(r)),weathercode:e.daily.weathercode,temperature_2m_max:e.daily.temperature_2m_max,temperature_2m_min:e.daily.temperature_2m_min,precipitation_sum:e.daily.precipitation_sum,windspeed_10m_max:e.daily.windspeed_10m_max,uv_index_max:e.daily.uv_index_max},city:"Torino",country:"IT"}},f=(m="Torino",i=!0)=>d({queryKey:["weather",m],queryFn:()=>o(),staleTime:30*1e3,refetchOnWindowFocus:!1,refetchInterval:60*1e3,enabled:i});export{h as C,l as D,k as S,w as W,x as Z,_ as a,f as u};
