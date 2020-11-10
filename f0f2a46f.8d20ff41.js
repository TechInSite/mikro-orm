(window.webpackJsonp=window.webpackJsonp||[]).push([[692],{751:function(e,n,t){"use strict";t.r(n),t.d(n,"frontMatter",(function(){return o})),t.d(n,"metadata",(function(){return l})),t.d(n,"rightToc",(function(){return s})),t.d(n,"default",(function(){return c}));var r=t(1),a=t(6),i=(t(0),t(807)),o={title:"Naming Strategy"},l={unversionedId:"naming-strategy",id:"version-4.1/naming-strategy",isDocsHomePage:!1,title:"Naming Strategy",description:"When mapping your entities to database tables and columns, their names will be defined by naming",source:"@site/versioned_docs/version-4.1/naming-strategy.md",slug:"/naming-strategy",permalink:"/docs/4.1/naming-strategy",editUrl:"https://github.com/mikro-orm/mikro-orm/edit/master/docs/versioned_docs/version-4.1/naming-strategy.md",version:"4.1",lastUpdatedBy:"Martin Ad\xe1mek",lastUpdatedAt:1605040928,sidebar:"version-4.1/docs",previous:{title:"Relationship Loading Strategies",permalink:"/docs/4.1/loading-strategies"},next:{title:"Composite and Foreign Keys as Primary Key",permalink:"/docs/4.1/composite-keys"}},s=[{value:"Naming Strategy in mongo driver",id:"naming-strategy-in-mongo-driver",children:[]},{value:"Naming Strategy in SQL drivers",id:"naming-strategy-in-sql-drivers",children:[]},{value:"NamingStrategy API",id:"namingstrategy-api",children:[]}],m={rightToc:s};function c(e){var n=e.components,t=Object(a.a)(e,["components"]);return Object(i.b)("wrapper",Object(r.a)({},m,t,{components:n,mdxType:"MDXLayout"}),Object(i.b)("p",null,"When mapping your entities to database tables and columns, their names will be defined by naming\nstrategy. There are 3 basic naming strategies you can choose from:"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("inlineCode",{parentName:"li"},"UnderscoreNamingStrategy")," - default of all SQL drivers"),Object(i.b)("li",{parentName:"ul"},Object(i.b)("inlineCode",{parentName:"li"},"MongoNamingStrategy")," - default of ",Object(i.b)("inlineCode",{parentName:"li"},"MongoDriver")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("inlineCode",{parentName:"li"},"EntityCaseNamingStrategy")," - uses unchanged entity and property names")),Object(i.b)("p",null,"You can override this when initializing ORM. You can also provide your own naming strategy, just\nimplement ",Object(i.b)("inlineCode",{parentName:"p"},"NamingStrategy")," interface and provide your implementation when bootstrapping ORM:"),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript"}),"class YourCustomNamingStrategy implements NamingStrategy {\n  ...\n}\n\nconst orm = await MikroORM.init({\n  ...\n  namingStrategy: YourCustomNamingStrategy,\n  ...\n});\n")),Object(i.b)("blockquote",null,Object(i.b)("p",{parentName:"blockquote"},"You can also extend ",Object(i.b)("inlineCode",{parentName:"p"},"AbstractNamingStrategy")," which implements one method for you - ",Object(i.b)("inlineCode",{parentName:"p"},"getClassName()"),"\nthat is used to map entity file name to class name.")),Object(i.b)("h2",{id:"naming-strategy-in-mongo-driver"},"Naming Strategy in mongo driver"),Object(i.b)("p",null,Object(i.b)("inlineCode",{parentName:"p"},"MongoNamingStrategy")," will simply use all field names as they are defined. Collection names will\nbe translated into lower-cased dashed form:"),Object(i.b)("p",null,Object(i.b)("inlineCode",{parentName:"p"},"MyCoolEntity")," will be translated into ",Object(i.b)("inlineCode",{parentName:"p"},"my-cool-entity")," collection name."),Object(i.b)("h2",{id:"naming-strategy-in-sql-drivers"},"Naming Strategy in SQL drivers"),Object(i.b)("p",null,Object(i.b)("inlineCode",{parentName:"p"},"MySqlDriver")," defaults to ",Object(i.b)("inlineCode",{parentName:"p"},"UnderscoreNamingStrategy"),", which means your all your database tables and\ncolumns will be lower-cased and words divided by underscored:"),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-sql"}),"CREATE TABLE `author` (\n  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,\n  `created_at` datetime(3) DEFAULT NULL,\n  `updated_at` datetime(3) DEFAULT NULL,\n  `terms_accepted` tinyint(1) DEFAULT NULL,\n  `name` varchar(255) DEFAULT NULL,\n  `email` varchar(255) DEFAULT NULL,\n  `born` datetime DEFAULT NULL,\n  `favourite_book_id` int(11) DEFAULT NULL,\n  PRIMARY KEY (`id`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8;\n")),Object(i.b)("h2",{id:"namingstrategy-api"},"NamingStrategy API"),Object(i.b)("h4",{id:"namingstrategygetclassnamefile-string-separator-string-string"},Object(i.b)("inlineCode",{parentName:"h4"},"NamingStrategy.getClassName(file: string, separator?: string): string")),Object(i.b)("p",null,"Return a name of the class based on its file name."),Object(i.b)("hr",null),Object(i.b)("h4",{id:"namingstrategyclasstotablenameentityname-string-string"},Object(i.b)("inlineCode",{parentName:"h4"},"NamingStrategy.classToTableName(entityName: string): string")),Object(i.b)("p",null,"Return a table name for an entity class."),Object(i.b)("hr",null),Object(i.b)("h4",{id:"namingstrategypropertytocolumnnamepropertyname-string-string"},Object(i.b)("inlineCode",{parentName:"h4"},"NamingStrategy.propertyToColumnName(propertyName: string): string")),Object(i.b)("p",null,"Return a column name for a property."),Object(i.b)("hr",null),Object(i.b)("h4",{id:"namingstrategyreferencecolumnname-string"},Object(i.b)("inlineCode",{parentName:"h4"},"NamingStrategy.referenceColumnName(): string")),Object(i.b)("p",null,"Return the default reference column name."),Object(i.b)("hr",null),Object(i.b)("h4",{id:"namingstrategyjoincolumnnamepropertyname-string-string"},Object(i.b)("inlineCode",{parentName:"h4"},"NamingStrategy.joinColumnName(propertyName: string): string")),Object(i.b)("p",null,"Return a join column name for a property."),Object(i.b)("hr",null),Object(i.b)("h4",{id:"namingstrategyjointablenamesourceentity-string-targetentity-string-propertyname-string-string"},Object(i.b)("inlineCode",{parentName:"h4"},"NamingStrategy.joinTableName(sourceEntity: string, targetEntity: string, propertyName: string): string")),Object(i.b)("p",null,"Return a join table name. This is used as default value for ",Object(i.b)("inlineCode",{parentName:"p"},"pivotTable"),". "),Object(i.b)("hr",null),Object(i.b)("h4",{id:"namingstrategyjoinkeycolumnnameentityname-string-referencedcolumnname-string-string"},Object(i.b)("inlineCode",{parentName:"h4"},"NamingStrategy.joinKeyColumnName(entityName: string, referencedColumnName?: string): string")),Object(i.b)("p",null,"Return the foreign key column name for the given parameters."),Object(i.b)("hr",null))}c.isMDXComponent=!0},807:function(e,n,t){"use strict";t.d(n,"a",(function(){return g})),t.d(n,"b",(function(){return u}));var r=t(0),a=t.n(r);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function l(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var m=a.a.createContext({}),c=function(e){var n=a.a.useContext(m),t=n;return e&&(t="function"==typeof e?e(n):l(l({},n),e)),t},g=function(e){var n=c(e.components);return a.a.createElement(m.Provider,{value:n},e.children)},b={inlineCode:"code",wrapper:function(e){var n=e.children;return a.a.createElement(a.a.Fragment,{},n)}},p=a.a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,i=e.originalType,o=e.parentName,m=s(e,["components","mdxType","originalType","parentName"]),g=c(t),p=r,u=g["".concat(o,".").concat(p)]||g[p]||b[p]||i;return t?a.a.createElement(u,l(l({ref:n},m),{},{components:t})):a.a.createElement(u,l({ref:n},m))}));function u(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var i=t.length,o=new Array(i);o[0]=p;var l={};for(var s in n)hasOwnProperty.call(n,s)&&(l[s]=n[s]);l.originalType=e,l.mdxType="string"==typeof e?e:r,o[1]=l;for(var m=2;m<i;m++)o[m]=t[m];return a.a.createElement.apply(null,o)}return a.a.createElement.apply(null,t)}p.displayName="MDXCreateElement"}}]);