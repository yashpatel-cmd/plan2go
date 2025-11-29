// import React from "react";

// interface DestinationItem {
//   name: string;
//   country: string;
//   image: string;
// }

// // Famous places around the world
// const destinations: DestinationItem[] = [
//   {
//     name: "Eiffel Tower",
//     country: "France",
//     image:
//       "https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=800&q=60",
//   },
//   {
//     name: "Taj Mahal",
//     country: "India",
//     image:
//       "https://images.unsplash.com/photo-1598401039489-65f30bdfddaf?auto=format&fit=crop&w=800&q=60",
//   },
//   {
//     name: "Great Wall of China",
//     country: "China",
//     image:
//       "https://images.unsplash.com/photo-1582783490817-8f13f63ed7bf?auto=format&fit=crop&w=800&q=60",
//   },
//   {
//     name: "Statue of Liberty",
//     country: "USA",
//     image:
//       "https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?auto=format&fit=crop&w=800&q=60",
//   },
//   {
//     name: "Sydney Opera House",
//     country: "Australia",
//     image:
//       "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=800&q=60",
//   },
//   {
//     name: "Santorini",
//     country: "Greece",
//     image:
//       "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=800&q=60",
//   },
//   {
//     name: "Mount Fuji",
//     country: "Japan",
//     image:
//       "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=60",
//   },
//   {
//     name: "Machu Picchu",
//     country: "Peru",
//     image:
//       "https://images.unsplash.com/photo-1509112756314-34a0badb29d4?auto=format&fit=crop&w=800&q=60",
//   },
//   {
//     name: "Burj Khalifa",
//     country: "UAE",
//     image:
//       "https://images.unsplash.com/photo-1504275107627-0c2ba7a43dba?auto=format&fit=crop&w=800&q=60",
//   },
//   {
//     name: "Niagara Falls",
//     country: "Canada",
//     image:
//       "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=60",
//   },
// ];

// const Destination: React.FC = () => {
//   return (
//     <div className="px-6 py-12">
//       <h1 className="text-4xl font-bold text-center mb-10 text-blue-600">
//         Explore Famous Places Around the World
//       </h1>

//       {/* Card Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//         {destinations.map((dest, index) => (
//           <div
//             key={index}
//             className="rounded-xl overflow-hidden shadow-lg hover:scale-105 transition duration-300 cursor-pointer"
//           >
//             <img
//               src={dest.image}
//               alt={dest.name}
//               className="w-full h-48 object-cover"
//             />

//             <div className="p-4 bg-white">
//               <h2 className="text-xl font-semibold">{dest.name}</h2>
//               <p className="text-gray-500">{dest.country}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Destination;
