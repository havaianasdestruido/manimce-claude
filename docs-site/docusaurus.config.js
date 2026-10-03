const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;
/** @type {import('@docusaurus/types').Config} */
module.exports = {
  title: 'ManimCE Claude', tagline: 'A focused Manim Community Edition reference skill',
  favicon: 'img/favicon.svg', url: 'https://havaianasdestruido.github.io', baseUrl: '/manimce-claude/docs/',
  organizationName: 'havaianasdestruido', projectName: 'manimce-claude', trailingSlash: true,
  onBrokenLinks: 'throw', markdown: {hooks: {onBrokenMarkdownLinks: 'warn'}},
  presets: [['classic', {docs: {routeBasePath: '/', sidebarPath: require.resolve('./sidebars.js'), editUrl: 'https://github.com/havaianasdestruido/manimce-claude/edit/main/docs-site/'}, blog: false, pages: false, theme: {customCss: require.resolve('./src/css/custom.css')}}]],
  themeConfig: {
    metadata: [{name:'keywords',content:'ManimCE, Claude, AI skill, animation, Python'}],
    navbar: {title:'ManimCE Claude', logo:{alt:'ManimCE Claude',src:'img/logo.svg'}, items:[{type:'docSidebar',sidebarId:'tutorialSidebar',position:'left',label:'Guides'},{to:'/reference/skill-file',label:'Codebase',position:'left'},{href:'https://github.com/havaianasdestruido/manimce-claude',label:'GitHub',position:'right'}]},
    footer:{style:'dark',links:[{title:'Documentation',items:[{label:'Getting started',to:'/'},{label:'Manim guide',to:'/manim/core-concepts'}]},{title:'Project',items:[{label:'GitHub',href:'https://github.com/havaianasdestruido/manimce-claude'},{label:'Issues',href:'https://github.com/havaianasdestruido/manimce-claude/issues'}]}],copyright:`Copyright © ${new Date().getFullYear()} ManimCE Claude. MIT licensed.`},
    prism:{theme:lightCodeTheme,darkTheme:darkCodeTheme,additionalLanguages:['bash','python']}, colorMode:{defaultMode:'dark',respectPrefersColorScheme:true}
  }
};
