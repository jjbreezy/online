import{r as l}from"./vendor-react-DiN-_hTo.js";/**
 * @license lucide-react v1.46.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=t=>t?.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-react v1.46.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function B(t,e,n=[]){if(e==null)throw new Error("[lucide]: iconNode is required when icon name is used");return{name:j(t),size:24,node:e,...n.length>0?{aliases:n}:{}}}/**
 * @license lucide-react v1.46.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=t=>{let e="",n=!1;for(const o of t){if(o==="-"||o==="_"||o<=" "){n=e.length>0;continue}e.length===0?e+=o.toLowerCase():e+=n?o.toUpperCase():o,n=!1}return e};/**
 * @license lucide-react v1.46.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=t=>{const e=_(t);return e.charAt(0).toUpperCase()+e.slice(1)};/**
 * @license lucide-react v1.46.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=(...t)=>t.filter((e,n,o)=>!!e&&e.trim()!==""&&o.indexOf(e)===n).join(" ").trim();/**
 * @license lucide-react v1.46.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide-react v1.46.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function y(t){return t!=null}function q(t,e={}){const n=e.attributeNames??{},o=i=>n[i]??i,a=t.size??t.width??c.width,h=t.size??t.height??c.height,u=t.aliases?.filter(i=>typeof i=="string"&&i.trim()!=="").map(i=>`lucide-${i}`)??[],k=[...t.name?[`lucide-${t.name}`]:[],...u],s=e.className?.split(" ").filter(Boolean)??[],f=e.includeDefaultClasses===!1?C(...s):C("lucide",...k,...s),x=e.absoluteStrokeWidth?Number(e.strokeWidth??c["stroke-width"])*Number(t.size??t.width??c.width)/Number(e.size??e.width??c.width):e.strokeWidth??c["stroke-width"];return["svg",{...Object.entries(c).reduce((i,[r,d])=>(i[o(r)]=d,i),{}),..."color"in e&&e.color&&{[o("stroke")]:e.color},..."size"in e&&y(e.size)&&{[o("width")]:e.size,[o("height")]:e.size},..."width"in e&&y(e.width)&&{[o("width")]:e.width},..."height"in e&&y(e.height)&&{[o("height")]:e.height},[o("stroke-width")]:x,...f&&{[o("class")]:f},[o("viewBox")]:`0 0 ${a} ${h}`,...e.hasA11yProp===!1?{[o("aria-hidden")]:"true"}:{},..."attributes"in e&&e.attributes},t.node.map(i=>{const[r,d,w]=i,g=e.nonScalingStroke?{[o("vector-effect")]:"non-scaling-stroke",...d}:d;return w?[r,g,w]:[r,g]})]}/**
 * @license lucide-react v1.46.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function D(t,e={}){return q(t,{...e,attributeNames:{...e.attributeNames,class:"className","stroke-width":"strokeWidth","stroke-linecap":"strokeLinecap","stroke-linejoin":"strokeLinejoin","vector-effect":"vectorEffect"}})}/**
 * @license lucide-react v1.46.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P=t=>{for(const e in t)if(e.startsWith("aria-")||e==="role"||e==="title")return!0;return!1},R=l.createContext({}),F=()=>l.useContext(R),H=l.forwardRef(({color:t,size:e,width:n,height:o,strokeWidth:a,absoluteStrokeWidth:h,nonScalingStroke:u,className:k="",children:s,iconNode:f=[],icon:x={node:f,aliases:[],size:24},...b},i)=>{const{size:r=24,strokeWidth:d=2,absoluteStrokeWidth:w=!1,nonScalingStroke:g=!1,color:p="currentColor",className:v=""}=F()??{},A=!!s||P(b),[W,L,E=[]]=D(x,{color:t??p,width:n??e??r,height:o??e??r,strokeWidth:a??d,absoluteStrokeWidth:h??w,nonScalingStroke:u??g,className:C(v,k),hasA11yProp:A,attributes:b});return l.createElement(W,{ref:i,...L},[...E.map(([M,$])=>l.createElement(M,$)),...Array.isArray(s)?s:[s]])});/**
 * @license lucide-react v1.46.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function z(t,e=[],n=[]){const o=typeof t=="string"?B(t,e,n):t,a=l.forwardRef(({className:h,...u},k)=>l.createElement(H,{ref:k,icon:o,className:h,...u}));return o.name&&(a.displayName=I(o.name)),a}/**
 * @license lucide-react v1.46.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m={name:"external-link",size:24,node:[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]]};m.node;const U=z(m);/**
 * @license lucide-react v1.46.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N={name:"orbit",size:24,node:[["path",{d:"M20.341 6.484A10 10 0 0 1 10.266 21.85",key:"1enhxb"}],["path",{d:"M3.659 17.516A10 10 0 0 1 13.74 2.152",key:"1crzgf"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}],["circle",{cx:"19",cy:"5",r:"2",key:"mhkx31"}],["circle",{cx:"5",cy:"19",r:"2",key:"v8kfzx"}]]};N.node;const K=z(N);/**
 * @license lucide-react v1.46.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S={name:"sparkles",size:24,node:[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]],aliases:["stars"]};S.node;const V=z(S);export{U as E,K as O,V as S};
