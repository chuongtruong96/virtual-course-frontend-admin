// // Example: defineRoutes.js
// const defineRoutes = (routesArray) => {
//     return routesArray.map((route, index) => {
//       if (route.children) {
//         return (
//           <route key={index} path={route.path} element={route.element}>
//             {defineRoutes(route.children)}
//           </route>
//         );
//       }
//       return <Route key={index} path={route.path} element={route.element} />;
//     });
//   };
  
//   export default defineRoutes;
  