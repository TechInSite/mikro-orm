(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[53502],{3905:function(e,t,r){"use strict";r.d(t,{Zo:function(){return u},kt:function(){return d}});var n=r(67294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var s=n.createContext({}),p=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},u=function(e){var t=p(e.components);return n.createElement(s.Provider,{value:t},e.children)},l={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},f=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,s=e.parentName,u=c(e,["components","mdxType","originalType","parentName"]),f=p(r),d=o,m=f["".concat(s,".").concat(d)]||f[d]||l[d]||a;return r?n.createElement(m,i(i({ref:t},u),{},{components:r})):n.createElement(m,i({ref:t},u))}));function d(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,i=new Array(a);i[0]=f;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:o,i[1]=c;for(var p=2;p<a;p++)i[p]=r[p];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}f.displayName="MDXCreateElement"},71477:function(e,t,r){"use strict";r.r(t),r.d(t,{frontMatter:function(){return i},contentTitle:function(){return c},metadata:function(){return s},toc:function(){return p},default:function(){return l}});var n=r(74034),o=r(79973),a=(r(67294),r(3905)),i={id:"core.queryresult",title:"Interface: QueryResult",sidebar_label:"QueryResult",custom_edit_url:null,hide_title:!0},c="Interface: QueryResult",s={unversionedId:"api/interfaces/core.queryresult",id:"version-4.5/api/interfaces/core.queryresult",isDocsHomePage:!1,title:"Interface: QueryResult",description:"core.QueryResult",source:"@site/versioned_docs/version-4.5/api/interfaces/core.queryresult.md",sourceDirName:"api/interfaces",slug:"/api/interfaces/core.queryresult",permalink:"/docs/api/interfaces/core.queryresult",editUrl:null,version:"4.5",lastUpdatedBy:"Renovate Bot",lastUpdatedAt:1628072861,formattedLastUpdatedAt:"8/4/2021",frontMatter:{id:"core.queryresult",title:"Interface: QueryResult",sidebar_label:"QueryResult",custom_edit_url:null,hide_title:!0},sidebar:"version-4.5/API",previous:{title:"QueryOrderMap",permalink:"/docs/api/interfaces/core.queryordermap"},next:{title:"ReferenceOptions",permalink:"/docs/api/interfaces/core.referenceoptions"}},p=[{value:"Properties",id:"properties",children:[{value:"affectedRows",id:"affectedrows",children:[]},{value:"insertId",id:"insertid",children:[]},{value:"row",id:"row",children:[]},{value:"rows",id:"rows",children:[]}]}],u={toc:p};function l(e){var t=e.components,r=(0,o.Z)(e,["components"]);return(0,a.kt)("wrapper",(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"interface-queryresult"},"Interface: QueryResult"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"/docs/api/modules/core"},"core"),".QueryResult"),(0,a.kt)("h2",{id:"properties"},"Properties"),(0,a.kt)("h3",{id:"affectedrows"},"affectedRows"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("strong",{parentName:"p"},"affectedRows"),": ",(0,a.kt)("em",{parentName:"p"},"number")),(0,a.kt)("p",null,"Defined in: ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/bcf1a0899b/packages/core/src/connections/Connection.ts#L127"},"packages/core/src/connections/Connection.ts:127")),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"insertid"},"insertId"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("strong",{parentName:"p"},"insertId"),": ",(0,a.kt)("em",{parentName:"p"},"number")),(0,a.kt)("p",null,"Defined in: ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/bcf1a0899b/packages/core/src/connections/Connection.ts#L128"},"packages/core/src/connections/Connection.ts:128")),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"row"},"row"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,a.kt)("strong",{parentName:"p"},"row"),": ",(0,a.kt)("a",{parentName:"p",href:"/docs/api/modules/core#dictionary"},(0,a.kt)("em",{parentName:"a"},"Dictionary")),"<any",">"),(0,a.kt)("p",null,"Defined in: ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/bcf1a0899b/packages/core/src/connections/Connection.ts#L129"},"packages/core/src/connections/Connection.ts:129")),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"rows"},"rows"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,a.kt)("strong",{parentName:"p"},"rows"),": ",(0,a.kt)("a",{parentName:"p",href:"/docs/api/modules/core#dictionary"},(0,a.kt)("em",{parentName:"a"},"Dictionary")),"<any",">","[]"),(0,a.kt)("p",null,"Defined in: ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/bcf1a0899b/packages/core/src/connections/Connection.ts#L130"},"packages/core/src/connections/Connection.ts:130")))}l.isMDXComponent=!0}}]);