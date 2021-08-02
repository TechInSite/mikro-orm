(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[46971],{3905:function(e,t,a){"use strict";a.d(t,{Zo:function(){return m},kt:function(){return d}});var n=a(67294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},i=Object.keys(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var p=n.createContext({}),s=function(e){var t=n.useContext(p),a=t;return e&&(a="function"==typeof e?e(t):l(l({},t),e)),a},m=function(e){var t=s(e.components);return n.createElement(p.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,i=e.originalType,p=e.parentName,m=o(e,["components","mdxType","originalType","parentName"]),u=s(a),d=r,k=u["".concat(p,".").concat(d)]||u[d]||c[d]||i;return a?n.createElement(k,l(l({ref:t},m),{},{components:a})):n.createElement(k,l({ref:t},m))}));function d(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=a.length,l=new Array(i);l[0]=u;var o={};for(var p in t)hasOwnProperty.call(t,p)&&(o[p]=t[p]);o.originalType=e,o.mdxType="string"==typeof e?e:r,l[1]=o;for(var s=2;s<i;s++)l[s]=a[s];return n.createElement.apply(null,l)}return n.createElement.apply(null,a)}u.displayName="MDXCreateElement"},63874:function(e,t,a){"use strict";a.r(t),a.d(t,{frontMatter:function(){return l},contentTitle:function(){return o},metadata:function(){return p},toc:function(){return s},default:function(){return c}});var n=a(74034),r=a(79973),i=(a(67294),a(3905)),l={layout:"homepage",title:"MikroORM v4",hide_title:!0},o=void 0,p={unversionedId:"index",id:"index",isDocsHomePage:!1,title:"MikroORM v4",description:"Table of contents",source:"@site/docs/index.md",sourceDirName:".",slug:"/index",permalink:"/docs/next/index",editUrl:"https://github.com/mikro-orm/mikro-orm/edit/master/docs/docs/index.md",version:"current",lastUpdatedBy:"Martin Ad\xe1mek",lastUpdatedAt:1627914910,formattedLastUpdatedAt:"8/2/2021",frontMatter:{layout:"homepage",title:"MikroORM v4",hide_title:!0}},s=[{value:"Table of contents",id:"table-of-contents",children:[]}],m={toc:s};function c(e){var t=e.components,a=(0,r.Z)(e,["components"]);return(0,i.kt)("wrapper",(0,n.Z)({},m,a,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h2",{id:"table-of-contents"},"Table of contents"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Overview",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/next/installation"},"Installation & Usage")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/next/defining-entities"},"Defining Entities")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/next/entity-manager"},"Persisting, Cascading and Fetching Entities with ",(0,i.kt)("inlineCode",{parentName:"a"},"EntityManager"))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/next/repositories"},"Using ",(0,i.kt)("inlineCode",{parentName:"a"},"EntityRepository")," instead of ",(0,i.kt)("inlineCode",{parentName:"a"},"EntityManager"))))),(0,i.kt)("li",{parentName:"ul"},"Fundamentals",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/next/identity-map"},"Identity Map and Request Context")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/next/entity-references"},"Entity References and ",(0,i.kt)("inlineCode",{parentName:"a"},"Reference<T>")," Wrapper")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/next/entity-constructors"},"Using Entity Constructors")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/next/relationships"},"Modelling Relationships")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/next/collections"},"Collections")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/next/unit-of-work"},"Unit of Work")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/next/transactions"},"Transactions")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/next/cascading"},"Cascading persist and remove")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/next/filters"},"Filters")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/next/deployment"},"Deployment")))),(0,i.kt)("li",{parentName:"ul"},"Advanced Features",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/next/nested-populate"},"Smart Nested Populate")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/next/query-conditions"},"Smart Query Conditions")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/next/query-builder"},"Using ",(0,i.kt)("inlineCode",{parentName:"a"},"QueryBuilder"))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/next/serializing"},"Serializing")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/next/entity-helper"},"Updating Entity Values with ",(0,i.kt)("inlineCode",{parentName:"a"},"Entity.assign()"))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/next/property-validation"},"Property Validation")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/next/lifecycle-hooks"},"Lifecycle Hooks")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/next/loading-strategies"},"Loading Strategies")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/next/naming-strategy"},"Naming Strategy")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/next/metadata-providers"},"Metadata Providers")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/next/metadata-cache"},"Metadata Cache")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/next/debugging"},"Debugging")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/next/schema-generator"},"Schema Generator")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/next/entity-generator"},"Entity Generator")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/next/migrations"},"Migrations")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/next/read-connections"},"Read Replica Connections")))),(0,i.kt)("li",{parentName:"ul"},"Usage with Different Drivers",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/next/usage-with-sql"},"Usage with SQL Drivers")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/next/usage-with-mongo"},"Usage with MongoDB")))),(0,i.kt)("li",{parentName:"ul"},"Recipes",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/next/usage-with-nestjs"},"Usage with NestJS")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/next/usage-with-js"},"Usage with Vanilla JS")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/next/custom-driver"},"Creating Custom Driver")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/next/multiple-schemas"},"Using Multiple Schemas")))),(0,i.kt)("li",{parentName:"ul"},"Example Integrations",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/mikro-orm/mikro-orm-examples/tree/master/express-ts"},"Express + MongoDB + TypeScript")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/mikro-orm/mikro-orm-examples/tree/master/nest"},"Nest + MySQL + TypeScript")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/mikro-orm/nestjs-realworld-example-app"},"RealWorld example app (Nest + MySQL)")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/mikro-orm/mikro-orm-examples/tree/master/express-js"},"Express + MongoDB + JavaScript")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/driescroons/mikro-orm-graphql-example"},"GraphQL + PostgreSQL + Typescript")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/PodaruDragos/inversify-example-app"},"Inversify + PostgreSQL")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/jonahallibone/mikro-orm-nextjs"},"NextJS + MySQL"))))))}c.isMDXComponent=!0}}]);