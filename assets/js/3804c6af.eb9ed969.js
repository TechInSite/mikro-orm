(window.webpackJsonp=window.webpackJsonp||[]).push([[243],{1256:function(e,t,n){"use strict";n.d(t,"a",(function(){return b})),n.d(t,"b",(function(){return m}));var r=n(0),a=n.n(r);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=a.a.createContext({}),p=function(e){var t=a.a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},b=function(e){var t=p(e.components);return a.a.createElement(s.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},u=a.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,o=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),b=p(n),u=r,m=b["".concat(o,".").concat(u)]||b[u]||d[u]||i;return n?a.a.createElement(m,c(c({ref:t},s),{},{components:n})):a.a.createElement(m,c({ref:t},s))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,o=new Array(i);o[0]=u;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:r,o[1]=c;for(var s=2;s<i;s++)o[s]=n[s];return a.a.createElement.apply(null,o)}return a.a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},312:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return o})),n.d(t,"metadata",(function(){return c})),n.d(t,"toc",(function(){return l})),n.d(t,"default",(function(){return p}));var r=n(3),a=n(7),i=(n(0),n(1256)),o={id:"knex.knex.sql",title:"Interface: Sql",sidebar_label:"Sql",hide_title:!0},c={unversionedId:"api/interfaces/knex.knex.sql",id:"version-4.4/api/interfaces/knex.knex.sql",isDocsHomePage:!1,title:"Interface: Sql",description:"Interface: Sql",source:"@site/versioned_docs/version-4.4/api/interfaces/knex.knex.sql.md",slug:"/api/interfaces/knex.knex.sql",permalink:"/docs/api/interfaces/knex.knex.sql",editUrl:"https://github.com/mikro-orm/mikro-orm/edit/master/docs/versioned_docs/version-4.4/api/interfaces/knex.knex.sql.md",version:"4.4",lastUpdatedBy:"Renovate Bot",lastUpdatedAt:1612397369,sidebar_label:"Sql",sidebar:"version-4.4/API",previous:{title:"Interface: SocketConnectionConfig",permalink:"/docs/api/interfaces/knex.knex.socketconnectionconfig"},next:{title:"Interface: SqlNative",permalink:"/docs/api/interfaces/knex.knex.sqlnative"}},l=[{value:"Hierarchy",id:"hierarchy",children:[]},{value:"Properties",id:"properties",children:[{value:"bindings",id:"bindings",children:[]},{value:"method",id:"method",children:[]},{value:"options",id:"options",children:[]},{value:"sql",id:"sql",children:[]}]},{value:"Methods",id:"methods",children:[{value:"toNative",id:"tonative",children:[]}]}],s={toc:l};function p(e){var t=e.components,n=Object(a.a)(e,["components"]);return Object(i.b)("wrapper",Object(r.a)({},s,n,{components:t,mdxType:"MDXLayout"}),Object(i.b)("h1",{id:"interface-sql"},"Interface: Sql"),Object(i.b)("p",null,Object(i.b)("a",Object(r.a)({parentName:"p"},{href:"/docs/api/modules/knex"}),"knex"),".",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:"/docs/api/modules/knex.knex-1"}),"Knex"),".Sql"),Object(i.b)("h2",{id:"hierarchy"},"Hierarchy"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("strong",{parentName:"li"},"Sql"))),Object(i.b)("h2",{id:"properties"},"Properties"),Object(i.b)("h3",{id:"bindings"},"bindings"),Object(i.b)("p",null,"\u2022 ",Object(i.b)("strong",{parentName:"p"},"bindings"),": readonly ",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:"/docs/api/modules/knex.knex-1#value"}),Object(i.b)("em",{parentName:"a"},"Value")),"[]"),Object(i.b)("p",null,"Defined in: node_modules/knex/types/index.d.ts:1619"),Object(i.b)("hr",null),Object(i.b)("h3",{id:"method"},"method"),Object(i.b)("p",null,"\u2022 ",Object(i.b)("strong",{parentName:"p"},"method"),": ",Object(i.b)("em",{parentName:"p"},"string")),Object(i.b)("p",null,"Defined in: node_modules/knex/types/index.d.ts:1617"),Object(i.b)("hr",null),Object(i.b)("h3",{id:"options"},"options"),Object(i.b)("p",null,"\u2022 ",Object(i.b)("strong",{parentName:"p"},"options"),": ",Object(i.b)("em",{parentName:"p"},"any")),Object(i.b)("p",null,"Defined in: node_modules/knex/types/index.d.ts:1618"),Object(i.b)("hr",null),Object(i.b)("h3",{id:"sql"},"sql"),Object(i.b)("p",null,"\u2022 ",Object(i.b)("strong",{parentName:"p"},"sql"),": ",Object(i.b)("em",{parentName:"p"},"string")),Object(i.b)("p",null,"Defined in: node_modules/knex/types/index.d.ts:1620"),Object(i.b)("h2",{id:"methods"},"Methods"),Object(i.b)("h3",{id:"tonative"},"toNative"),Object(i.b)("p",null,"\u25b8 ",Object(i.b)("strong",{parentName:"p"},"toNative"),"(): ",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:"/docs/api/interfaces/knex.knex.sqlnative"}),Object(i.b)("em",{parentName:"a"},"SqlNative"))),Object(i.b)("p",null,Object(i.b)("strong",{parentName:"p"},"Returns:")," ",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:"/docs/api/interfaces/knex.knex.sqlnative"}),Object(i.b)("em",{parentName:"a"},"SqlNative"))),Object(i.b)("p",null,"Defined in: node_modules/knex/types/index.d.ts:1621"))}p.isMDXComponent=!0}}]);