(window.webpackJsonp=window.webpackJsonp||[]).push([[212],{1110:function(e,n,t){"use strict";t.d(n,"a",(function(){return s})),t.d(n,"b",(function(){return d}));var r=t(0),a=t.n(r);function c(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){c(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function p(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},c=Object.keys(e);for(r=0;r<c.length;r++)t=c[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(r=0;r<c.length;r++)t=c[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var b=a.a.createContext({}),l=function(e){var n=a.a.useContext(b),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},s=function(e){var n=l(e.components);return a.a.createElement(b.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return a.a.createElement(a.a.Fragment,{},n)}},m=a.a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,c=e.originalType,i=e.parentName,b=p(e,["components","mdxType","originalType","parentName"]),s=l(t),m=r,d=s["".concat(i,".").concat(m)]||s[m]||u[m]||c;return t?a.a.createElement(d,o(o({ref:n},b),{},{components:t})):a.a.createElement(d,o({ref:n},b))}));function d(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var c=t.length,i=new Array(c);i[0]=m;var o={};for(var p in n)hasOwnProperty.call(n,p)&&(o[p]=n[p]);o.originalType=e,o.mdxType="string"==typeof e?e:r,i[1]=o;for(var b=2;b<c;b++)i[b]=t[b];return a.a.createElement.apply(null,i)}return a.a.createElement.apply(null,t)}m.displayName="MDXCreateElement"},284:function(e,n,t){"use strict";t.r(n),t.d(n,"frontMatter",(function(){return i})),t.d(n,"metadata",(function(){return o})),t.d(n,"toc",(function(){return p})),t.d(n,"default",(function(){return l}));var r=t(3),a=t(8),c=(t(0),t(1110)),i={id:"knex.index",title:"Interface: Index",sidebar_label:"Index",custom_edit_url:null,hide_title:!0},o={unversionedId:"api/interfaces/knex.index",id:"api/interfaces/knex.index",isDocsHomePage:!1,title:"Interface: Index",description:"Interface: Index",source:"@site/docs/api/interfaces/knex.index.md",slug:"/api/interfaces/knex.index",permalink:"/docs/next/api/interfaces/knex.index",editUrl:null,version:"current",sidebar_label:"Index",sidebar:"API",previous:{title:"Interface: IQueryBuilder<T>",permalink:"/docs/next/api/interfaces/knex.iquerybuilder"},next:{title:"Interface: IndexDef",permalink:"/docs/next/api/interfaces/knex.indexdef"}},p=[{value:"Properties",id:"properties",children:[{value:"columnName",id:"columnname",children:[]},{value:"composite",id:"composite",children:[]},{value:"keyName",id:"keyname",children:[]},{value:"primary",id:"primary",children:[]},{value:"unique",id:"unique",children:[]}]}],b={toc:p};function l(e){var n=e.components,t=Object(a.a)(e,["components"]);return Object(c.b)("wrapper",Object(r.a)({},b,t,{components:n,mdxType:"MDXLayout"}),Object(c.b)("h1",{id:"interface-index"},"Interface: Index"),Object(c.b)("p",null,Object(c.b)("a",{parentName:"p",href:"/docs/next/api/modules/knex"},"knex"),".Index"),Object(c.b)("h2",{id:"properties"},"Properties"),Object(c.b)("h3",{id:"columnname"},"columnName"),Object(c.b)("p",null,"\u2022 ",Object(c.b)("strong",{parentName:"p"},"columnName"),": ",Object(c.b)("em",{parentName:"p"},"string")),Object(c.b)("p",null,"Defined in: ",Object(c.b)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/cebdc71/packages/knex/src/typings.ts#L54"},"packages/knex/src/typings.ts:54")),Object(c.b)("hr",null),Object(c.b)("h3",{id:"composite"},"composite"),Object(c.b)("p",null,"\u2022 ",Object(c.b)("inlineCode",{parentName:"p"},"Optional")," ",Object(c.b)("strong",{parentName:"p"},"composite"),": ",Object(c.b)("em",{parentName:"p"},"boolean")),Object(c.b)("p",null,"Defined in: ",Object(c.b)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/cebdc71/packages/knex/src/typings.ts#L58"},"packages/knex/src/typings.ts:58")),Object(c.b)("hr",null),Object(c.b)("h3",{id:"keyname"},"keyName"),Object(c.b)("p",null,"\u2022 ",Object(c.b)("strong",{parentName:"p"},"keyName"),": ",Object(c.b)("em",{parentName:"p"},"string")),Object(c.b)("p",null,"Defined in: ",Object(c.b)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/cebdc71/packages/knex/src/typings.ts#L55"},"packages/knex/src/typings.ts:55")),Object(c.b)("hr",null),Object(c.b)("h3",{id:"primary"},"primary"),Object(c.b)("p",null,"\u2022 ",Object(c.b)("strong",{parentName:"p"},"primary"),": ",Object(c.b)("em",{parentName:"p"},"boolean")),Object(c.b)("p",null,"Defined in: ",Object(c.b)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/cebdc71/packages/knex/src/typings.ts#L57"},"packages/knex/src/typings.ts:57")),Object(c.b)("hr",null),Object(c.b)("h3",{id:"unique"},"unique"),Object(c.b)("p",null,"\u2022 ",Object(c.b)("strong",{parentName:"p"},"unique"),": ",Object(c.b)("em",{parentName:"p"},"boolean")),Object(c.b)("p",null,"Defined in: ",Object(c.b)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/cebdc71/packages/knex/src/typings.ts#L56"},"packages/knex/src/typings.ts:56")))}l.isMDXComponent=!0}}]);