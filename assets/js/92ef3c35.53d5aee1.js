(window.webpackJsonp=window.webpackJsonp||[]).push([[529],{1026:function(e,t,a){"use strict";a.d(t,"a",(function(){return p})),a.d(t,"b",(function(){return O}));var r=a(0),n=a.n(r);function i(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function b(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function c(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?b(Object(a),!0).forEach((function(t){i(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):b(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},i=Object.keys(e);for(r=0;r<i.length;r++)a=i[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)a=i[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var l=n.a.createContext({}),m=function(e){var t=n.a.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):c(c({},t),e)),a},p=function(e){var t=m(e.components);return n.a.createElement(l.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return n.a.createElement(n.a.Fragment,{},t)}},d=n.a.forwardRef((function(e,t){var a=e.components,r=e.mdxType,i=e.originalType,b=e.parentName,l=o(e,["components","mdxType","originalType","parentName"]),p=m(a),d=r,O=p["".concat(b,".").concat(d)]||p[d]||s[d]||i;return a?n.a.createElement(O,c(c({ref:t},l),{},{components:a})):n.a.createElement(O,c({ref:t},l))}));function O(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=a.length,b=new Array(i);b[0]=d;var c={};for(var o in t)hasOwnProperty.call(t,o)&&(c[o]=t[o]);c.originalType=e,c.mdxType="string"==typeof e?e:r,b[1]=c;for(var l=2;l<i;l++)b[l]=a[l];return n.a.createElement.apply(null,b)}return n.a.createElement.apply(null,a)}d.displayName="MDXCreateElement"},602:function(e,t,a){"use strict";a.r(t),a.d(t,"frontMatter",(function(){return b})),a.d(t,"metadata",(function(){return c})),a.d(t,"toc",(function(){return o})),a.d(t,"default",(function(){return m}));var r=a(3),n=a(8),i=(a(0),a(1026)),b={id:"migrations",title:"Module: migrations",sidebar_label:"migrations",custom_edit_url:null,hide_title:!0},c={unversionedId:"api/modules/migrations",id:"api/modules/migrations",isDocsHomePage:!1,title:"Module: migrations",description:"Module: migrations",source:"@site/docs/api/modules/migrations.md",slug:"/api/modules/migrations",permalink:"/docs/next/api/modules/migrations",editUrl:null,version:"current",sidebar_label:"migrations",sidebar:"API",previous:{title:"Module: knex",permalink:"/docs/next/api/modules/knex"},next:{title:"Module: reflection",permalink:"/docs/next/api/modules/reflection"}},o=[{value:"Table of contents",id:"table-of-contents",children:[{value:"Classes",id:"classes",children:[]}]},{value:"Type aliases",id:"type-aliases",children:[{value:"MigrateOptions",id:"migrateoptions",children:[]},{value:"MigrationResult",id:"migrationresult",children:[]},{value:"MigrationRow",id:"migrationrow",children:[]},{value:"Query",id:"query",children:[]},{value:"UmzugMigration",id:"umzugmigration",children:[]}]}],l={toc:o};function m(e){var t=e.components,a=Object(n.a)(e,["components"]);return Object(i.b)("wrapper",Object(r.a)({},l,a,{components:t,mdxType:"MDXLayout"}),Object(i.b)("h1",{id:"module-migrations"},"Module: migrations"),Object(i.b)("h2",{id:"table-of-contents"},"Table of contents"),Object(i.b)("h3",{id:"classes"},"Classes"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("a",{parentName:"li",href:"/docs/next/api/classes/migrations.migration"},"Migration")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("a",{parentName:"li",href:"/docs/next/api/classes/migrations.migrationgenerator"},"MigrationGenerator")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("a",{parentName:"li",href:"/docs/next/api/classes/migrations.migrationrunner"},"MigrationRunner")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("a",{parentName:"li",href:"/docs/next/api/classes/migrations.migrationstorage"},"MigrationStorage")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("a",{parentName:"li",href:"/docs/next/api/classes/migrations.migrator"},"Migrator"))),Object(i.b)("h2",{id:"type-aliases"},"Type aliases"),Object(i.b)("h3",{id:"migrateoptions"},"MigrateOptions"),Object(i.b)("p",null,"\u01ac ",Object(i.b)("strong",{parentName:"p"},"MigrateOptions"),": ",Object(i.b)("em",{parentName:"p"},"object")),Object(i.b)("h4",{id:"type-declaration"},"Type declaration:"),Object(i.b)("table",null,Object(i.b)("thead",{parentName:"table"},Object(i.b)("tr",{parentName:"thead"},Object(i.b)("th",{parentName:"tr",align:"left"},"Name"),Object(i.b)("th",{parentName:"tr",align:"left"},"Type"))),Object(i.b)("tbody",{parentName:"table"},Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:"left"},Object(i.b)("inlineCode",{parentName:"td"},"from?")),Object(i.b)("td",{parentName:"tr",align:"left"},Object(i.b)("em",{parentName:"td"},"string")," ","|"," ",Object(i.b)("em",{parentName:"td"},"number"))),Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:"left"},Object(i.b)("inlineCode",{parentName:"td"},"migrations?")),Object(i.b)("td",{parentName:"tr",align:"left"},Object(i.b)("em",{parentName:"td"},"string"),"[]")),Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:"left"},Object(i.b)("inlineCode",{parentName:"td"},"to?")),Object(i.b)("td",{parentName:"tr",align:"left"},Object(i.b)("em",{parentName:"td"},"string")," ","|"," ",Object(i.b)("em",{parentName:"td"},"number"))),Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:"left"},Object(i.b)("inlineCode",{parentName:"td"},"transaction?")),Object(i.b)("td",{parentName:"tr",align:"left"},Object(i.b)("a",{parentName:"td",href:"/docs/next/api/modules/core#transaction"},Object(i.b)("em",{parentName:"a"},"Transaction")))))),Object(i.b)("p",null,"Defined in: ",Object(i.b)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/f779c26/packages/migrations/src/typings.ts#L4"},"packages/migrations/src/typings.ts:4")),Object(i.b)("hr",null),Object(i.b)("h3",{id:"migrationresult"},"MigrationResult"),Object(i.b)("p",null,"\u01ac ",Object(i.b)("strong",{parentName:"p"},"MigrationResult"),": ",Object(i.b)("em",{parentName:"p"},"object")),Object(i.b)("h4",{id:"type-declaration-1"},"Type declaration:"),Object(i.b)("table",null,Object(i.b)("thead",{parentName:"table"},Object(i.b)("tr",{parentName:"thead"},Object(i.b)("th",{parentName:"tr",align:"left"},"Name"),Object(i.b)("th",{parentName:"tr",align:"left"},"Type"))),Object(i.b)("tbody",{parentName:"table"},Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:"left"},Object(i.b)("inlineCode",{parentName:"td"},"code")),Object(i.b)("td",{parentName:"tr",align:"left"},Object(i.b)("em",{parentName:"td"},"string"))),Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:"left"},Object(i.b)("inlineCode",{parentName:"td"},"diff")),Object(i.b)("td",{parentName:"tr",align:"left"},Object(i.b)("em",{parentName:"td"},"string"),"[]")),Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:"left"},Object(i.b)("inlineCode",{parentName:"td"},"fileName")),Object(i.b)("td",{parentName:"tr",align:"left"},Object(i.b)("em",{parentName:"td"},"string"))))),Object(i.b)("p",null,"Defined in: ",Object(i.b)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/f779c26/packages/migrations/src/typings.ts#L5"},"packages/migrations/src/typings.ts:5")),Object(i.b)("hr",null),Object(i.b)("h3",{id:"migrationrow"},"MigrationRow"),Object(i.b)("p",null,"\u01ac ",Object(i.b)("strong",{parentName:"p"},"MigrationRow"),": ",Object(i.b)("em",{parentName:"p"},"object")),Object(i.b)("h4",{id:"type-declaration-2"},"Type declaration:"),Object(i.b)("table",null,Object(i.b)("thead",{parentName:"table"},Object(i.b)("tr",{parentName:"thead"},Object(i.b)("th",{parentName:"tr",align:"left"},"Name"),Object(i.b)("th",{parentName:"tr",align:"left"},"Type"))),Object(i.b)("tbody",{parentName:"table"},Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:"left"},Object(i.b)("inlineCode",{parentName:"td"},"executed_at")),Object(i.b)("td",{parentName:"tr",align:"left"},"Date")),Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:"left"},Object(i.b)("inlineCode",{parentName:"td"},"name")),Object(i.b)("td",{parentName:"tr",align:"left"},Object(i.b)("em",{parentName:"td"},"string"))))),Object(i.b)("p",null,"Defined in: ",Object(i.b)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/f779c26/packages/migrations/src/typings.ts#L6"},"packages/migrations/src/typings.ts:6")),Object(i.b)("hr",null),Object(i.b)("h3",{id:"query"},"Query"),Object(i.b)("p",null,"\u01ac ",Object(i.b)("strong",{parentName:"p"},"Query"),": ",Object(i.b)("em",{parentName:"p"},"string")," ","|"," Knex.QueryBuilder ","|"," Knex.Raw"),Object(i.b)("p",null,"Defined in: ",Object(i.b)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/f779c26/packages/migrations/src/Migration.ts#L4"},"packages/migrations/src/Migration.ts:4")),Object(i.b)("hr",null),Object(i.b)("h3",{id:"umzugmigration"},"UmzugMigration"),Object(i.b)("p",null,"\u01ac ",Object(i.b)("strong",{parentName:"p"},"UmzugMigration"),": ",Object(i.b)("em",{parentName:"p"},"object")),Object(i.b)("h4",{id:"type-declaration-3"},"Type declaration:"),Object(i.b)("table",null,Object(i.b)("thead",{parentName:"table"},Object(i.b)("tr",{parentName:"thead"},Object(i.b)("th",{parentName:"tr",align:"left"},"Name"),Object(i.b)("th",{parentName:"tr",align:"left"},"Type"))),Object(i.b)("tbody",{parentName:"table"},Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:"left"},Object(i.b)("inlineCode",{parentName:"td"},"file")),Object(i.b)("td",{parentName:"tr",align:"left"},Object(i.b)("em",{parentName:"td"},"string"))),Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:"left"},Object(i.b)("inlineCode",{parentName:"td"},"name?")),Object(i.b)("td",{parentName:"tr",align:"left"},Object(i.b)("em",{parentName:"td"},"string"))),Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:"left"},Object(i.b)("inlineCode",{parentName:"td"},"path?")),Object(i.b)("td",{parentName:"tr",align:"left"},Object(i.b)("em",{parentName:"td"},"string"))))),Object(i.b)("p",null,"Defined in: ",Object(i.b)("a",{parentName:"p",href:"https://github.com/mikro-orm/mikro-orm/blob/f779c26/packages/migrations/src/typings.ts#L3"},"packages/migrations/src/typings.ts:3")))}m.isMDXComponent=!0}}]);