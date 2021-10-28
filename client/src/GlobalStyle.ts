import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
   /* roboto-300 - latin */
//   @font-face {
//     font-family: 'Roboto';
//     font-style: normal;
//     font-weight: 300;
//     src: url('../fonts/roboto-v27-latin-300.eot'); /* IE9 Compat Modes */
//     src: local(''),
//          url('../fonts/roboto-v27-latin-300.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
//          url('../fonts/roboto-v27-latin-300.woff2') format('woff2'), /* Super Modern Browsers */
//          url('../fonts/roboto-v27-latin-300.woff') format('woff'), /* Modern Browsers */
//          url('../fonts/roboto-v27-latin-300.ttf') format('truetype'), /* Safari, Android, iOS */
//          url('../fonts/roboto-v27-latin-300.svg#Roboto') format('svg'); /* Legacy iOS */
//   }

   *{
        margin: 0;
        padding: 0;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        font-family: "Roboto", sans-serif;
   }

   /* This is here to make my eyes hurt less at night */
   body{
      background-color: #292929;
   }

   /* html {
        font-size: 62.5%;
   } */
   `;

export default GlobalStyle;
